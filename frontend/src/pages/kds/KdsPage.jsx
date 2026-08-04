import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kitchenApi } from '../../api/kitchenApi';
import { useAuth } from '../../context/AuthContext';
import { useActionGuard } from '../../hooks/useActionGuard';
import { Client } from '@stomp/stompjs';
import { 
  ArrowLeft, Tv, Clock, CheckCircle2, Flame, 
  RefreshCw, Wifi, WifiOff, UtensilsCrossed 
} from 'lucide-react';

export const KdsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState('ALL');
  const [wsConnected, setWsConnected] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const { user } = useAuth();
  const { isPending } = useActionGuard();
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await kitchenApi.getActiveTickets(selectedStation);
      setTickets(data);
    } catch (err) {
      console.error("Failed to load KDS tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Clock ticker
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // STOMP Client Setup using native WebSocket
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws/kitchen/websocket',
      reconnectDelay: 5000,
      onConnect: () => {
        setWsConnected(true);
        client.subscribe('/topic/kitchen/tickets', (message) => {
          if (message.body) {
            try {
              const updatedTicket = JSON.parse(message.body);
              setTickets(prev => {
                const existingIdx = prev.findIndex(t => t.id === updatedTicket.id);
                if (existingIdx > -1) {
                  const newTickets = [...prev];
                  newTickets[existingIdx] = updatedTicket;
                  return newTickets;
                } else {
                  return [updatedTicket, ...prev];
                }
              });
            } catch (e) {
              fetchTickets();
            }
          }
        });
      },
      onDisconnect: () => {
        setWsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
        setWsConnected(false);
      }
    });

    client.activate();

    return () => {
      clearInterval(timer);
      client.deactivate();
    };
  }, [selectedStation]);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    if (isPending) {
      alert("Not yet approved user role. Please wait for an Admin to approve your account.");
      return;
    }
    try {
      const updated = await kitchenApi.updateTicketStatus(ticketId, newStatus);
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
    } catch (err) {
      console.error("Failed to update ticket status", err);
    }
  };

  const getPrepTimeAgo = (printedAtStr) => {
    if (!printedAtStr) return 'Just now';
    const mins = Math.floor((new Date() - new Date(printedAtStr)) / 60000);
    if (mins <= 0) return 'Just now';
    return `${mins}m ago`;
  };

  const stations = ['ALL', 'KITCHEN', 'BAR'];
  const filteredTickets = selectedStation === 'ALL'
    ? tickets
    : tickets.filter(t => t.station === selectedStation);

  const queuedCount = tickets.filter(t => t.status === 'QUEUED').length;
  const preparingCount = tickets.filter(t => t.status === 'PREPARING').length;
  const readyCount = tickets.filter(t => t.status === 'READY').length;

  return (
    <div className="min-h-screen bg-[#0d1217] text-slate-100 p-6 flex flex-col font-sans">
      {/* Top KDS Navbar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#11161d] border border-amber-500/30 backdrop-blur-2xl p-4 px-6 rounded-3xl mb-6 shadow-2xl shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/welcome')}
            className="p-2.5 bg-[#07090c] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
            title="Return to Role Launchpad"
          >
            <ArrowLeft className="w-5 h-5 text-amber-400" />
          </button>
          
          {/* Executive Chef Photo Avatar */}
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150" 
                alt="Executive Kitchen Chef" 
                className="w-10 h-10 rounded-2xl object-cover border-2 border-rose-500 shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-rose-500 border-2 border-[#11161d] rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-extrabold text-white tracking-tight">Executive Chef Station</h1>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  👨‍🍳 KDS Dispatch
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Maison Ceylon • Live Ticket Queue & Cooking Timers</p>
            </div>
          </div>
        </div>

        {/* Status Indicators & Station Filter */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          {/* WebSocket Status Indicator */}
          <div className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold ${
            wsConnected 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {wsConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{wsConnected ? 'STOMP Live' : 'Offline'}</span>
          </div>

          {/* Clock Ticker */}
          <div className="bg-[#0d1217] px-3.5 py-2 rounded-2xl border border-slate-800 text-xs font-mono font-bold text-slate-300">
            {time}
          </div>

          {/* Station Selector */}
          <div className="flex bg-[#0d1217] p-1 rounded-2xl border border-slate-800 text-xs font-extrabold">
            {stations.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStation(st)}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                  selectedStation === st ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={fetchTickets}
            className="p-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Ticket Queue Metric Summary Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-[#141a22] border border-orange-500/20 p-4 rounded-3xl shadow-lg bg-gradient-to-b from-orange-500/5 to-transparent">
          <div className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">Queued Orders</div>
          <div className="text-2xl font-black text-orange-400">{queuedCount}</div>
        </div>
        <div className="bg-[#141a22] border border-amber-500/20 p-4 rounded-3xl shadow-lg bg-gradient-to-b from-amber-500/5 to-transparent">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Preparing Now</div>
          <div className="text-2xl font-black text-amber-400">{preparingCount}</div>
        </div>
        <div className="bg-[#141a22] border border-emerald-500/20 p-4 rounded-3xl shadow-lg bg-gradient-to-b from-emerald-500/5 to-transparent">
          <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Ready for Pickup</div>
          <div className="text-2xl font-black text-emerald-400">{readyCount}</div>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#141a22] border border-slate-800/80 rounded-3xl p-12 text-center">
          <UtensilsCrossed className="w-16 h-16 text-slate-600 mb-3" />
          <h3 className="text-lg font-extrabold text-slate-300">All Kitchen Orders Clear!</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">New incoming orders sent from the POS terminal will instantly appear on this screen live.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pr-2">
          {filteredTickets.map(t => {
            const isQueued = t.status === 'QUEUED';
            const isPreparing = t.status === 'PREPARING';
            const isReady = t.status === 'READY';

            return (
              <div
                key={t.id}
                className={`bg-[#141a22] border rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden transition transform hover:-translate-y-1 ${
                  isQueued ? 'border-orange-500/40 shadow-orange-500/5' :
                  isPreparing ? 'border-amber-500/40 shadow-amber-500/5' :
                  'border-emerald-500/40 shadow-emerald-500/5'
                }`}
              >
                {/* Status Color Glow Top Bar */}
                <div className={`h-2 w-full absolute top-0 left-0 ${
                  isQueued ? 'bg-orange-500 animate-pulse' :
                  isPreparing ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3 pt-1">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-black text-white">Ticket #{t.id}</span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-[#0d1217] text-slate-300 border border-slate-800">
                          Order #{t.order?.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {t.order?.orderType} • {t.order?.table ? `Table ${t.order.table.tableNumber}` : 'Takeaway'}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider ${
                      isQueued ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      isPreparing ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  {/* Prep Time Timer */}
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-[#0d1217] px-3 py-2 rounded-2xl border border-slate-800/80 mb-4">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>Printed: <strong className="text-slate-200">{getPrepTimeAgo(t.printedAt)}</strong></span>
                    <span className="ml-auto font-mono text-[11px] text-slate-500">{t.station}</span>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-3 mb-4">
                    {t.order?.items?.map((item, i) => (
                      <div key={i} className="bg-[#0d1217]/80 p-3 rounded-2xl border border-slate-800/60">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white text-sm">
                            <span className="text-orange-400 font-black mr-2">{item.quantity}x</span>
                            {item.menuItem?.name || 'Dish Item'}
                          </span>
                        </div>

                        {item.notes && (
                          <p className="text-xs text-amber-300/90 font-medium italic mt-1 pl-3 border-l-2 border-amber-500/40">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-3 border-t border-slate-800">
                  {isQueued && (
                    <button
                      onClick={() => handleUpdateStatus(t.id, 'PREPARING')}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/20 text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Start Preparing</span>
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => handleUpdateStatus(t.id, 'READY')}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Ready</span>
                    </button>
                  )}

                  {isReady && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-emerald-400 font-extrabold text-xs flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ready for Service</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
