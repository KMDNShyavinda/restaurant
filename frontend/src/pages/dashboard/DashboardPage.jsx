import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutGrid, ShoppingCart, Tv, Package, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Top Navbar */}
      <header className="flex justify-between items-center bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-4 rounded-2xl mb-8 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
            POS
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Gourmet Bistro Terminal</h1>
            <p className="text-xs text-slate-400">Welcome, <span className="text-sky-400 font-semibold">{user?.name}</span> ({user?.role})</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-semibold rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Grid Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div
          onClick={() => navigate('/tables')}
          className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 p-6 rounded-2xl transition cursor-pointer group shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Tables & Floor Layout</h3>
          <p className="text-slate-400 text-sm">View interactive dining zone tables & live availability status</p>
        </div>

        <div
          onClick={() => navigate('/pos')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition cursor-pointer group shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Order Entry Terminal</h3>
          <p className="text-slate-400 text-sm">Add menu items, select modifiers & send order directly to kitchen</p>
        </div>

        <div
          onClick={() => navigate('/kds')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition cursor-pointer group shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Tv className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Kitchen Display System (KDS)</h3>
          <p className="text-slate-400 text-sm">Real-time live kitchen tickets stream via STOMP WebSocket</p>
        </div>

        <div
          onClick={() => navigate('/inventory')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition cursor-pointer group shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Stock & Ingredients</h3>
          <p className="text-slate-400 text-sm">Track BOM raw materials, low stock warnings & stock adjustments</p>
        </div>
      </div>
    </div>
  );
};
