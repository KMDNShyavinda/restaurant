import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutGrid, ShoppingCart, Tv, Package, ShieldCheck, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0d1217] text-slate-100 p-6 font-sans">
      {/* Top Navbar */}
      <header className="flex justify-between items-center bg-[#141a22]/90 border border-slate-800/80 backdrop-blur-xl p-4 px-6 rounded-3xl mb-8 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 border border-orange-400/30 flex items-center justify-center text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 tracking-wider">
            MC
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Maison Ceylon</h1>
            <p className="text-xs text-slate-400">Welcome back, <span className="text-orange-400 font-extrabold">{user?.name}</span> ({user?.role})</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-2xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Grid Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div
          onClick={() => navigate('/tables')}
          className="bg-[#141a22] border border-slate-800/80 hover:border-orange-500/50 p-6 rounded-3xl transition cursor-pointer group shadow-xl hover:-translate-y-1 duration-300"
        >
          <div className="w-13 h-13 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-orange-500/20">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white mb-1 group-hover:text-orange-400 transition">Tables & Floor Layout</h3>
          <p className="text-slate-400 text-xs leading-relaxed">View interactive dining zone tables & live availability status</p>
        </div>

        <div
          onClick={() => navigate('/pos')}
          className="bg-[#141a22] border border-slate-800/80 hover:border-orange-500/50 p-6 rounded-3xl transition cursor-pointer group shadow-xl hover:-translate-y-1 duration-300"
        >
          <div className="w-13 h-13 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-amber-500/20">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white mb-1 group-hover:text-amber-400 transition">Order Entry Terminal</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Add menu items, select modifiers & send order directly to kitchen</p>
        </div>

        <div
          onClick={() => navigate('/kds')}
          className="bg-[#141a22] border border-slate-800/80 hover:border-orange-500/50 p-6 rounded-3xl transition cursor-pointer group shadow-xl hover:-translate-y-1 duration-300"
        >
          <div className="w-13 h-13 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-orange-500/20">
            <Tv className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white mb-1 group-hover:text-orange-400 transition">Kitchen Display System (KDS)</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Real-time live kitchen tickets stream via STOMP WebSocket</p>
        </div>

        <div
          onClick={() => navigate('/inventory')}
          className="bg-[#141a22] border border-slate-800/80 hover:border-amber-500/50 p-6 rounded-3xl transition cursor-pointer group shadow-xl hover:-translate-y-1 duration-300"
        >
          <div className="w-13 h-13 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition border border-amber-500/20">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white mb-1 group-hover:text-amber-400 transition">Stock & Ingredients</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Track BOM raw materials, low stock warnings & stock adjustments</p>
        </div>

        <div
          onClick={() => window.open('/order', '_blank')}
          className="bg-[#141a22] border border-slate-800/80 hover:border-orange-500/50 p-6 rounded-3xl transition cursor-pointer group shadow-xl hover:-translate-y-1 duration-300"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition border border-orange-500/30 shadow-lg shadow-orange-500/20">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white mb-1 group-hover:text-orange-400 transition flex items-center space-x-2">
            <span>Customer Order Portal</span>
            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] rounded-lg">LIVE</span>
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">QR Code & Table Self-Ordering Portal for customers to browse & order</p>
        </div>
      </div>
    </div>
  );
};
