import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { tablesApi } from '../../api/tablesApi';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Search, Plus, Minus, Trash2, Send, 
  CreditCard, CheckCircle2, Utensils, X, Receipt, DollarSign,
  Bell, Star, Flame, SlidersHorizontal, Info, ShoppingBag
} from 'lucide-react';

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

  const recommendedItems = menuItems.slice(0, 3);
  const activeCategoryName = categories.find(c => String(c.id) === String(selectedCategory))?.name || 'Pizza & Gourmet';

  return (
    <div className="h-screen bg-[#0d1217] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="bg-[#131922] border-b border-slate-800/80 px-6 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-wide">Maison Ceylon POS</h1>
              <p className="text-xs text-slate-400">Fine Dining POS • Table & Order Taking</p>
            </div>
          </div>
        </div>

        {/* Header Order Controls */}
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <button className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center relative cursor-pointer transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-500"></span>
          </button>

          {/* Order Type Toggle */}
          <div className="flex bg-[#0a0e12] p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            {['DINE_IN', 'TAKEAWAY', 'DELIVERY'].map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                  orderType === t 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold shadow-md shadow-orange-500/25' 
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
              className="bg-[#0a0e12] border border-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl focus:outline-none focus:border-orange-500 shadow-inner"
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
          {/* Hero Section Banner (Matching Behance Header) */}
          <div className="mb-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                Find the world's best <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">{activeCategoryName}</span> for you
              </h2>
            </div>

            {/* Search Input Bar */}
            <div className="relative shrink-0 w-full md:w-64">
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

          {/* Minimalist Category Pills with Orange Active Dot */}
          <div className="flex items-center space-x-6 overflow-x-auto pb-2 mb-4 shrink-0 no-scrollbar border-b border-slate-800/60">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-sm font-bold transition cursor-pointer pb-1 ${
                  selectedCategory === null
                    ? 'text-orange-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Items
              </button>
              {selectedCategory === null && (
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-md shadow-orange-500/80 animate-pulse"></span>
              )}
            </div>

            {categories.map(c => {
              const isSelected = String(selectedCategory) === String(c.id);
              return (
                <div key={c.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setSelectedCategory(c.id)}
                    className={`text-sm font-bold transition cursor-pointer pb-1 ${
                      isSelected
                        ? 'text-orange-400 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-md shadow-orange-500/80 animate-pulse"></span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
              <Utensils className="w-12 h-12 mb-2 opacity-30 text-orange-500" />
              <p className="text-sm font-medium">No dishes found</p>
              <p className="text-xs">Try selecting another category or clearing search</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#141a22] border border-slate-800/80 hover:border-orange-500/50 p-3.5 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Image Banner */}
                      <div 
                        onClick={() => {
                          setSelectedDishDetail(item);
                          setSelectedSize('M');
                          setItemNote('');
                        }}
                        className="w-full h-40 bg-slate-950 rounded-2xl overflow-hidden mb-3 relative group-hover:shadow-2xl transition duration-500"
                      >
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
                          }}
                        />

                        {/* Top Category Badge */}
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-orange-400 border border-slate-800 shadow-md">
                          {item.category?.name || 'Gourmet'}
                        </span>

                        {/* Rating Badge */}
                        <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-800 text-xs font-extrabold shadow-md">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>4.8</span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div 
                        onClick={() => {
                          setSelectedDishDetail(item);
                          setSelectedSize('M');
                          setItemNote('');
                        }}
                      >
                        <h3 className="font-extrabold text-white text-base mb-0.5 group-hover:text-orange-400 transition line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-1">Italian classic gourmet</p>
                      </div>
                    </div>

                    {/* Bottom Price & Add Action Row */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 font-semibold uppercase block text-[10px]">Price</span>
                        <span className="text-base font-black text-orange-500">${item.price?.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-110 active:scale-95 transition cursor-pointer"
                        title="Add to order"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Section (Matching Behance "Recommended" footer) */}
              {recommendedItems.length > 0 && (
                <div className="pt-4 border-t border-slate-800/60">
                  <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>Recommended for You</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recommendedItems.map(rec => (
                      <div
                        key={rec.id}
                        onClick={() => addToCart(rec)}
                        className="bg-[#141a22] border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between hover:border-orange-500/40 cursor-pointer transition group"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={rec.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'}
                            alt={rec.name}
                            className="w-12 h-12 rounded-xl object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
                            }}
                          />
                          <div>
                            <h4 className="font-bold text-white text-xs group-hover:text-orange-400 transition">{rec.name}</h4>
                            <span className="text-[11px] font-extrabold text-orange-500">${rec.price?.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-slate-900 group-hover:bg-orange-500 text-slate-400 group-hover:text-white flex items-center justify-center transition">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Order Cart Drawer (35%) */}
        <div className="w-5/12 lg:w-1/3 bg-[#11161d] flex flex-col justify-between p-5 overflow-hidden border-l border-slate-800/80">
          {/* Cart Header */}
          <div className="pb-3 border-b border-slate-800 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <div>
                <h2 className="font-extrabold text-white text-base">Current Order Cart</h2>
                <p className="text-xs text-slate-400">
                  {orderType} • {selectedTableId ? `Table #${selectedTableId}` : 'No Table'}
                </p>
              </div>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Cart Items Scroll List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-3">
                  <Utensils className="w-8 h-8 opacity-30 text-orange-500" />
                </div>
                <p className="text-sm font-bold text-slate-300">Your cart is empty</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">Select dishes from the menu to start taking order</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="bg-[#141a22] border border-slate-800/80 p-3.5 rounded-2xl space-y-2.5 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white text-sm">{item.name}</h4>
                      <span className="text-xs text-slate-400">${item.unitPrice?.toFixed(2)} each</span>
                    </div>
                    <span className="font-black text-orange-400 text-sm">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Notes Input */}
                  <input
                    type="text"
                    placeholder="Special instructions (e.g. Extra cheese)..."
                    value={item.notes}
                    onChange={(e) => updateNotes(idx, e.target.value)}
                    className="w-full bg-[#0d1217] border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />

                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2 bg-[#0d1217] border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black text-white px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary & Action Buttons */}
          <div className="pt-4 border-t border-slate-800/80 space-y-4 shrink-0">
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
                <span className="text-orange-500 text-lg">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={cart.length === 0 || isSendingToKitchen}
                onClick={handleSendToKitchen}
                className="py-3.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingToKitchen ? 'Sending...' : 'To Kitchen'}</span>
              </button>

              <button
                disabled={cart.length === 0}
                onClick={() => setShowCheckoutModal(true)}
                className="py-3.5 px-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-xl shadow-orange-500/25 transition cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay & Invoice</span>
              </button>
            </div>
          </div>
        </div>
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
