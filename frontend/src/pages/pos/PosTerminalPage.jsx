import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { tablesApi } from '../../api/tablesApi';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Search, Plus, Minus, Trash2, Send, 
  CreditCard, CheckCircle2, Utensils, X, Receipt, DollarSign 
} from 'lucide-react';

export const PosTerminalPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Order Header states
  const [searchParams] = useSearchParams();
  const initialTableId = searchParams.get('tableId') || '';
  const [selectedTableId, setSelectedTableId] = useState(initialTableId);
  const [orderType, setOrderType] = useState('DINE_IN');

  // Cart state
  const [cart, setCart] = useState([]);
  const [isSendingToKitchen, setIsSendingToKitchen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Modal states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, itemsRes, tablesRes] = await Promise.all([
          ordersApi.getCategories(1),
          ordersApi.getMenuItems(1),
          tablesApi.getTables(1)
        ]);
        setCategories(catsRes);
        setMenuItems(itemsRes);
        setTables(tablesRes);
      } catch (err) {
        console.error("Failed to load POS data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (item) => {
    const existingIndex = cart.findIndex(c => c.menuItemId === item.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, {
        menuItemId: item.id,
        name: item.name,
        unitPrice: item.price,
        quantity: 1,
        notes: ''
      }]);
    }
  };

  const updateQuantity = (index, delta) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const updateNotes = (index, notesText) => {
    const updated = [...cart];
    updated[index].notes = notesText;
    setCart(updated);
  };

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.10;
  const grandTotal = subtotal + tax;

  const handleSendToKitchen = async () => {
    if (cart.length === 0) return;
    try {
      setIsSendingToKitchen(true);

      // 1. Create Order
      const newOrder = await ordersApi.createOrder({
        branchId: 1,
        tableId: selectedTableId ? parseInt(selectedTableId) : null,
        waiterId: user?.id || 1,
        orderType: orderType
      });

      // 2. Add Cart Items
      const itemRequests = cart.map(c => ({
        menuItemId: c.menuItemId,
        quantity: c.quantity,
        notes: c.notes
      }));
      await ordersApi.addItemsToOrder(newOrder.id, itemRequests);

      // 3. Send to Kitchen (Pushes WebSocket notification)
      const sentOrder = await ordersApi.sendToKitchen(newOrder.id);
      setActiveOrder(sentOrder);
      alert(`Order #${newOrder.id} successfully sent to Kitchen Display System!`);
    } catch (err) {
      console.error("Failed to send order to kitchen", err);
      alert("Error sending order to kitchen. Please check server status.");
    } finally {
      setIsSendingToKitchen(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!activeOrder && cart.length === 0) return;
    try {
      setIsProcessingPayment(true);

      let orderToPay = activeOrder;
      if (!orderToPay) {
        // Create & Add items on the fly before payment
        const newOrder = await ordersApi.createOrder({
          branchId: 1,
          tableId: selectedTableId ? parseInt(selectedTableId) : null,
          waiterId: user?.id || 1,
          orderType: orderType
        });
        const itemRequests = cart.map(c => ({
          menuItemId: c.menuItemId,
          quantity: c.quantity,
          notes: c.notes
        }));
        await ordersApi.addItemsToOrder(newOrder.id, itemRequests);
        orderToPay = newOrder;
      }

      // Process Payment
      await ordersApi.processPayment(orderToPay.id, {
        method: paymentMethod,
        amount: grandTotal,
        transactionRef: `TXN-${Date.now().toString().slice(-6)}`,
        processedById: user?.id || 1
      });

      // Fetch Printable Invoice
      const inv = await ordersApi.getInvoice(orderToPay.id);
      setCompletedInvoice(inv);
      setShowCheckoutModal(false);
      setCart([]);
      setActiveOrder(null);
    } catch (err) {
      console.error("Failed to process payment", err);
      alert("Payment processing error. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const itemCatId = item.category?.id;
    const matchesCat = selectedCategory === null || (itemCatId && String(itemCatId) === String(selectedCategory));
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Top POS Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 p-3 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-white">POS Order Terminal</h1>
          </div>
        </div>

        {/* Header Order Controls */}
        <div className="flex items-center space-x-3">
          {/* Order Type Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {['DINE_IN', 'TAKEAWAY', 'DELIVERY'].map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  orderType === t ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Table Selector for DINE_IN */}
          {orderType === 'DINE_IN' && (
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500"
            >
              <option value="">Select Table...</option>
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  Table {t.tableNumber} ({t.zone} - {t.status})
                </option>
              ))}
            </select>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-44 md:w-56"
            />
          </div>
        </div>
      </header>

      {/* Main Terminal View - 2 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Category Tabs + Menu Item Grid (65%) */}
        <div className="w-7/12 lg:w-2/3 flex flex-col border-r border-slate-800/80 p-4 overflow-hidden">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-4 shrink-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                selectedCategory === null
                  ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-800'
              }`}
            >
              All Items ({menuItems.length})
            </button>
            {categories.map(c => {
              const count = menuItems.filter(i => String(i.category?.id) === String(c.id)).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                    selectedCategory === c.id
                      ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  {c.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Menu Items Grid */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
              <Utensils className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm font-medium">No dishes found</p>
              <p className="text-xs">Try selecting another category tab or clearing search</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 pr-2">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 p-3.5 rounded-2xl cursor-pointer transition transform hover:-translate-y-1 shadow-lg flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Item Image Banner */}
                    <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden mb-3 relative group-hover:shadow-md transition">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
                        }}
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-sky-400 border border-slate-800/80 shadow">
                        {item.category?.name || 'General'}
                      </span>
                      <span className="absolute bottom-2 right-2 text-xs font-black px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-emerald-400 border border-slate-800/80 shadow">
                        ${item.price?.toFixed(2)}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm mb-1 group-hover:text-sky-400 transition">{item.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-sky-400 font-semibold">
                    <span>Add to Order</span>
                    <div className="w-6.5 h-6.5 rounded-lg bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition shadow">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Order Cart Drawer (35%) */}
        <div className="w-5/12 lg:w-1/3 bg-slate-900/90 flex flex-col justify-between p-4 overflow-hidden">
          {/* Cart Header */}
          <div className="pb-3 border-b border-slate-800 flex justify-between items-center shrink-0">
            <div>
              <h2 className="font-bold text-white text-base">Current Order Cart</h2>
              <p className="text-xs text-slate-400">
                {orderType} • {selectedTableId ? `Table #${selectedTableId}` : 'No Table'}
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Items Scroll List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                <Utensils className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm font-medium">Cart is empty</p>
                <p className="text-xs">Click dishes from the menu grid to add items</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <span className="text-xs text-slate-400">${item.unitPrice?.toFixed(2)} each</span>
                    </div>
                    <span className="font-bold text-emerald-400 text-sm">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Item Notes Input */}
                  <input
                    type="text"
                    placeholder="Add item note (e.g. Extra spicy)..."
                    value={item.notes}
                    onChange={(e) => updateNotes(idx, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-1">
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

          {/* Cart Pricing & Actions Footer */}
          <div className="pt-3 border-t border-slate-800 space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span className="text-slate-200 font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800/80">
                <span>Grand Total</span>
                <span className="text-emerald-400 text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={cart.length === 0 || isSendingToKitchen}
                onClick={handleSendToKitchen}
                className="py-3 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingToKitchen ? 'Sending...' : 'Send to Kitchen'}</span>
              </button>

              <button
                disabled={cart.length === 0}
                onClick={() => setShowCheckoutModal(true)}
                className="py-3 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay & Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Process Payment & Checkout</h2>
            <p className="text-xs text-slate-400 mb-6">Total Amount Payable: <strong className="text-emerald-400 text-sm">${grandTotal.toFixed(2)}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CARD', 'CASH', 'WALLET'].map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                        paymentMethod === m 
                          ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={isProcessingPayment}
                onClick={handleProcessPayment}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition cursor-pointer mt-2"
              >
                {isProcessingPayment ? 'Processing...' : `Confirm $${grandTotal.toFixed(2)} Payment`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Invoice Modal */}
      {completedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Payment Successful!</h2>
            <p className="text-xs text-slate-400 mb-4">Invoice #{completedInvoice.invoiceNumber}</p>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-left space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Invoice Date:</span>
                <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Order Total:</span>
                <span className="text-white font-medium">${completedInvoice.total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax Total:</span>
                <span className="text-white font-medium">${completedInvoice.taxTotal?.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedInvoice(null)}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
