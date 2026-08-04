import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tablesApi } from '../../api/tablesApi';
import { 
  ArrowLeft, Plus, Users, Calendar, CheckCircle2, 
  Clock, Sparkles, X, RefreshCw, ShoppingBag 
} from 'lucide-react';

export const TableLayoutPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [selectedTableForRes, setSelectedTableForRes] = useState(null);

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
      setTables(data);
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
        status: 'FREE'
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
    // Default 1 hour from now
    const nextHour = new Date(Date.now() + 3600000).toISOString().slice(0, 16);
    setReservationTime(nextHour);
    setShowReservationModal(true);
  };

  const zones = ['ALL', ...new Set(tables.map(t => t.zone))];
  const filteredTables = selectedZone === 'ALL' 
    ? tables 
    : tables.filter(t => t.zone === selectedZone);

  const freeCount = tables.filter(t => t.status === 'FREE').length;
  const occupiedCount = tables.filter(t => t.status === 'OCCUPIED').length;
  const reservedCount = tables.filter(t => t.status === 'RESERVED').length;

  return (
    <div className="min-h-screen bg-[#0d1217] text-slate-100 p-6 font-sans">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141a22]/90 border border-slate-800/80 backdrop-blur-xl p-4 px-6 rounded-3xl mb-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Tables & Floor Layout</h1>
            <p className="text-xs text-slate-400">The Royal Spice • Live seating & table reservations</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={fetchTables}
            className="p-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddTableModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Table</span>
          </button>
        </div>
      </header>

      {/* Metrics Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#141a22] border border-slate-800/80 p-4 rounded-3xl shadow-lg">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Capacity</div>
          <div className="text-2xl font-black text-white">{tables.length} <span className="text-xs font-normal text-slate-400">Tables</span></div>
        </div>
        <div className="bg-[#141a22] border border-emerald-500/20 p-4 rounded-3xl shadow-lg bg-gradient-to-b from-emerald-500/5 to-transparent">
          <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Available (Free)</div>
          <div className="text-2xl font-black text-emerald-400">{freeCount}</div>
        </div>
        <div className="bg-[#141a22] border border-rose-500/20 p-4 rounded-3xl shadow-lg bg-gradient-to-b from-rose-500/5 to-transparent">
          <div className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">Occupied</div>
          <div className="text-2xl font-black text-rose-400">{occupiedCount}</div>
        </div>
        <div className="bg-[#141a22] border border-amber-500/20 p-4 rounded-3xl shadow-lg bg-gradient-to-b from-amber-500/5 to-transparent">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Reserved</div>
          <div className="text-2xl font-black text-amber-400">{reservedCount}</div>
        </div>
      </div>

      {/* Zone Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {zones.map(z => (
          <button
            key={z}
            onClick={() => setSelectedZone(z)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer shrink-0 border ${
              selectedZone === z 
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-400 shadow-lg shadow-orange-500/25' 
                : 'bg-[#141a22] text-slate-400 hover:bg-slate-900 border-slate-800'
            }`}
          >
            {z === 'ALL' ? 'All Zones' : z}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTables.map(t => {
            const isFree = t.status === 'FREE';
            const isOccupied = t.status === 'OCCUPIED';
            const isReserved = t.status === 'RESERVED';

            return (
              <div 
                key={t.id}
                className={`bg-[#141a22] border rounded-3xl p-5 relative overflow-hidden transition transform hover:-translate-y-1 shadow-xl flex flex-col justify-between ${
                  isFree ? 'border-emerald-500/30 hover:border-emerald-500/60' :
                  isOccupied ? 'border-rose-500/30 hover:border-rose-500/60' :
                  'border-amber-500/30 hover:border-amber-500/60'
                }`}
              >
                {/* Glow bar at top */}
                <div className={`h-1.5 w-full absolute top-0 left-0 ${
                  isFree ? 'bg-emerald-500' :
                  isOccupied ? 'bg-rose-500' : 'bg-amber-500'
                }`} />

                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">{t.tableNumber}</h3>
                      <span className="text-xs text-slate-400 font-medium">{t.zone}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider ${
                      isFree ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      isOccupied ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400 text-xs mb-6">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Capacity: <strong className="text-slate-200">{t.capacity} Guests</strong></span>
                  </div>
                </div>

                {/* Table Actions */}
                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  {isFree && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusChange(t.id, 'OCCUPIED')}
                        className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Occupy
                      </button>
                      <button
                        onClick={() => openReserveModal(t)}
                        className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Reserve
                      </button>
                    </div>
                  )}

                  {isOccupied && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate(`/pos?tableId=${t.id}`)}
                        className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(t.id, 'FREE')}
                        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Release
                      </button>
                    </div>
                  )}

                  {isReserved && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusChange(t.id, 'OCCUPIED')}
                        className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Seat Party
                      </button>
                      <button
                        onClick={() => handleStatusChange(t.id, 'FREE')}
                        className="w-full py-2 bg-[#0d1217] hover:bg-slate-900 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationModal && selectedTableForRes && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowReservationModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-1">Reserve Table {selectedTableForRes.tableNumber}</h2>
            <p className="text-xs text-slate-400 mb-6">Zone: {selectedTableForRes.zone} • Capacity: {selectedTableForRes.capacity} Guests</p>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Party Size</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTableForRes.capacity}
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Special Requests / Notes</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Window seating preferred, anniversary party..."
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition cursor-pointer mt-2"
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141a22] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setShowAddTableModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-4">Add New Table to Layout</h2>

            <form onSubmit={handleCreateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Table Number</label>
                <input
                  type="text"
                  required
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  placeholder="e.g. T3, P1, VIP2"
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Seating Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Floor Zone</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-sm"
                >
                  <option value="Main Dining">Main Dining</option>
                  <option value="Patio">Patio</option>
                  <option value="VIP Section">VIP Section</option>
                  <option value="Bar Area">Bar Area</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition cursor-pointer mt-2"
              >
                Create Table
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
