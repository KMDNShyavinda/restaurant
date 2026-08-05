import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../api/ordersApi';
import { feedbackApi } from '../../api/feedbackApi';
import { 
  User, Mail, Phone, MapPin, Clock, ChevronRight, Activity, ShoppingBag, LogOut, ArrowLeft, Utensils, Star, MessageSquare, ThumbsUp, X
} from 'lucide-react';

export const CustomerProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOrderToRate, setSelectedOrderToRate] = useState(null);
  const [dishRatings, setDishRatings] = useState({}); // { [menuItemId]: { rating: 5, comment: '' } }
  const [restaurantReview, setRestaurantReview] = useState({ rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  const handleRestaurantReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setRatingLoading(true);
      await feedbackApi.submitRestaurantFeedback(restaurantReview);
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
      setRestaurantReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleDishRatingSubmit = async () => {
    try {
      setRatingLoading(true);
      const promises = Object.entries(dishRatings).map(([menuItemId, ratingData]) => {
        if (ratingData.rating > 0) {
          return feedbackApi.submitDishRating({ menuItemId, rating: ratingData.rating, comment: ratingData.comment });
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      setSelectedOrderToRate(null);
      setDishRatings({});
    } catch (err) {
      console.error("Failed to submit dish ratings", err);
    } finally {
      setRatingLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load customer orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeOrders = orders.filter(o => ['PENDING', 'RECEIVED', 'PREPARING', 'READY'].includes(o.status));
  const orderHistory = orders.filter(o => !['PENDING', 'RECEIVED', 'PREPARING', 'READY'].includes(o.status));

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 font-sans pb-24 selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0d1217]/95 border-b border-slate-800/80 backdrop-blur-xl px-4 py-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/order')}
              className="p-2 bg-[#141a22] hover:bg-slate-800 rounded-xl transition cursor-pointer text-slate-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-extrabold text-white">My Profile</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 mt-4">
        {/* Personal Details Card */}
        <div className="bg-[#11161d] border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 p-1 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d1217] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-amber-500" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-3xl font-black text-white">{user?.name}</h2>
                <p className="text-amber-400 text-sm font-bold uppercase tracking-wider mt-1">Maison Ceylon Member</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-300 bg-[#07090c] px-4 py-2 rounded-xl border border-slate-800">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-300 bg-[#07090c] px-4 py-2 rounded-xl border border-slate-800">
                    <Phone className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Active Orders</span>
            </h3>
            
            <div className="grid gap-4">
              {activeOrders.map(order => (
                <div key={order.id} className="bg-gradient-to-r from-amber-500/10 to-[#11161d] border border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-extrabold text-white text-lg">Order #{order.id}</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      {order.table && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-amber-400">Table {order.table.tableNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/track/${order.id}`)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Track Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurant Review */}
        {orderHistory.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 to-[#11161d] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>Leave a Restaurant Review</span>
            </h3>
            <p className="text-sm text-slate-400">Share your overall experience at Maison Ceylon. We value your feedback!</p>
            {reviewSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center space-x-3">
                <ThumbsUp className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-sm">Thank you for your feedback!</span>
              </div>
            ) : (
              <form onSubmit={handleRestaurantReviewSubmit} className="space-y-4 max-w-lg">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star}
                        onClick={() => setRestaurantReview(prev => ({ ...prev, rating: star }))}
                        className={`w-6 h-6 cursor-pointer transition ${star <= restaurantReview.rating ? 'text-amber-400 fill-current' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <textarea
                    required
                    placeholder="Tell us about your experience..."
                    value={restaurantReview.comment}
                    onChange={(e) => setRestaurantReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#07090c] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 min-h-[100px]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={ratingLoading}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer"
                >
                  {ratingLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Order History */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white flex items-center space-x-2 pt-4">
            <ShoppingBag className="w-5 h-5 text-slate-400" />
            <span>Order History</span>
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : orderHistory.length === 0 ? (
            <div className="bg-[#11161d] border border-slate-800 rounded-3xl p-8 text-center">
              <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-300">No past orders yet</h4>
              <p className="text-sm text-slate-500 mt-1">Your dining history will appear here.</p>
              <button 
                onClick={() => navigate('/order')}
                className="mt-4 px-6 py-2 bg-[#0d1217] hover:bg-slate-800 border border-slate-700 text-amber-400 font-bold rounded-xl text-sm transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="bg-[#11161d] border border-slate-800 rounded-3xl overflow-hidden">
              <div className="divide-y divide-slate-800/80">
                {orderHistory.map(order => (
                  <div key={order.id} className="p-5 hover:bg-slate-900/50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-bold text-white">Order #{order.id}</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {' '}• {order.orderType.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        {order.items?.map(i => `${i.quantity}x ${i.menuItem?.name}`).join(', ')}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="font-black text-amber-400">${parseFloat(order.totalAmount || 0).toFixed(2)}</div>
                      <button
                        onClick={() => {
                          setSelectedOrderToRate(order);
                          const initialRatings = {};
                          order.items?.forEach(i => {
                            if (i.menuItem) {
                              initialRatings[i.menuItem.id] = { rating: 0, comment: '' };
                            }
                          });
                          setDishRatings(initialRatings);
                        }}
                        className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold rounded-lg text-xs transition cursor-pointer"
                      >
                        Rate Dishes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Rate Dishes Modal */}
      {selectedOrderToRate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#11161d] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-extrabold text-white">Rate Your Dishes</h3>
              <button 
                onClick={() => setSelectedOrderToRate(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {selectedOrderToRate.items?.filter(i => i.menuItem).map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-bold text-slate-200 text-sm">{item.menuItem.name}</h4>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star}
                        onClick={() => {
                          setDishRatings(prev => ({
                            ...prev,
                            [item.menuItem.id]: { ...prev[item.menuItem.id], rating: star }
                          }));
                        }}
                        className={`w-5 h-5 cursor-pointer transition ${star <= (dishRatings[item.menuItem.id]?.rating || 0) ? 'text-amber-400 fill-current' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <input 
                    type="text"
                    placeholder="Optional comment about this dish..."
                    value={dishRatings[item.menuItem.id]?.comment || ''}
                    onChange={(e) => {
                      setDishRatings(prev => ({
                        ...prev,
                        [item.menuItem.id]: { ...prev[item.menuItem.id], comment: e.target.value }
                      }));
                    }}
                    className="w-full px-3 py-2 bg-[#07090c] border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-800 shrink-0">
              <button
                onClick={handleDishRatingSubmit}
                disabled={ratingLoading || Object.values(dishRatings).every(r => r.rating === 0)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer disabled:opacity-50"
              >
                {ratingLoading ? 'Submitting...' : 'Submit Ratings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
