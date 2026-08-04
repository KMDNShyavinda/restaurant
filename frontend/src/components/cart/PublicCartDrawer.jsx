import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export const PublicCartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10;
  const grandTotal = subtotal + tax;

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Your Order Basket</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center py-12">
              <ShoppingBag className="w-16 h-16 mb-3 opacity-20" />
              <p className="text-sm font-semibold text-slate-400">Your basket is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">Explore our menu and add your favorite dishes to start your order.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                    <span className="text-xs text-slate-400">${item.price.toFixed(2)} each</span>
                  </div>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(idx, -1)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(idx, 1)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (10%)</span>
                <span className="text-slate-200 font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-emerald-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
