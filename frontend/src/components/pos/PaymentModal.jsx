import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, QrCode, Globe, CheckCircle2, X, AlertCircle, ArrowRight, Printer } from 'lucide-react';

export const PaymentModal = ({
  isOpen,
  onClose,
  grandTotal = 0,
  onConfirmPayment,
  isProcessing = false
}) => {
  const [method, setMethod] = useState('CASH'); // 'CASH', 'CARD', 'ONLINE', 'LANKAQR'
  const [cashGiven, setCashGiven] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSimulatingGateway, setIsSimulatingGateway] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  if (!isOpen) return null;

  const finalTotal = Math.max(0, grandTotal - discountAmount);
  const numericCash = parseFloat(cashGiven) || 0;
  const changeAmount = Math.max(0, numericCash - finalTotal);
  const isCashInsufficient = method === 'CASH' && numericCash > 0 && numericCash < finalTotal;

  const handlePresetCash = (amount) => {
    setCashGiven(amount.toString());
  };

  const handleSimulatePayHereGateway = () => {
    setIsSimulatingGateway(true);
    setTimeout(() => {
      const generatedRef = 'PYH-' + Math.floor(100000 + Math.random() * 900000);
      setTransactionRef(generatedRef);
      setIsSimulatingGateway(false);
    }, 1200);
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
      setIsApplyingPromo(true);
      setPromoError('');
      setPromoSuccess('');
      
      const { ordersApi } = await import('../../api/ordersApi');
      const promo = await ordersApi.getPromotionByCode(promoCode);
      
      // Calculate discount locally for preview
      let discount = 0;
      if (promo.type === 'FLAT') {
        discount = Math.min(promo.value, grandTotal);
      } else if (promo.type === 'PERCENTAGE') {
        discount = (grandTotal * promo.value) / 100;
        discount = Math.min(discount, grandTotal);
      } else if (promo.type === 'BOGO') {
         // rough estimation for bogo on UI
         discount = 0; 
      }
      setDiscountAmount(discount);
      setPromoSuccess(`Promo applied: -$${discount.toFixed(2)}`);
    } catch (err) {
      setPromoError('Invalid or expired promo code.');
      setDiscountAmount(0);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (method === 'CASH' && numericCash < finalTotal) return;

    onConfirmPayment({
      method,
      amount: finalTotal,
      discountAmount,
      promoCode,
      cashGiven: method === 'CASH' ? numericCash : 0,
      changeAmount: method === 'CASH' ? changeAmount : 0,
      transactionRef: transactionRef || (method !== 'CASH' ? 'TXN-' + Date.now() : 'CASH-POS')
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#11161d] border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#141a22]">
            <div>
              <h3 className="font-extrabold text-white text-base">Complete Cashier Checkout</h3>
              <p className="text-xs text-slate-400">Select payment method and confirm transaction</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Amount Due Card */}
            <div className="bg-[#141a22] border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center w-full mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subtotal + Tax</span>
                <span className="text-sm font-semibold text-slate-300">${grandTotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center w-full mb-2 text-emerald-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Discount ({promoCode})</span>
                  <span className="text-sm font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center w-full pt-2 border-t border-slate-800">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Due</span>
                <h2 className="text-3xl font-black text-amber-400">${finalTotal.toFixed(2)}</h2>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Apply Promo Code</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter code..."
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); setPromoSuccess(''); }}
                  className="flex-1 bg-[#0d1217] border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo || !promoCode}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isApplyingPromo ? '...' : 'Apply'}
                </button>
              </div>
              {promoError && <p className="text-[10px] text-rose-400 font-bold">{promoError}</p>}
              {promoSuccess && <p className="text-[10px] text-emerald-400 font-bold">{promoSuccess}</p>}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'CASH', label: 'Cash', icon: DollarSign },
                  { id: 'CARD', label: 'Card Swipe', icon: CreditCard },
                  { id: 'ONLINE', label: 'PayHere / Web', icon: Globe },
                  { id: 'LANKAQR', label: 'LANKAQR', icon: QrCode }
                ].map((m) => {
                  const Icon = m.icon;
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                        active
                          ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-[#141a22] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[11px] font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Payment Details Section */}
            {method === 'CASH' && (
              <div className="space-y-3 bg-[#141a22] p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-slate-300">Cash Received ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter cash received..."
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="w-full bg-[#0d1217] border border-slate-700 px-4 py-3 rounded-xl text-lg font-black text-white focus:outline-none focus:border-amber-500"
                  required
                />

                {/* Quick Presets */}
                <div className="flex space-x-2 pt-1">
                  {[Math.ceil(grandTotal), 20, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetCash(preset)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition cursor-pointer"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                {/* Balance Change Output */}
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Change to Return:</span>
                  <span className={`text-xl font-black ${isCashInsufficient ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ${changeAmount.toFixed(2)}
                  </span>
                </div>
                {isCashInsufficient && (
                  <p className="text-xs text-rose-400 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                    Cash given is less than total amount due!
                  </p>
                )}
              </div>
            )}

            {(method === 'CARD' || method === 'ONLINE' || method === 'LANKAQR') && (
              <div className="space-y-3 bg-[#141a22] p-4 rounded-2xl border border-slate-800 text-center">
                {method === 'LANKAQR' && (
                  <div className="flex flex-col items-center py-2 space-y-2">
                    <QrCode className="w-24 h-24 text-white bg-white p-2 rounded-xl" />
                    <p className="text-xs text-slate-400">Scan QR Code using Banking / PayHere App</p>
                  </div>
                )}

                {method === 'ONLINE' && (
                  <div className="py-2 space-y-2">
                    <button
                      type="button"
                      onClick={handleSimulatePayHereGateway}
                      disabled={isSimulatingGateway}
                      className="px-4 py-2 bg-[#0d1217] border border-amber-500/40 text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-500/10 transition cursor-pointer"
                    >
                      {isSimulatingGateway ? 'Connecting to PayHere Gateway...' : 'Simulate PayHere Checkout Gateway'}
                    </button>
                  </div>
                )}

                <div className="text-left space-y-1">
                  <label className="text-xs font-bold text-slate-400">Transaction Ref / Auth Code</label>
                  <input
                    type="text"
                    placeholder="Auto-generated or Enter Ref ID..."
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full bg-[#0d1217] border border-slate-700 px-3 py-2 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || isCashInsufficient}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 cursor-pointer transition"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Confirm & Print Bill</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
