import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Utensils, ChefHat, Clock, CheckCircle2, Flame, Bike, 
  MapPin, Phone, ArrowLeft, Search, RefreshCw, ShoppingBag, AlertCircle, Sparkles, Tag
} from 'lucide-react';
import { ordersApi } from '../../api/ordersApi';
import { Client } from '@stomp/stompjs';

export const OrderTrackingPage = () => {
  const { orderId: pathOrderId } = useParams();
  const [searchParams] = useSearchParams();
  const queryOrderId = searchParams.get('id');
  const navigate = useNavigate();

  const [inputOrderId, setInputOrderId] = useState(pathOrderId || queryOrderId || '');
  const [activeOrderId, setActiveOrderId] = useState(pathOrderId || queryOrderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveStatus, setLiveStatus] = useState('RECEIVED'); // RECEIVED, PREPARING, READY, SERVED
  const [prepTimeLeft, setPrepTimeLeft] = useState(15); // Default prep countdown mins

  useEffect(() => {
    if (activeOrderId) {
      fetchOrderDetails(activeOrderId);
      setupWebSocket(activeOrderId);
    }
  }, [activeOrderId]);

  // Countdown timer simulation for prep time
  useEffect(() => {
    if (liveStatus === 'PREPARING' && prepTimeLeft > 0) {
      const timer = setInterval(() => {
        setPrepTimeLeft(prev => Math.max(0, prev - 1));
      }, 60000); // every minute
      return () => clearInterval(timer);
    }
  }, [liveStatus, prepTimeLeft]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      setError('');
      const data = await ordersApi.getOrderById(id);
      setOrder(data);
      mapOrderStatusToLiveStage(data.status);
    } catch (err) {
      console.error("Failed to fetch order tracking info", err);
      setError("Order not found. Please verify your Order ID.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const mapOrderStatusToLiveStage = (backendStatus) => {
    switch (backendStatus) {
      case 'OPEN':
      case 'SENT':
      case 'RECEIVED':
        setLiveStatus('RECEIVED');
        setPrepTimeLeft(18);
        break;
      case 'IN_PREPARATION':
      case 'PREPARING':
      case 'COOKING':
        setLiveStatus('PREPARING');
        setPrepTimeLeft(12);
        break;
      case 'READY':
      case 'DELIVERING':
        setLiveStatus('READY');
        setPrepTimeLeft(0);
        break;
      case 'SERVED':
      case 'PAID':
      case 'COMPLETED':
        setLiveStatus('SERVED');
        setPrepTimeLeft(0);
        break;
      default:
        setLiveStatus('RECEIVED');
    }
  };

  const setupWebSocket = (targetOrderId) => {
    try {
      const client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("WebSocket connected for Order Tracking:", targetOrderId);
          client.subscribe('/topic/kds', (message) => {
            try {
              const ticketUpdate = JSON.parse(message.body);
              if (String(ticketUpdate.orderId) === String(targetOrderId)) {
                mapOrderStatusToLiveStage(ticketUpdate.status);
              }
            } catch (e) {
              console.error("Error parsing websocket message", e);
            }
          });
        }
      });
      client.activate();
      return () => client.deactivate();
    } catch (e) {
      console.warn("WebSocket fallback to polling", e);
    }
  };

  const handleSearchOrder = (e) => {
    e.preventDefault();
    if (!inputOrderId.trim()) return;
    
    // Extract only digits from the input (e.g., "Ticket #7" -> "7")
    const numericId = inputOrderId.replace(/\D/g, '');
    
    if (!numericId) {
      setError("Please enter a valid numeric Order ID.");
      setOrder(null);
      return;
    }

    setActiveOrderId(numericId);
    navigate(`/track/${numericId}`);
  };

  // Pipeline stages configuration
  const stages = [
    { key: 'RECEIVED', label: 'Order Received', icon: ShoppingBag, desc: 'Kitchen acknowledged order' },
    { key: 'PREPARING', label: 'Cooking in Kitchen', icon: ChefHat, desc: 'Chefs preparing your food' },
    { key: 'READY', label: 'Ready / Dispatched', icon: Flame, desc: 'Plated & ready for service' },
    { key: 'SERVED', label: 'Served & Enjoy', icon: CheckCircle2, desc: 'Delivered to your table' }
  ];

  const getStageIndex = (key) => stages.findIndex(s => s.key === key);
  const currentStageIndex = getStageIndex(liveStatus);

  return (
    <div className="min-h-screen bg-[#0d1217] text-slate-100 font-sans pb-16 selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#131922]/95 border-b border-slate-800/80 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/order')}
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer px-3 py-1.5 rounded-xl bg-[#0d1217] border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>Back to Menu</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-orange-500/20">
              MC
            </div>
            <span className="text-sm font-extrabold text-white tracking-tight">Live Order Tracker</span>
          </div>

          <button
            onClick={() => activeOrderId && fetchOrderDetails(activeOrderId)}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-[#0d1217] border border-slate-800 transition cursor-pointer"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Order Lookup Bar */}
        <div className="bg-[#141a22] border border-slate-800/80 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                <span>Track Your Dining Order</span>
                <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black rounded-full uppercase tracking-wider">
                  Real-Time
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Enter your Order ID to monitor live kitchen preparation status</p>
            </div>
          </div>

          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. 101, 102)"
                value={inputOrderId}
                onChange={(e) => setInputOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0d1217] border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-extrabold"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center space-x-2 shrink-0"
            >
              <span>Track Live</span>
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-[#141a22] border border-slate-800 rounded-3xl p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500 mx-auto mb-3"></div>
            <p className="text-xs text-slate-400 font-bold">Connecting to Kitchen Display Stream...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-3xl text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-extrabold text-white">{error}</h3>
            <p className="text-xs text-slate-400">Please check the receipt or Order ID provided by staff.</p>
          </div>
        ) : order ? (
          <>
            {/* Live Progress Pipeline Card */}
            <div className="bg-[#141a22] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-black text-white">Order #{order.id}</h3>
                    <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-black text-xs rounded-xl">
                      {order.orderType?.replace('_', ' ') || 'DINE IN'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Customer: <span className="text-slate-200 font-bold">{order.customer?.name || order.customerName || 'Guest'}</span> • 
                    Table: <span className="text-slate-200 font-bold">#{order.table?.tableNumber || 'Self-Order'}</span>
                  </p>
                </div>

                {liveStatus === 'PREPARING' && prepTimeLeft > 0 && (
                  <div className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 rounded-2xl flex items-center space-x-2 shrink-0">
                    <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-slate-400">Est. Prep Time</div>
                      <div className="text-sm font-black text-orange-400">{prepTimeLeft} Mins</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Steps Timeline */}
              <div className="py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {stages.map((st, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const IconComp = st.icon;

                    return (
                      <div 
                        key={st.key}
                        className={`p-4 rounded-2xl border transition-all duration-500 relative flex flex-col items-center text-center space-y-2 ${
                          isCurrent 
                            ? 'bg-gradient-to-b from-orange-500/20 to-amber-500/10 border-orange-500/60 shadow-xl shadow-orange-500/10 scale-105 z-10' 
                            : isDone 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200' 
                              : 'bg-[#0d1217] border-slate-800 text-slate-500 opacity-60'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white transition duration-500 ${
                          isCurrent 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg shadow-orange-500/40 animate-pulse' 
                            : isDone 
                              ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400'
                        }`}>
                          <IconComp className="w-6 h-6" />
                        </div>

                        <div>
                          <div className={`text-xs font-black tracking-tight ${isCurrent ? 'text-orange-400' : isDone ? 'text-white' : 'text-slate-400'}`}>
                            {st.label}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{st.desc}</div>
                        </div>

                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-orange-500 text-white font-black text-[9px] rounded-full uppercase tracking-wider animate-bounce">
                            Active Step
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Banner Message */}
              <div className="p-4 rounded-2xl bg-[#0d1217] border border-slate-800 flex items-center space-x-3 text-xs text-slate-300">
                <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  {liveStatus === 'RECEIVED' && <span>Kitchen team received your order. Food preparation starting soon!</span>}
                  {liveStatus === 'PREPARING' && <span>Chefs are actively grilling & cooking your menu items with fresh ingredients.</span>}
                  {liveStatus === 'READY' && <span>Your order is plated hot & ready for table delivery!</span>}
                  {liveStatus === 'SERVED' && <span>Order served successfully! Thank you for dining with Maison Ceylon.</span>}
                </div>
              </div>
            </div>

            {/* Order Items Breakdown Card */}
            <div className="bg-[#141a22] border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
              <h4 className="text-sm font-extrabold text-white tracking-tight flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-orange-400" />
                <span>Order Items Summary ({order.items?.length || 0})</span>
              </h4>

              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-[#0d1217] border border-slate-800/80 rounded-2xl flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-xl bg-orange-500/10 text-orange-400 font-extrabold flex items-center justify-center text-xs">
                        {item.quantity}x
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{item.menuItem?.name || item.name || 'Gourmet Dish'}</div>
                        {item.notes && <div className="text-[10px] text-slate-400 italic">"{item.notes}"</div>}
                      </div>
                    </div>
                    <div className="font-extrabold text-slate-200">
                      ${parseFloat(item.subtotal || (item.unitPrice * item.quantity) || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-[#141a22] border border-slate-800 rounded-3xl p-8 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-300">No Active Order Selected</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Please enter your Order ID above or place a new self-service order from the menu.</p>
            <button
              onClick={() => navigate('/order')}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              Go to Food Menu
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
