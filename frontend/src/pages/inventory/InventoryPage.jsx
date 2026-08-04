import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../api/inventoryApi';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Package, Plus, AlertTriangle, RefreshCw, 
  Search, SlidersHorizontal, ArrowUpRight, ArrowDownRight, Edit3, X 
} from 'lucide-react';

export const InventoryPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [selectedIngredientForAdj, setSelectedIngredientForAdj] = useState(null);

  // Add Ingredient Form
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [currentStock, setCurrentStock] = useState('10.0');
  const [reorderLevel, setReorderLevel] = useState('3.0');

  // Stock Adjustment Form
  const [adjType, setAdjType] = useState('RECEIVED');
  const [adjQuantity, setAdjQuantity] = useState('5.0');
  const [adjReason, setAdjReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allIngs, lowIngs] = await Promise.all([
        inventoryApi.getIngredients(1),
        inventoryApi.getLowStockIngredients(1)
      ]);
      setIngredients(allIngs);
      setLowStockList(lowIngs);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateIngredient = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await inventoryApi.createIngredient({
        branchId: 1,
        name,
        unit,
        currentStock: parseFloat(currentStock),
        reorderLevel: parseFloat(reorderLevel)
      });
      setShowAddModal(false);
      setName('');
      fetchData();
    } catch (err) {
      console.error("Failed to create ingredient", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordAdjustment = async (e) => {
    e.preventDefault();
    if (!selectedIngredientForAdj) return;
    try {
      setIsSubmitting(true);
      await inventoryApi.recordAdjustment({
        ingredientId: selectedIngredientForAdj.id,
        branchId: 1,
        type: adjType,
        quantity: parseFloat(adjQuantity),
        reason: adjReason || `Manual ${adjType} adjustment`,
        recordedById: user?.id || 1
      });
      setShowAdjModal(false);
      setSelectedIngredientForAdj(null);
      setAdjReason('');
      fetchData();
    } catch (err) {
      console.error("Failed to record adjustment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAdjustmentModal = (ing) => {
    setSelectedIngredientForAdj(ing);
    setAdjQuantity('5.0');
    setAdjType('RECEIVED');
    setShowAdjModal(true);
  };

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = unitFilter === 'ALL' || ing.unit === unitFilter;
    return matchesSearch && matchesUnit;
  });

  const units = ['ALL', ...new Set(ingredients.map(i => i.unit))];

  return (
    <div className="min-h-screen bg-[#0d1217] text-slate-100 p-6 flex flex-col font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141a22]/90 border border-slate-800/80 backdrop-blur-xl p-4 px-6 rounded-3xl mb-6 shadow-2xl shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">Stock & Raw Ingredients</h1>
              <p className="text-xs text-slate-400">The Royal Spice • BOM materials & low stock warnings</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={fetchData}
            className="p-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Ingredient</span>
          </button>
        </div>
      </header>

      {/* Low Stock Warning Alert Banner */}
      {lowStockList.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-3xl mb-6 flex items-start space-x-3 text-rose-300 shrink-0">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-extrabold text-sm text-rose-200">Attention: Low Stock Threshold Warning ({lowStockList.length} Items)</h3>
            <p className="text-xs text-rose-300/80 mt-0.5">The following ingredients have reached or fallen below their reorder level thresholds:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {lowStockList.map(item => (
                <span key={item.id} className="px-2.5 py-1 bg-rose-900/40 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-200">
                  {item.name} ({item.currentStock} {item.unit} / Reorder: {item.reorderLevel} {item.unit})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-[#141a22] border border-slate-800/80 p-4 rounded-3xl shadow-lg">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Ingredients Tracked</div>
          <div className="text-2xl font-black text-white">{ingredients.length} <span className="text-xs font-normal text-slate-400">Items</span></div>
        </div>
        <div className="bg-[#141a22] border border-emerald-500/20 p-4 rounded-3xl shadow-lg bg-gradient-to-b from-emerald-500/5 to-transparent">
          <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Healthy Stock Items</div>
          <div className="text-2xl font-black text-emerald-400">{ingredients.length - lowStockList.length}</div>
        </div>
        <div className="bg-[#141a22] border border-rose-500/20 p-4 rounded-3xl shadow-lg bg-gradient-to-b from-rose-500/5 to-transparent">
          <div className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">Low Stock Alerts</div>
          <div className="text-2xl font-black text-rose-400">{lowStockList.length}</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 shrink-0">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141a22] border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 font-bold shrink-0">Unit:</span>
          {units.map(u => (
            <button
              key={u}
              onClick={() => setUnitFilter(u)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 border ${
                unitFilter === u 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-400 shadow-md shadow-orange-500/25' 
                  : 'bg-[#141a22] text-slate-400 hover:bg-slate-900 border-slate-800'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients Table */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="flex-1 bg-[#141a22] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d1217] text-slate-400 uppercase font-extrabold border-b border-slate-800">
                <tr>
                  <th className="p-4">Ingredient Name</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Reorder Level</th>
                  <th className="p-4">Stock Health</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIngredients.map(ing => {
                  const isLow = ing.currentStock <= ing.reorderLevel;
                  const ratio = ing.reorderLevel > 0 ? (ing.currentStock / (ing.reorderLevel * 2)) * 100 : 100;
                  const clampedRatio = Math.min(Math.max(ratio, 5), 100);

                  return (
                    <tr key={ing.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-4 font-black text-white text-sm">{ing.name}</td>
                      <td className="p-4 font-mono font-black text-slate-200">
                        {ing.currentStock} <span className="text-slate-400 font-normal text-xs">{ing.unit}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">
                        {ing.reorderLevel} <span className="text-slate-500 text-xs">{ing.unit}</span>
                      </td>
                      <td className="p-4 w-44">
                        <div className="w-full bg-[#0d1217] h-2 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              isLow ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${clampedRatio}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider ${
                          isLow ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {isLow ? 'LOW STOCK' : 'HEALTHY'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openAdjustmentModal(ing)}
                          className="px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 font-extrabold rounded-2xl text-xs transition cursor-pointer"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjModal && selectedIngredientForAdj && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowAdjModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-1">Adjust Stock: {selectedIngredientForAdj.name}</h2>
            <p className="text-xs text-slate-400 mb-6">Current Stock: <strong className="text-white">{selectedIngredientForAdj.currentStock} {selectedIngredientForAdj.unit}</strong></p>

            <form onSubmit={handleRecordAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Adjustment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'RECEIVED', label: 'Received (+)', color: 'text-emerald-400' },
                    { id: 'WASTAGE', label: 'Wastage (-)', color: 'text-rose-400' },
                    { id: 'CORRECTION', label: 'Correction (=)', color: 'text-orange-400' }
                  ].map(t => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setAdjType(t.id)}
                      className={`py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
                        adjType === t.id
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25'
                          : 'bg-[#0d1217] text-slate-400 border border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Quantity ({selectedIngredientForAdj.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={adjQuantity}
                  onChange={(e) => setAdjQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  placeholder="Supplier shipment #402, spoiled stock..."
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition cursor-pointer mt-2"
              >
                {isSubmitting ? 'Recording...' : 'Confirm Stock Adjustment'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-4">Add New Raw Ingredient</h2>

            <form onSubmit={handleCreateIngredient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Ingredient Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Extra Virgin Olive Oil, Flour..."
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-xs"
                  >
                    <option value="kg">kg</option>
                    <option value="l">l</option>
                    <option value="pcs">pcs</option>
                    <option value="g">g</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition cursor-pointer mt-2"
              >
                {isSubmitting ? 'Saving...' : 'Create Ingredient'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
