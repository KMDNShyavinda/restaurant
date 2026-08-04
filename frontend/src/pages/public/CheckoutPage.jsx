import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { ShoppingBag, CreditCard, MapPin, Phone, User, Tag, Check, ArrowRight, Truck } from 'lucide-react';

export const CheckoutPage = ({ cart, clearCart }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderType, setOrderType] = useState('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoNotice, setPromoNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * (discountPercent / 100);
  const subtotalAfterDiscount = subtotal - discount;
  const tax = subtotalAfterDiscount * 0.10;
  const deliveryFee = orderType === 'DELIVERY' ? 3.99 : 0;
  const grandTotal = subtotalAfterDiscount + tax + deliveryFee;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoNotice('20% Discount applied successfully!');
    } else {
      setDiscountPercent(0);
      setPromoNotice('Invalid Promo Code. Try WELCOME20');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setIsSubmitting(true);

      // 1. Create Order
      const newOrder = await ordersApi.createOrder({
        branchId: 1,
        tableId: null,
        waiterId: 1,
        orderType: orderType
      });

      // 2. Add Items
      const itemRequests = cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        notes: `Customer: ${customerName} (${customerPhone}) Address: ${deliveryAddress}`
      }));
      await ordersApi.addItemsToOrder(newOrder.id, itemRequests);

      // 3. Send to Kitchen / KDS
      await ordersApi.sendToKitchen(newOrder.id);

      clearCart();
      navigate(`/track-order/${newOrder.id}`);
    } catch (err) {
      console.error("Failed to place online order", err);
      alert("Failed to process online order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2">Online Checkout</h1>
      <p className="text-xs text-slate-400 mb-8">Complete your order details below for express delivery or takeaway pickup.</p>

      {cart.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Your basket is empty</h3>
          <button
            onClick={() => navigate('/menu')}
            className="mt-4 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs transition"
          >
            Browse Food Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
            {/* Order Type Toggle */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-3">Service Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                    orderType === 'DELIVERY'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Express Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('TAKEAWAY')}
                  className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                    orderType === 'TAKEAWAY'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Takeaway Pickup</span>
                </button>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-sm">Customer Details</h3>
              
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {orderType === 'DELIVERY' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <textarea
                      required
                      rows="2"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="123 Main St, Apt 4B, New York..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-bold text-white text-sm mb-3">Payment Option</h3>
              <div className="grid grid-cols-2 gap-3">
                {['CARD', 'CASH'].map(m => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      paymentMethod === m 
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {m === 'CARD' ? 'Credit / Debit Card' : 'Cash on Delivery'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition cursor-pointer text-sm flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Placing Order...' : `Confirm & Pay $${grandTotal.toFixed(2)}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Order Summary Column */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit space-y-4">
            <h3 className="font-bold text-white text-sm pb-3 border-b border-slate-800">Order Summary ({cart.length} Items)</h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">{item.quantity}x </span>
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-200">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Promo code (WELCOME20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-white uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
              {promoNotice && <p className="text-[11px] text-emerald-400 font-semibold mt-1">{promoNotice}</p>}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount (20%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span className="text-white font-semibold">${tax.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-white font-semibold">${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-emerald-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
