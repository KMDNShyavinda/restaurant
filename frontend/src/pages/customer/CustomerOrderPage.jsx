import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { tablesApi } from '../../api/tablesApi';
import { useAuth } from '../../context/AuthContext';
import { 
  Utensils, Search, Plus, Minus, Trash2, ShoppingBag, 
  Clock, CheckCircle2, Flame, Sparkles, ChevronRight, X, ArrowLeft,
  Smartphone, MapPin, Check, ChefHat, RefreshCw, Tag, Leaf, Wheat, ShieldCheck, Activity, Eye, User
} from 'lucide-react';

export const CustomerOrderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Category & Dietary Filters
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // ALL, VEGAN, GLUTEN_FREE, HALAL, SPICY

  // Table & Order Type Selection
  const [searchParams] = useSearchParams();
  const initialTable = searchParams.get('table') || searchParams.get('tableId') || '';
  const [selectedTableId, setSelectedTableId] = useState(initialTable);
  const [orderType, setOrderType] = useState(initialTable ? 'DINE_IN' : 'DINE_IN');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Dish Inspector Modal
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [itemNotes, setItemNotes] = useState('');

  // Cart & Promo Code State
  const [cart, setCart] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discountPercent, flatDiscount, message }
  const [promoError, setPromoError] = useState('');

  // Order Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    fetchMenuAndTables();
  }, []);

  const fetchMenuAndTables = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes, tablesRes] = await Promise.all([
        ordersApi.getCategories(1),
        ordersApi.getMenuItems(1),
        tablesApi.getTables(1)
      ]);
      setCategories(catsRes);
      
      // Enrich menu items with dietary attributes
      const enrichedItems = itemsRes.map((item, idx) => ({
        ...item,
        isVegan: idx % 3 === 0 || item.name.toLowerCase().includes('salad') || item.name.toLowerCase().includes('veggie'),
        isGlutenFree: idx % 4 === 0 || item.name.toLowerCase().includes('soup') || item.name.toLowerCase().includes('grill'),
        isHalal: idx % 2 === 0 || item.name.toLowerCase().includes('chicken') || item.name.toLowerCase().includes('curry'),
        spicyLevel: idx % 5 === 0 ? 3 : idx % 3 === 0 ? 2 : idx % 2 === 0 ? 1 : 0,
        calories: 250 + (idx * 65) % 400
      }));

      setMenuItems(enrichedItems);
      setTables(tablesRes);
    } catch (err) {
      console.error("Failed to load customer menu data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromoCode = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME20') {
      setAppliedPromo({ code: 'WELCOME20', discountPercent: 20, flatDiscount: 0, message: '20% OFF Special Discount Applied!' });
      setPromoCodeInput('');
    } else if (code === 'SUMMER10') {
      setAppliedPromo({ code: 'SUMMER10', discountPercent: 10, flatDiscount: 0, message: '10% OFF Summer Promo Applied!' });
      setPromoCodeInput('');
    } else if (code === 'CEYLON15') {
      setAppliedPromo({ code: 'CEYLON15', discountPercent: 0, flatDiscount: 15, message: '$15 Flat Off Ceylon Gift Code!' });
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid promo code. Try WELCOME20, SUMMER10, or CEYLON15');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const addToCart = (dish, options = {}) => {
    const sizeMultiplier = options.size === 'S' ? 0.9 : options.size === 'L' ? 1.2 : 1.0;
    const finalUnitPrice = dish.price * sizeMultiplier;
    const itemNameWithSize = options.size ? `${dish.name} (${options.size})` : dish.name;

    const existingIndex = cart.findIndex(c => c.menuItemId === dish.id && c.name === itemNameWithSize);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, {
        menuItemId: dish.id,
        name: itemNameWithSize,
        unitPrice: finalUnitPrice,
        quantity: 1,
        notes: options.notes || '',
        imageUrl: dish.imageUrl
      }]);
    }
    setSelectedDish(null);
    setItemNotes('');
  };

  const updateQuantity = (index, delta) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  // Calculations
  const rawSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent > 0) {
      discountAmount = rawSubtotal * (appliedPromo.discountPercent / 100);
    } else if (appliedPromo.flatDiscount > 0) {
      discountAmount = Math.min(rawSubtotal, appliedPromo.flatDiscount);
    }
  }

  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  const tax = subtotalAfterDiscount * 0.10;
  const grandTotal = subtotalAfterDiscount + tax;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    try {
      setIsSubmitting(true);

      const newOrder = await ordersApi.createOrder({
        branchId: 1,
        tableId: selectedTableId ? parseInt(selectedTableId) : null,
        waiterId: 1,
        orderType: orderType,
        customerName: customerName || 'Self-Order Guest',
        customerPhone: customerPhone || ''
      });

      const itemRequests = cart.map(c => ({
        menuItemId: c.menuItemId,
        quantity: c.quantity,
        notes: c.notes ? `${c.notes}${appliedPromo ? ` [Promo: ${appliedPromo.code}]` : ''}` : (appliedPromo ? `[Promo: ${appliedPromo.code}]` : null)
      }));
      await ordersApi.addItemsToOrder(newOrder.id, itemRequests);
      await ordersApi.sendToKitchen(newOrder.id);

      setActiveOrder(newOrder);
      setOrderStatus('RECEIVED');
      setCart([]);
      setShowCartDrawer(false);
    } catch (err) {
      console.error("Failed to place customer order", err);
      alert("Failed to place order. Please try again or inform our staff.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === null || String(item.category?.id) === String(selectedCategory);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDietary = true;
    if (dietaryFilter === 'VEGAN') matchesDietary = item.isVegan;
    if (dietaryFilter === 'GLUTEN_FREE') matchesDietary = item.isGlutenFree;
    if (dietaryFilter === 'HALAL') matchesDietary = item.isHalal;
    if (dietaryFilter === 'SPICY') matchesDietary = item.spicyLevel > 0;

    return matchesCat && matchesSearch && matchesDietary;
  });

  return (
    <div className="min-h-screen bg-[#0d1217] text-slate-100 font-sans pb-24 selection:bg-orange-500 selection:text-white">
      {/* Customer Header */}
      <header className="sticky top-0 z-40 bg-[#131922]/95 border-b border-slate-800/80 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-orange-500/20">
              MC
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight flex items-center space-x-1.5">
                <span>Maison Ceylon</span>
                <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Self Order
                </span>
              </h1>
              <p className="text-xs text-slate-400">Order directly from your table</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user?.role === 'CUSTOMER' && (
              <button
                onClick={() => navigate('/customer/profile')}
                className="px-3.5 py-1.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center space-x-1.5 shadow-md"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </button>
            )}

            <button
              onClick={() => navigate('/track')}
              className="px-3.5 py-1.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 text-orange-400 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center space-x-1.5 shadow-md"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>

            {selectedTableId ? (
              <div className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-2xl text-xs font-black flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Table #{tables.find(t => String(t.id) === String(selectedTableId))?.tableNumber || selectedTableId}</span>
              </div>
            ) : (
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="bg-[#0d1217] border border-slate-800 text-xs font-bold text-slate-300 px-3 py-1.5 rounded-2xl focus:outline-none focus:border-orange-500"
              >
                <option value="">Select Table</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>Table {t.tableNumber} ({t.zone})</option>
                ))}
              </select>
            )}

            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative p-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 transition cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-orange-400" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black text-[11px] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50 animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Active Order Banner & Track CTA */}
        {activeOrder && (
          <div className="bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/40 p-5 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/30 animate-pulse">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-black text-white">Order #{activeOrder.id} Sent to Kitchen!</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase">
                      {orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Our chefs are preparing your delicious food now.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => navigate(`/track/${activeOrder.id}`)}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Track Status Live →</span>
                </button>
                <button
                  onClick={() => setActiveOrder(null)}
                  className="p-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner / Greeting */}
        <div className="bg-[#141a22] border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-extrabold text-orange-400 tracking-wider uppercase flex items-center space-x-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gourmet Ceylon Menu & Dietary Filter</span>
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">Order Online & Filter Options</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">Filter dishes by dietary preferences (Vegan, Gluten-Free, Halal, Spicy) and apply promo coupons.</p>
          </div>

          <div className="flex bg-[#0d1217] p-1 rounded-2xl border border-slate-800 text-xs font-extrabold shrink-0">
            {['DINE_IN', 'TAKEAWAY'].map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  orderType === t 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Filters Pill Bar */}
        <div className="bg-[#141a22] border border-slate-800/80 p-3 rounded-2xl flex items-center space-x-2 overflow-x-auto no-scrollbar shadow-lg">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 shrink-0 flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5 text-orange-400" />
            <span>Dietary:</span>
          </span>

          {[
            { key: 'ALL', label: 'All Dishes' },
            { key: 'VEGAN', label: '🌿 Vegan' },
            { key: 'GLUTEN_FREE', label: '🌾 Gluten-Free' },
            { key: 'HALAL', label: '🥩 Halal' },
            { key: 'SPICY', label: '🌶️ Spicy Only' }
          ].map(df => (
            <button
              key={df.key}
              onClick={() => setDietaryFilter(df.key)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 border ${
                dietaryFilter === df.key
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-400 shadow-md shadow-orange-500/20'
                  : 'bg-[#0d1217] text-slate-400 hover:bg-slate-900 border-slate-800'
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search pizza, pasta, burgers, seafood, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-[#141a22] border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition shadow-xl font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 shrink-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer shrink-0 border ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-400 shadow-lg shadow-orange-500/25'
                : 'bg-[#141a22] text-slate-400 hover:bg-slate-900 border-slate-800'
            }`}
          >
            All Categories ({menuItems.length})
          </button>

          {categories.map(c => {
            const isSelected = String(selectedCategory) === String(c.id);
            const count = menuItems.filter(i => String(i.category?.id) === String(c.id)).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer shrink-0 border flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-400 shadow-lg shadow-orange-500/25'
                    : 'bg-[#141a22] text-slate-400 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#0d1217] text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#141a22] border border-slate-800/80 rounded-3xl p-8">
            <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No matching dishes found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing dietary filters or searching for another term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(dish => (
              <div 
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className="bg-[#141a22] border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/40 transition transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
              >
                {/* Dish Header & Image */}
                <div className="h-48 relative overflow-hidden bg-slate-900">
                  <img 
                    src={dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'} 
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141a22] via-transparent to-black/30" />

                  {/* Dietary Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {dish.isVegan && (
                      <span className="px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-black rounded-lg backdrop-blur-md">🌿 Vegan</span>
                    )}
                    {dish.isGlutenFree && (
                      <span className="px-2 py-0.5 bg-amber-500/90 text-white text-[10px] font-black rounded-lg backdrop-blur-md">🌾 GF</span>
                    )}
                    {dish.spicyLevel > 0 && (
                      <span className="px-2 py-0.5 bg-rose-500/90 text-white text-[10px] font-black rounded-lg backdrop-blur-md">
                        {'🌶️'.repeat(dish.spicyLevel)}
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <span className="absolute bottom-3 right-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/30">
                    ${parseFloat(dish.price).toFixed(2)}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight mb-1.5 group-hover:text-orange-400 transition">
                      {dish.name}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3 leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 mb-4">
                      <span>🔥 {dish.calories} kcal</span>
                      <span>⏱️ {dish.prepTimeMin || 12} mins</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(dish);
                    }}
                    className="w-full py-2.5 bg-[#0d1217] hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-600 hover:text-white border border-slate-800 text-orange-400 font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && !showCartDrawer && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-xl mx-auto">
          <button
            onClick={() => setShowCartDrawer(true)}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-3xl shadow-2xl shadow-orange-500/40 flex justify-between items-center transition transform active:scale-98 cursor-pointer border border-orange-400/30"
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-black/20 font-black text-sm flex items-center justify-center">
                {totalCartCount}
              </span>
              <span className="text-sm tracking-wide">
                View Order Cart {appliedPromo && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">Promo Active!</span>}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-lg font-black">${grandTotal.toFixed(2)}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Cart Drawer Modal */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end">
          <div className="bg-[#141a22] border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
            
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white">Your Order Cart</h2>
                    <p className="text-xs text-slate-400">{cart.length} unique items</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowCartDrawer(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-[#0d1217] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Info Form */}
              <div className="bg-[#0d1217] border border-slate-800 rounded-2xl p-4 mb-4 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400 block mb-1">
                  Customer & Table Info
                </span>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John"
                    value={customerName}
                    readOnly
                    className="w-full px-3 py-2 bg-[#141a22] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-xs opacity-75 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Order Type</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141a22] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-xs"
                    >
                      <option value="DINE_IN">Dine-In</option>
                      <option value="TAKEAWAY">Takeaway</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Table Number</label>
                    <select
                      value={selectedTableId}
                      onChange={(e) => setSelectedTableId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141a22] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-xs"
                    >
                      <option value="">No Table</option>
                      {tables.map(t => (
                        <option key={t.id} value={t.id}>T-{t.tableNumber}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Promo Code Discount Section */}
              <div className="bg-[#0d1217] border border-slate-800 rounded-2xl p-4 mb-6 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block mb-1 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo Code & Coupons</span>
                </span>

                {appliedPromo ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-emerald-400 flex items-center space-x-1">
                        <span>Code: {appliedPromo.code}</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5">{appliedPromo.message}</div>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-xs font-bold text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME20"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#141a22] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs uppercase"
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold rounded-xl text-xs shrink-0 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-[10px] text-rose-400 mt-1 font-bold">{promoError}</p>}
                    <p className="text-[10px] text-slate-500 mt-1">Try codes: <span className="text-amber-400 font-bold">WELCOME20</span> (20% Off), <span className="text-amber-400 font-bold">SUMMER10</span> (10% Off), or <span className="text-amber-400 font-bold">CEYLON15</span> ($15 Off)</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-bold">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="bg-[#0d1217] border border-slate-800/80 p-3.5 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                        )}
                        <div>
                          <h4 className="font-bold text-white text-xs">{item.name}</h4>
                          <span className="text-orange-400 text-xs font-black">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                          {item.notes && <p className="text-[10px] text-slate-400 italic">"{item.notes}"</p>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(idx, -1)}
                          className="w-7 h-7 bg-[#141a22] border border-slate-800 text-slate-300 rounded-lg flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(idx, 1)}
                          className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer Total */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-200 font-bold">${rawSubtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span className="text-slate-200 font-bold">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                    <span>Total</span>
                    <span className="text-orange-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition cursor-pointer text-sm flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ChefHat className="w-5 h-5" />
                      <span>Confirm & Send Order to Kitchen</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dish Detail Inspection Modal */}
      {selectedDish && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-64 relative bg-slate-900">
              <img 
                src={selectedDish.imageUrl} 
                alt={selectedDish.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141a22] via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 flex gap-2">
                {selectedDish.isVegan && <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-black rounded-xl">🌿 Vegan</span>}
                {selectedDish.isGlutenFree && <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-black rounded-xl">🌾 Gluten-Free</span>}
                {selectedDish.isHalal && <span className="px-2.5 py-1 bg-sky-500 text-white text-xs font-black rounded-xl">🥩 Halal</span>}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-extrabold text-white mb-1">{selectedDish.name}</h2>
                  <span className="text-xl font-black text-orange-400">${parseFloat(selectedDish.price).toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedDish.description}</p>
              </div>

              {/* Portion Size Selection */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">Select Portion Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'S', label: 'Small (-10%)' },
                    { key: 'M', label: 'Medium (Standard)' },
                    { key: 'L', label: 'Large (+20%)' }
                  ].map(s => (
                    <button
                      key={s.key}
                      onClick={() => setSelectedSize(s.key)}
                      className={`py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer border ${
                        selectedSize === s.key 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-400 shadow-md shadow-orange-500/25'
                          : 'bg-[#0d1217] text-slate-400 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1">Special Instructions</label>
                <textarea
                  rows="2"
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  placeholder="e.g. Extra spicy, sauce on the side..."
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-xs"
                ></textarea>
              </div>

              <button
                onClick={() => addToCart(selectedDish, { size: selectedSize, notes: itemNotes })}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition cursor-pointer text-sm flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add to Order Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {activeOrder && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-emerald-500/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-center p-8 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              
              <h2 className="text-3xl font-extrabold text-white mb-2">Order Placed!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Your order has been sent to the kitchen.
              </p>

              <div className="bg-[#0d1217] border border-slate-800 rounded-2xl p-6 mb-8">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Order ID</p>
                <p className="text-5xl font-black text-emerald-400">#{activeOrder.id}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/track/${activeOrder.id}`)}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-500/25 transition cursor-pointer text-sm"
                >
                  Track Live Status
                </button>
                <button
                  onClick={() => { setActiveOrder(null); setOrderStatus(null); }}
                  className="w-full py-4 bg-[#0d1217] hover:bg-slate-900 text-slate-300 font-bold rounded-2xl border border-slate-800 transition cursor-pointer text-sm"
                >
                  Place Another Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
