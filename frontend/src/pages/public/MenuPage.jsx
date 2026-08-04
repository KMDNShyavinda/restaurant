import React, { useState, useEffect } from 'react';
import { ordersApi } from '../../api/ordersApi';
import { Search, Plus, Sparkles, Flame, Leaf, Check } from 'lucide-react';

export const MenuPage = ({ addToCart }) => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const [catsRes, itemsRes] = await Promise.all([
          ordersApi.getCategories(1),
          ordersApi.getMenuItems(1)
        ]);
        setCategories(catsRes);
        setMenuItems(itemsRes);
      } catch (err) {
        console.error("Failed to load public menu", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedItemNotice(item.name);
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCat = !selectedCategory || item.category?.id === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast Notice */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white font-semibold text-xs px-4 py-3 rounded-2xl shadow-2xl z-50 flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Added "{addedItemNotice}" to your basket!</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-400 block mb-2">Artisanal Flavors</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Our Online Menu</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Explore our freshly prepared dishes crafted by master chefs using organic, locally sourced ingredients.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              selectedCategory === null
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Menu Items ({menuItems.length})
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-3xl p-6 transition transform hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-sky-400">
                    {item.category?.name || 'Chef Special'}
                  </span>
                  <span className="text-lg font-black text-emerald-400">${item.price?.toFixed(2)}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-sky-400 transition">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold">Freshly Prepared</span>
                <button
                  onClick={() => handleAdd(item)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Basket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
