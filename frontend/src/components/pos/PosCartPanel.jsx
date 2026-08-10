import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Utensils, Minus, Plus, Trash2, Send, CreditCard } from 'lucide-react';

export const PosCartPanel = ({
  cart,
  orderType,
  selectedTableId,
  subtotal,
  tax,
  grandTotal,
  isSendingToKitchen,
  onClearCart,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveFromCart,
  onSendToKitchen,
  onCheckout
}) => {
  return (
    <div className="w-5/12 lg:w-1/3 bg-[#11161d] flex flex-col justify-between p-5 overflow-hidden border-l border-slate-800/80 shadow-2xl relative z-10">
      <div className="pb-3 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="font-extrabold text-white text-base">Current Order Cart</h2>
            <p className="text-xs text-slate-400">
              {orderType.replace('_', ' ')} • {selectedTableId ? `Table #${selectedTableId}` : 'No Table'}
            </p>
          </div>
        </div>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer transition"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-2 no-scrollbar">
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-3 shadow-inner">
              <Utensils className="w-8 h-8 opacity-30 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-slate-300">Your cart is empty</p>
            <p className="text-xs text-slate-500 max-w-xs mt-1">Select dishes from the menu to start taking order</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {cart.map((item, idx) => (
              <motion.div
                key={`${item.menuItemId}-${item.name}-${idx}`}
                initial={{ opacity: 0, x: 50, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -50, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-[#141a22] border border-slate-800/80 p-3.5 rounded-2xl space-y-2.5 shadow-lg overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{item.name}</h4>
                    <span className="text-xs text-slate-400">${item.unitPrice?.toFixed(2)} each</span>
                  </div>
                  <span className="font-black text-amber-400 text-sm">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Special instructions (e.g. Extra cheese)..."
                  value={item.notes || ''}
                  onChange={(e) => onUpdateNotes(idx, e.target.value)}
                  className="w-full bg-[#0d1217] border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2 bg-[#0d1217] border border-slate-800 rounded-xl p-1 shadow-inner">
                    <button
                      onClick={() => onUpdateQuantity(idx, -1)}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-white px-2 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(idx, 1)}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveFromCart(idx)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 p-1.5 rounded-lg cursor-pointer transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800/80 space-y-4 shrink-0 bg-[#11161d]">
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-slate-200 font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span className="text-slate-200 font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800/80">
            <span>Grand Total</span>
            <span className="text-amber-500 text-lg drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            disabled={cart.length === 0 || isSendingToKitchen}
            onClick={onSendToKitchen}
            className="py-3.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSendingToKitchen ? 'Sending...' : 'To Kitchen'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            disabled={cart.length === 0}
            onClick={onCheckout}
            className="py-3.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition cursor-pointer disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay & Invoice</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
