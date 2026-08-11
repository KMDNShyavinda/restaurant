import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { tablesApi } from '../../api/tablesApi';
import { useAuth } from '../../context/AuthContext';
import { useActionGuard } from '../../hooks/useActionGuard';
import { 
  ArrowLeft, Search, X, CreditCard, CheckCircle2, 
  Bell, Star, SlidersHorizontal, Info, Plus 
} from 'lucide-react';
import { PosCategoryTabs } from '../../components/pos/PosCategoryTabs';
import { PosMenuGrid } from '../../components/pos/PosMenuGrid';
import { PosCartPanel } from '../../components/pos/PosCartPanel';
import { toast } from 'sonner';

export const PosTerminalPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Item Inspector Detail Modal State (Matching Behance Right Screen)
  const [selectedDishDetail, setSelectedDishDetail] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [itemNote, setItemNote] = useState('');

  // Order Header states
  const [searchParams] = useSearchParams();
  const initialTableId = searchParams.get('tableId') || '';
  const [selectedTableId, setSelectedTableId] = useState(initialTableId);
  const [orderType, setOrderType] = useState('DINE_IN');

  // Cart state
  const [cart, setCart] = useState([]);
  const [isSendingToKitchen, setIsSendingToKitchen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Checkout Modal states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState(null);

  const { user } = useAuth();
  const { isPending } = useActionGuard();
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

  const addToCart = (item, options = {}) => {
    const sizeMultiplier = options.size === 'S' ? 0.9 : options.size === 'L' ? 1.2 : 1.0;
    const finalUnitPrice = item.price * sizeMultiplier;
    const itemNameWithSize = options.size ? `${item.name} (${options.size})` : item.name;

    const existingIndex = cart.findIndex(c => c.menuItemId === item.id && c.name === itemNameWithSize);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, {
        menuItemId: item.id,
        name: itemNameWithSize,
        unitPrice: finalUnitPrice,
        quantity: 1,
        notes: options.notes || ''
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
    if (isPending) {
      toast.error("Not yet approved user role. Please wait for an Admin to approve your account.");
      return;
    }
    if (cart.length === 0) return;
    try {
      setIsSendingToKitchen(true);

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

      const sentOrder = await ordersApi.sendToKitchen(newOrder.id);
      setActiveOrder(sentOrder);
      toast.success(`Order #${newOrder.id} successfully sent to Kitchen Display System!`);
    } catch (err) {
      console.error("Failed to send order to kitchen", err);
      toast.error("Error sending order to kitchen. Please check server status.");
    } finally {
      setIsSendingToKitchen(false);
    }
  };

  const handleProcessPayment = async () => {
    if (isPending) {
      toast.error("Not yet approved user role. Please wait for an Admin to approve your account.");
      return;
    }
    if (!activeOrder && cart.length === 0) return;
    try {
      setIsProcessingPayment(true);

      let orderToPay = activeOrder;
      if (!orderToPay) {
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

      await ordersApi.processPayment(orderToPay.id, {
        method: paymentMethod,
        amount: grandTotal,
        transactionRef: `TXN-${Date.now().toString().slice(-6)}`,
        processedById: user?.id || 1
      });

      const inv = await ordersApi.getInvoice(orderToPay.id);
      setCompletedInvoice(inv);
      setShowCheckoutModal(false);
      setCart([]);
      setActiveOrder(null);
      toast.success("Payment processed successfully!");
    } catch (err) {
      console.error("Failed to process payment", err);
      toast.error("Payment processing error. Please try again.");
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

  const recommendedItems = menuItems.slice(0, 3);
  const activeCategoryName = categories.find(c => String(c.id) === String(selectedCategory))?.name || 'Pizza & Gourmet';

  return (
    <div className="h-screen bg-[#07090c] text-slate-100 flex flex-col overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header Bar */}
      <header className="bg-[#11161d] border-b border-amber-500/30 px-6 py-3 flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/welcome')}
            className="p-2.5 bg-[#07090c] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
            title="Return to Role Launchpad"
          >
            <ArrowLeft className="w-5 h-5 text-amber-400" />
          </button>

          {/* Cashier Staff Avatar Photo & Badge */}
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" 
                alt="Active Cashier Staff" 
                className="w-10 h-10 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#11161d] rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-extrabold text-white tracking-wide">{user?.name || 'Kasun Perera'}</h1>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  💳 Cashier Terminal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Maison Ceylon POS • Session #CSH-2026</p>
            </div>
          </div>
        </div>

        {/* Header Order Controls */}
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <button className="w-10 h-10 rounded-2xl bg-[#07090c] hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center relative cursor-pointer transition">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-500"></span>
          </button>

          {/* Order Type Toggle */}
          <div className="flex bg-[#07090c] p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            {['DINE_IN', 'TAKEAWAY', 'DELIVERY'].map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                  orderType === t 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-md shadow-amber-500/25 border border-amber-400/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Table Selector */}
          {orderType === 'DINE_IN' && (
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="bg-[#07090c] border border-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl focus:outline-none focus:border-amber-500 shadow-inner"
            >
              <option value="">Select Table...</option>
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  Table {t.tableNumber} ({t.zone} - {t.status})
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {/* Main Container - 2 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Hero Header, Category Pills & Grid (65%) */}
        <div className="w-7/12 lg:w-2/3 flex flex-col border-r border-slate-800/80 p-5 overflow-hidden">
          
          {/* Cashier Visual Hero Banner (POS Checkout Image Background) */}
          <div className="mb-4 shrink-0 bg-[#11161d] border border-amber-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0a67ef6e885c?w=1200" 
                alt="Cashier Terminal Checkout"
                className="w-full h-full object-cover opacity-20 filter brightness-50 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#11161d] via-[#11161d]/90 to-transparent" />
            </div>

            <div className="relative z-10 space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                <CreditCard className="w-3 h-3" />
                <span>Express Cashier Session</span>
              </div>
              <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight leading-tight">
                Cashier Billing & Order Catalog: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">{activeCategoryName}</span>
              </h2>
              <p className="text-xs text-slate-400 max-w-md">Select menu items to build cart, customize portion sizes, apply promo codes, and process instant invoices.</p>
            </div>

            {/* Search Input Bar */}
            <div className="relative z-10 shrink-0 w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search for pizza..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#141a22] border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/80 shadow-inner transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <PosCategoryTabs 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Product Cards Grid & Recommendations */}
          <PosMenuGrid 
            items={filteredItems}
            loading={loading}
            recommendedItems={recommendedItems}
            onSelectItem={(item) => {
              setSelectedDishDetail(item);
              setSelectedSize('M');
              setItemNote('');
            }}
            onAddToCart={(item) => addToCart(item)}
          />
        </div>

        {/* Right Column: Order Cart Drawer (35%) */}
        <PosCartPanel 
          cart={cart}
          orderType={orderType}
          selectedTableId={selectedTableId}
          subtotal={subtotal}
          tax={tax}
          grandTotal={grandTotal}
          isSendingToKitchen={isSendingToKitchen}
          onClearCart={() => setCart([])}
          onUpdateQuantity={updateQuantity}
          onUpdateNotes={updateNotes}
          onRemoveFromCart={removeFromCart}
          onSendToKitchen={handleSendToKitchen}
          onCheckout={() => setShowCheckoutModal(true)}
        />
      </div>

      {/* DISH DETAIL INSPECTOR MODAL (Matching Behance Right Screen View) */}
      {selectedDishDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedDishDetail(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dish Hero Image Cover */}
            <div className="w-full h-64 bg-slate-950 relative">
              <img
                src={selectedDishDetail.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'}
                alt={selectedDishDetail.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141a22] via-transparent to-transparent"></div>
            </div>

            {/* Content Body */}
            <div className="p-6 -mt-8 relative space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-white mb-1">{selectedDishDetail.name}</h3>
                  <p className="text-xs text-slate-400">Loaded with extra mozzarella, herbs & signature sauce</p>
                </div>

                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.8 (3,605)</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedDishDetail.description || 'Great combination of fresh ingredients, rich herbs, and melted gourmet cheese baked to perfection.'}
                </p>
              </div>

              {/* Size Selector (S, M, L) */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Size</span>
                <div className="grid grid-cols-3 gap-3">
                  {['S', 'M', 'L'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 rounded-2xl text-xs font-extrabold border transition cursor-pointer ${
                        selectedSize === s
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-400 shadow-lg shadow-orange-500/25'
                          : 'bg-[#0d1217] text-slate-400 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      {s === 'S' ? 'Small' : s === 'M' ? 'Medium' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes input */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Custom Notes</span>
                <input
                  type="text"
                  placeholder="e.g. Extra crispy crust, sauce on side"
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  className="w-full bg-[#0d1217] border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Bottom Price & Add Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Total Price</span>
                  <span className="text-2xl font-black text-orange-500">
                    ${(selectedDishDetail.price * (selectedSize === 'S' ? 0.9 : selectedSize === 'L' ? 1.2 : 1.0)).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedDishDetail, { size: selectedSize, notes: itemNote });
                    setSelectedDishDetail(null);
                  }}
                  className="py-3.5 px-8 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/30 transition cursor-pointer active:scale-95 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add to Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-white mb-1">Process Payment & Checkout</h2>
            <p className="text-xs text-slate-400 mb-6">Total Amount Payable: <strong className="text-orange-500 text-base font-black">${grandTotal.toFixed(2)}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CARD', 'CASH', 'WALLET'].map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`py-3.5 rounded-2xl text-xs font-black transition cursor-pointer ${
                        paymentMethod === m 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25' 
                          : 'bg-[#0d1217] text-slate-400 border border-slate-800 hover:bg-slate-900'
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
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/30 transition cursor-pointer mt-2 active:scale-95"
              >
                {isProcessingPayment ? 'Processing...' : `Confirm $${grandTotal.toFixed(2)} Payment`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Invoice Modal */}
      {completedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-extrabold text-white mb-1">Payment Successful!</h2>
            <p className="text-xs text-slate-400 mb-4">Invoice #{completedInvoice.invoiceNumber}</p>

            <div className="bg-[#0d1217] border border-slate-800 p-4 rounded-2xl text-left space-y-2 text-xs mb-6">
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
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/25 transition cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
