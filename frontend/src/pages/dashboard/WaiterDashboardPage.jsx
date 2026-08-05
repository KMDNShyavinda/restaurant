import React, { useState, useEffect } from 'react';
import { ordersApi } from '../../api/ordersApi';
import { CheckCircle2, Clock, CheckCircle, ChefHat, BellRing } from 'lucide-react';

export const WaiterDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await ordersApi.getOrders();
      // Filter for PREPARING, READY, SERVED
      const filtered = data.filter(o => ['PREPARING', 'READY', 'SERVED'].includes(o.status));
      setOrders(filtered);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // poll every 5s
    return () => clearInterval(intervalId);
  }, []);

  const handleMarkAsServed = async (orderId) => {
    try {
      await ordersApi.updateOrderStatus(orderId, 'SERVED');
      fetchOrders(); // refresh
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const readyOrders = orders.filter(o => o.status === 'READY');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const servedOrders = orders.filter(o => o.status === 'SERVED');

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#07090c] text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-sky-400 animate-pulse">
          <BellRing className="w-8 h-8" />
          <span className="text-xl font-bold">Loading Order Station...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090c] text-white p-6 font-sans selection:bg-sky-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-[#11161d] p-6 rounded-3xl border border-sky-500/20 shadow-xl shadow-sky-500/10">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
              <BellRing className="w-8 h-8 text-sky-400" />
              Order Management
            </h1>
            <p className="text-slate-400 mt-1">Manage and serve ready orders to tables.</p>
          </div>
          <div className="text-right">
             <div className="text-3xl font-black text-white">{readyOrders.length}</div>
             <div className="text-xs text-sky-400 font-bold uppercase tracking-widest mt-1">Ready to Serve</div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PREPARING */}
          <div className="bg-[#11161d] rounded-3xl border border-slate-800 p-6 flex flex-col h-[75vh]">
            <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2 mb-4 uppercase tracking-wider">
              <ChefHat className="text-amber-500 w-5 h-5" /> In Kitchen ({preparingOrders.length})
            </h2>
            <div className="overflow-y-auto flex-1 space-y-4 pr-2 custom-scrollbar">
              {preparingOrders.map(order => (
                <div key={order.id} className="bg-[#0a0d14] p-4 rounded-2xl border border-amber-500/20 shadow-md">
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-amber-400">Order #{order.id}</span>
                     <span className="text-xs font-bold bg-amber-500/10 text-amber-400 px-2 py-1 rounded-md border border-amber-500/20">Table {order.tableNumber || 'N/A'}</span>
                   </div>
                   <div className="text-sm text-slate-400 line-clamp-2">
                     {order.items?.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ')}
                   </div>
                   <div className="mt-3 text-xs text-slate-500 flex items-center gap-1 font-bold">
                     <Clock className="w-3 h-3 text-amber-500/70" /> Preparing...
                   </div>
                </div>
              ))}
              {preparingOrders.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                  No orders in kitchen
                </div>
              )}
            </div>
          </div>

          {/* READY TO SERVE (Focus) */}
          <div className="bg-[#11161d] rounded-3xl border border-sky-500/50 p-6 flex flex-col h-[75vh] shadow-2xl shadow-sky-500/10 ring-1 ring-sky-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full"></div>
            <h2 className="text-xl font-black text-sky-400 flex items-center gap-2 mb-4 uppercase tracking-wider relative z-10">
              <BellRing className="w-6 h-6 animate-pulse" /> Ready to Serve ({readyOrders.length})
            </h2>
            <div className="overflow-y-auto flex-1 space-y-4 pr-2 custom-scrollbar relative z-10">
              {readyOrders.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 flex-col gap-2">
                  <CheckCircle className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-bold">No orders ready yet</p>
                </div>
              ) : (
                readyOrders.map(order => (
                  <div key={order.id} className="bg-gradient-to-br from-sky-900/40 to-[#0a0d14] p-5 rounded-2xl border border-sky-400/30 shadow-lg transform transition hover:-translate-y-1">
                     <div className="flex justify-between items-center mb-3">
                       <span className="text-xl font-black text-white drop-shadow-md">Order #{order.id}</span>
                       <span className="text-sm font-bold bg-sky-500/20 text-sky-300 px-3 py-1 rounded-lg border border-sky-500/30 shadow-inner">Table {order.tableNumber || 'N/A'}</span>
                     </div>
                     <div className="text-sm text-sky-100/80 mb-5 space-y-1.5 font-medium">
                       {order.items?.map((i, idx) => (
                         <div key={idx} className="flex items-start gap-2">
                           <span className="text-sky-400 font-bold">•</span>
                           <span>{i.quantity}x {i.menuItem?.name || 'Item'}</span>
                         </div>
                       ))}
                     </div>
                     <button
                       onClick={() => handleMarkAsServed(order.id)}
                       className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition duration-200 uppercase tracking-widest text-xs"
                     >
                       <CheckCircle2 className="w-5 h-5" />
                       Mark as Served
                     </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SERVED */}
          <div className="bg-[#11161d] rounded-3xl border border-slate-800 p-6 flex flex-col h-[75vh]">
            <h2 className="text-lg font-bold text-slate-400 flex items-center gap-2 mb-4 uppercase tracking-wider">
              <CheckCircle className="w-5 h-5" /> Recently Served ({servedOrders.length})
            </h2>
            <div className="overflow-y-auto flex-1 space-y-4 pr-2 custom-scrollbar opacity-70 hover:opacity-100 transition duration-300">
              {servedOrders.map(order => (
                <div key={order.id} className="bg-[#0a0d14] p-4 rounded-2xl border border-emerald-500/20">
                   <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-slate-300">Order #{order.id}</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded">
                       <CheckCircle2 className="w-3 h-3" /> Served
                     </span>
                   </div>
                   <div className="text-xs text-slate-500 font-medium">
                     Table {order.tableNumber || 'N/A'}
                   </div>
                </div>
              ))}
              {servedOrders.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                  No recently served orders
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
