import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tablesApi } from '../../api/tablesApi';
import { 
  ArrowLeft, Plus, Users, Calendar, CheckCircle2, 
  Clock, Sparkles, X, RefreshCw, ShoppingBag, Map, Save, LayoutGrid
} from 'lucide-react';

export const TableLayoutPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [selectedTableForRes, setSelectedTableForRes] = useState(null);

  // Edit Mode state
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const containerRef = useRef(null);

  // Reservation form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');

  // Add Table form state
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newCapacity, setNewCapacity] = useState(4);
  const [newZone, setNewZone] = useState('Main Dining');

  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await tablesApi.getTables(1);
      // Give default coordinates if null
      const processed = data.map((t, idx) => ({
        ...t,
        positionX: t.positionX ?? (50 + (idx % 4) * 150),
        positionY: t.positionY ?? (50 + Math.floor(idx / 4) * 150)
      }));
      setTables(processed);
    } catch (err) {
      console.error("Failed to load tables", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      await tablesApi.updateTableStatus(tableId, newStatus);
      fetchTables();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    try {
      await tablesApi.createReservation({
        branchId: 1,
        tableId: selectedTableForRes.id,
        customerName,
        customerPhone,
        reservationTime: new Date(reservationTime).toISOString(),
        partySize: parseInt(partySize),
        notes
      });
      setShowReservationModal(false);
      resetReservationForm();
      fetchTables();
    } catch (err) {
      console.error("Failed to create reservation", err);
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      await tablesApi.createTable({
        branchId: 1,
        tableNumber: newTableNumber,
        capacity: parseInt(newCapacity),
        zone: newZone,
        status: 'FREE',
        positionX: 100,
        positionY: 100
      });
      setShowAddTableModal(false);
      setNewTableNumber('');
      fetchTables();
    } catch (err) {
      console.error("Failed to create table", err);
    }
  };

  const resetReservationForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setReservationTime('');
    setPartySize(2);
    setNotes('');
    setSelectedTableForRes(null);
  };

  const openReserveModal = (table) => {
    setSelectedTableForRes(table);
    const nextHour = new Date(Date.now() + 3600000).toISOString().slice(0, 16);
    setReservationTime(nextHour);
    setShowReservationModal(true);
  };

  const handleDragEnd = (event, info, tableId) => {
    if (!isEditingMode) return;
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          positionX: t.positionX + info.offset.x,
          positionY: t.positionY + info.offset.y
        };
      }
      return t;
    }));
  };

  const handleSaveLayout = async () => {
    try {
      setIsSavingLayout(true);
      await Promise.all(tables.map(t => 
        tablesApi.updateTablePosition(t.id, t.positionX, t.positionY)
      ));
      setIsEditingMode(false);
    } catch (error) {
      console.error("Failed to save layout", error);
      alert("Error saving layout");
    } finally {
      setIsSavingLayout(false);
    }
  };

  const zones = ['ALL', ...new Set(tables.map(t => t.zone))];
  const filteredTables = selectedZone === 'ALL' 
    ? tables 
    : tables.filter(t => t.zone === selectedZone);

  const freeCount = tables.filter(t => t.status === 'FREE').length;
  const occupiedCount = tables.filter(t => t.status === 'OCCUPIED').length;
  const reservedCount = tables.filter(t => t.status === 'RESERVED').length;

  const getShapeClass = (capacity) => {
    if (capacity <= 2) return 'rounded-2xl w-24 h-24'; // Small Square
    if (capacity >= 6) return 'rounded-full w-32 h-32'; // Large Circle
    return 'rounded-3xl w-32 h-24'; // Rectangle
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center bg-[#11161d] border-b border-amber-500/30 p-4 px-6 shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/welcome')}
            className="p-2.5 bg-[#07090c] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-amber-400" />
          </button>
          
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150" 
                alt="Waitstaff" 
                className="w-10 h-10 rounded-2xl object-cover border-2 border-amber-500"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#11161d] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-extrabold text-white">Interactive Floor Plan</h1>
              </div>
              <p className="text-[11px] text-slate-400">Live Table Monitoring & Layout</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTables}
            className="p-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Mobile Zone Filter (hidden on desktop) */}
          <select 
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="md:hidden bg-[#0d1217] border border-slate-800 text-amber-400 text-xs font-bold px-3 py-2.5 rounded-2xl focus:outline-none focus:border-amber-500 shadow-inner"
          >
            {zones.map(z => (
              <option key={z} value={z}>{z === 'ALL' ? 'All Zones' : z}</option>
            ))}
          </select>
          
          {isEditingMode ? (
            <button
              onClick={handleSaveLayout}
              disabled={isSavingLayout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-2xl transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingLayout ? 'Saving...' : 'Save Layout'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditingMode(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#0d1217] border border-amber-500/30 hover:border-amber-500 text-amber-400 font-extrabold rounded-2xl transition cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Edit Layout</span>
            </button>
          )}

          <button
            onClick={() => setShowAddTableModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Filters & Stats (Hidden on mobile) */}
        <div className="hidden md:flex w-64 bg-[#11161d] border-r border-slate-800 p-5 shrink-0 overflow-y-auto z-10 flex-col space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Occupancy Status</h3>
            <div className="space-y-3">
              <div className="bg-[#07090c] border border-emerald-500/20 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-emerald-400 text-sm font-semibold">Free</span>
                <span className="text-xl font-black text-emerald-400">{freeCount}</span>
              </div>
              <div className="bg-[#07090c] border border-rose-500/20 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-rose-400 text-sm font-semibold">Occupied</span>
                <span className="text-xl font-black text-rose-400">{occupiedCount}</span>
              </div>
              <div className="bg-[#07090c] border border-amber-500/20 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-amber-400 text-sm font-semibold">Reserved</span>
                <span className="text-xl font-black text-amber-400">{reservedCount}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4" />
              <span>Floor Zones</span>
            </h3>
            <div className="space-y-2">
              {zones.map(z => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                    selectedZone === z 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {z === 'ALL' ? 'Show All Zones' : z}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Area: Interactive Canvas */}
        <div 
          className="flex-1 bg-[#0a0d11] relative overflow-hidden" 
          ref={containerRef}
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}
        >
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            filteredTables.map(t => {
              const isFree = t.status === 'FREE';
              const isOccupied = t.status === 'OCCUPIED';
              
              const statusColors = isFree 
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-400' 
                : isOccupied 
                  ? 'border-rose-500/50 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.2)] text-rose-400'
                  : 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-400';

              return (
                <motion.div
                  key={t.id}
                  drag={isEditingMode}
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  onDragEnd={(e, info) => handleDragEnd(e, info, t.id)}
                  initial={{ x: t.positionX, y: t.positionY }}
                  animate={{ x: t.positionX, y: t.positionY }}
                  whileHover={!isEditingMode ? { scale: 1.05 } : {}}
                  className={`absolute flex flex-col items-center justify-center border-2 backdrop-blur-md cursor-${isEditingMode ? 'move' : 'pointer'} ${getShapeClass(t.capacity)} ${statusColors} group`}
                >
                  <span className="text-xl font-black">{t.tableNumber}</span>
                  <div className="flex items-center space-x-1 mt-1 opacity-70">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{t.capacity}</span>
                  </div>

                  {/* Actions Popover (Hover only in View Mode) */}
                  {!isEditingMode && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-[#11161d] border border-slate-700 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-30 p-2 grid gap-2">
                      {isFree && (
                        <>
                          <button onClick={() => handleStatusChange(t.id, 'OCCUPIED')} className="w-full py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-bold rounded-xl">Seat Guest</button>
                          <button onClick={() => openReserveModal(t)} className="w-full py-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-bold rounded-xl">Reserve</button>
                        </>
                      )}
                      {isOccupied && (
                        <>
                          <button onClick={() => navigate(`/pos?tableId=${t.id}`)} className="w-full py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center space-x-1"><ShoppingBag className="w-3 h-3"/><span>Order</span></button>
                          <button onClick={() => handleStatusChange(t.id, 'FREE')} className="w-full py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold rounded-xl">Clear Table</button>
                        </>
                      )}
                      {!isFree && !isOccupied && (
                        <>
                          <button onClick={() => handleStatusChange(t.id, 'OCCUPIED')} className="w-full py-1.5 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl">Arrived</button>
                          <button onClick={() => handleStatusChange(t.id, 'FREE')} className="w-full py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals remain structurally similar, stylized for the Amber theme */}
      {showReservationModal && selectedTableForRes && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#141a22] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowReservationModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-white mb-1">Reserve Table {selectedTableForRes.tableNumber}</h2>
            <p className="text-xs text-slate-400 mb-6">Capacity: {selectedTableForRes.capacity} Guests</p>
            <form onSubmit={handleCreateReservation} className="space-y-4">
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Name" className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-sm" />
              <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-sm" />
              <input type="datetime-local" required value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-sm" />
              <input type="number" min="1" max={selectedTableForRes.capacity} value={partySize} onChange={(e) => setPartySize(e.target.value)} className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="Party Size" />
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/25 transition mt-2">Confirm Reservation</button>
            </form>
          </motion.div>
        </div>
      )}

      {showAddTableModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#141a22] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowAddTableModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-white mb-4">Add New Table</h2>
            <form onSubmit={handleCreateTable} className="space-y-4">
              <input type="text" required value={newTableNumber} onChange={(e) => setNewTableNumber(e.target.value)} placeholder="Table Number (e.g. T1)" className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-sm" />
              <input type="number" min="1" max="20" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} placeholder="Capacity" className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-sm" />
              <select value={newZone} onChange={(e) => setNewZone(e.target.value)} className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-sm">
                <option value="Main Dining">Main Dining</option>
                <option value="Patio">Patio</option>
                <option value="VIP Section">VIP Section</option>
              </select>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/25 transition mt-2">Create Table</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
