import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, CheckCircle2, Utensils, Receipt, QrCode } from 'lucide-react';

export const ThermalReceiptModal = ({
  isOpen,
  onClose,
  orderData,
  paymentData,
  type = 'CUSTOMER_BILL' // 'CUSTOMER_BILL' or 'KITCHEN_KOT'
}) => {
  const printRef = useRef(null);

  if (!isOpen || !orderData) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleString();
  const items = orderData.items || orderData.cart || [];
  const subtotal = orderData.subtotal || orderData.totalAmount || 0;
  const tax = orderData.tax || subtotal * 0.1;
  const grandTotal = orderData.grandTotal || subtotal + tax;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Printable CSS style tag for 80mm thermal receipt */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-thermal-receipt, #printable-thermal-receipt * {
              visibility: visible;
            }
            #printable-thermal-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 80mm;
              padding: 4mm;
              margin: 0;
              background: #fff !important;
              color: #000 !important;
              font-family: 'Courier New', Courier, monospace;
              font-size: 11px;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#11161d] border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#141a22]">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-white text-sm uppercase tracking-wider">
                {type === 'KITCHEN_KOT' ? 'Kitchen KOT Ticket' : 'Customer Thermal Bill'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Receipt Preview Body (Styled as Thermal Slip) */}
          <div className="p-6 overflow-y-auto flex-1 bg-slate-900/50">
            <div
              id="printable-thermal-receipt"
              ref={printRef}
              className="bg-white text-black p-5 rounded-2xl shadow-xl font-mono text-xs max-w-[320px] mx-auto space-y-3"
            >
              {/* Slip Header */}
              <div className="text-center pb-2 border-b border-dashed border-gray-400">
                <h2 className="font-black text-base uppercase tracking-tighter">Maison Ceylon POS</h2>
                <p className="text-[10px] text-gray-600">Restaurant & Fine Dining</p>
                <p className="text-[10px] text-gray-500 mt-1">Tel: +94 (11) 234-5678</p>
                <p className="text-[10px] text-gray-500">{currentDate}</p>
              </div>

              {/* Order Info */}
              <div className="text-[11px] space-y-0.5 border-b border-dashed border-gray-400 pb-2">
                <div className="flex justify-between font-bold">
                  <span>Order #: {orderData.id || orderData.orderId || 'NEW'}</span>
                  <span className="uppercase text-amber-700 font-extrabold">{orderData.orderType || 'DINE_IN'}</span>
                </div>
                {orderData.tableId && (
                  <div className="flex justify-between">
                    <span>Table #: {orderData.tableId}</span>
                    <span>Staff: {orderData.serverName || 'Cashier'}</span>
                  </div>
                )}
                {type === 'KITCHEN_KOT' && (
                  <div className="mt-1 bg-black text-white text-center py-0.5 font-bold text-xs uppercase">
                    *** KITCHEN ORDER TICKET ***
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="space-y-1.5 border-b border-dashed border-gray-400 pb-2">
                <div className="flex justify-between font-bold text-[10px] uppercase border-b border-gray-200 pb-1">
                  <span className="w-12">QTY</span>
                  <span className="flex-1">ITEM</span>
                  <span className="text-right w-16">AMT</span>
                </div>

                {items.map((item, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] items-start">
                      <span className="w-12 font-bold">{item.quantity}x</span>
                      <span className="flex-1 font-medium">{item.name || item.menuItem?.name}</span>
                      <span className="text-right w-16 font-bold">
                        ${((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[9px] italic text-gray-600 pl-12 font-sans">
                        * Note: {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Bill Totals (Customer Bill Only) */}
              {type === 'CUSTOMER_BILL' && (
                <div className="space-y-1 text-[11px] border-b border-dashed border-gray-400 pb-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-1 border-t border-gray-300">
                    <span>TOTAL:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>

                  {paymentData && (
                    <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] space-y-0.5">
                      <div className="flex justify-between font-bold">
                        <span>Paid Via: {paymentData.method || 'CASH'}</span>
                        <span>${(paymentData.amount || grandTotal).toFixed(2)}</span>
                      </div>
                      {paymentData.cashGiven > 0 && (
                        <>
                          <div className="flex justify-between text-gray-600">
                            <span>Cash Tendered:</span>
                            <span>${paymentData.cashGiven.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-green-700">
                            <span>Change Return:</span>
                            <span>${(paymentData.changeAmount || 0).toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="text-center pt-2 space-y-1">
                <p className="font-bold text-[10px]">Thank you for dining with us!</p>
                <p className="text-[9px] text-gray-500">Please come again</p>
                <div className="flex justify-center pt-1">
                  <QrCode className="w-10 h-10 opacity-70" />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="p-4 border-t border-slate-800 bg-[#141a22] flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 cursor-pointer transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Thermal Slip</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
