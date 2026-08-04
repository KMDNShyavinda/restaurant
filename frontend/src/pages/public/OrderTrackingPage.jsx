import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { Client } from '@stomp/stompjs';
import { 
  Clock, CheckCircle2, Flame, Truck, Utensils, 
  ShoppingBag, ArrowLeft, RefreshCw, ShieldCheck 
} from 'lucide-react';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await ordersApi.getInvoice(id);
      setOrder(data.order);
    } catch (err) {
      console.error("Failed to load order details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();

    // STOMP Client Setup for Order Live Updates
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws/kitchen/websocket',
      reconnectDelay: 5000,
      onConnect: () => {
        if (id) {
          client.subscribe(`/topic/orders/${id}`, (message) => {
            if (message.body) {
              try {
                const updatedOrder = JSON.parse(message.body);
                setOrder(updatedOrder);
              } catch (e) {
                fetchOrderDetails();
              }
            }
          });
        }
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [id]);

  const getStepStatus = (statusStr) => {
    const status = (statusStr || 'OPEN').toUpperCase();
    if (status === 'OPEN') return 1;
    if (status === 'SENT' || status === 'PREPARING') return 2;
    if (status === 'READY') return 3;
    if (status === 'PAID' || status === 'COMPLETED') return 4;
    return 1;
  };

  const currentStep = order ? getStepStatus(order.status) : 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <Link to="/" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Live Order Tracker</h1>
          <p className="text-xs text-slate-400">Order ID: #{id || '1'} • Real-Time Status Updates</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Header Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center relative overflow-hidden shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-3">
              {currentStep === 1 && <ShoppingBag className="w-8 h-8" />}
              {currentStep === 2 && <Flame className="w-8 h-8 text-amber-400 animate-pulse" />}
              {currentStep === 3 && <Truck className="w-8 h-8 text-emerald-400" />}
              {currentStep === 4 && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
            </div>

            <span className="px-3 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-extrabold uppercase tracking-widest rounded-full inline-block mb-2">
              Status: {order?.status || 'SENT'}
            </span>

            <h2 className="text-2xl font-black text-white mb-1">
              {currentStep === 1 && "Order Placed & Confirmed!"}
              {currentStep === 2 && "Cooking in Kitchen..."}
              {currentStep === 3 && "Order Ready for Delivery / Pickup!"}
              {currentStep === 4 && "Order Completed!"}
            </h2>

            <p className="text-xs text-slate-400">
              Estimated Delivery Time: <strong className="text-white font-mono">20 - 30 Minutes</strong>
            </p>
          </div>

          {/* Timeline Step Progress Bar */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-white text-sm">Preparation Progress</h3>

            <div className="relative border-l-2 border-slate-800 pl-6 space-y-8">
              {/* Step 1 */}
              <div className="relative">
                <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 1 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  1
                </div>
                <h4 className={`font-bold text-sm ${currentStep >= 1 ? 'text-white' : 'text-slate-500'}`}>Order Received</h4>
                <p className="text-xs text-slate-400">Order successfully transmitted to restaurant server</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  2
                </div>
                <h4 className={`font-bold text-sm ${currentStep >= 2 ? 'text-white' : 'text-slate-500'}`}>In Kitchen Preparing</h4>
                <p className="text-xs text-slate-400">Chefs are preparing your artisanal dish</p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  3
                </div>
                <h4 className={`font-bold text-sm ${currentStep >= 3 ? 'text-white' : 'text-slate-500'}`}>Out for Express Delivery</h4>
                <p className="text-xs text-slate-400">Driver is en route to your delivery address</p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  4
                </div>
                <h4 className={`font-bold text-sm ${currentStep >= 4 ? 'text-white' : 'text-slate-500'}`}>Order Delivered</h4>
                <p className="text-xs text-slate-400">Enjoy your meal!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
