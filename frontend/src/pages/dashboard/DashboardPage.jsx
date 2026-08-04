import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, LayoutGrid, ShoppingCart, Tv, Package, ShieldCheck, 
  Utensils, Lock, Sparkles, Clock, CheckCircle2, AlertTriangle, 
  TrendingUp, Users, ArrowRight, Compass, ChefHat, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'GUEST';

  // Role Access Checker
  const canAccess = (allowedRoles) => {
    if (!user) return false;
    if (role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER') return true;
    return allowedRoles.includes(role);
  };

  const roleBadges = {
    OWNER: { label: '👑 System Owner', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    ADMIN: { label: '👑 Super Admin', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    MANAGER: { label: '📊 Branch Manager', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
    CASHIER: { label: '💳 Billing Cashier', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    WAITER: { label: '🍷 Service Waitstaff', color: 'bg-sky-500/20 text-sky-400 border-sky-500/40' },
    KITCHEN: { label: '👨‍🍳 Head Chef', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
  };

  const currentRoleBadge = roleBadges[role] || { label: role, color: 'bg-slate-800 text-slate-300 border-slate-700' };

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 p-4 md:p-6 font-sans selection:bg-amber-500 selection:text-black relative overflow-hidden">
      {/* Ambient Gold & Amber Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#11161d]/90 border border-amber-500/30 backdrop-blur-2xl p-4 px-6 rounded-3xl mb-6 shadow-2xl z-10 relative">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 border border-amber-400/30 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-amber-500/20 tracking-wider">
            MC
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Maison Ceylon</span>
              </h1>
              <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${currentRoleBadge.color}`}>
                {currentRoleBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome back, <strong className="text-amber-300 font-bold">{user?.name || 'Staff User'}</strong> ({user?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => navigate('/welcome')}
            className="px-4 py-2 bg-[#07090c] hover:bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-extrabold rounded-2xl transition cursor-pointer flex items-center space-x-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Portal Launchpad</span>
          </button>

          <div className="bg-[#07090c] px-4 py-2 rounded-2xl border border-slate-800 text-xs font-mono font-bold text-slate-300">
            {time}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-2xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Restaurant Overview Hero Banner */}
        <div className="bg-[#11161d]/90 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-extrabold text-amber-400 tracking-wider uppercase flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Fine Dining Executive Operations</span>
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Maison Ceylon Operations Dashboard
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Crafting authentic culinary excellence & fine dining experiences. Use your role-tailored workstation panel below to manage tables, POS orders, kitchen preparation, or stock levels.
              </p>
            </div>

            {/* Live Metrics Overview Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
              <div className="bg-[#07090c] border border-amber-500/20 p-3.5 rounded-2xl text-center shadow-lg">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase">Gourmet Dishes</div>
                <div className="text-xl font-black text-amber-400">80 <span className="text-[10px] text-slate-500">Items</span></div>
              </div>
              <div className="bg-[#07090c] border border-amber-500/20 p-3.5 rounded-2xl text-center shadow-lg">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase">Dining Tables</div>
                <div className="text-xl font-black text-orange-400">8 <span className="text-[10px] text-slate-500">Tables</span></div>
              </div>
              <div className="bg-[#07090c] border border-amber-500/20 p-3.5 rounded-2xl text-center shadow-lg">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase">Live KDS</div>
                <div className="text-xl font-black text-emerald-400">STOMP <span className="text-[10px] text-slate-500">Sync</span></div>
              </div>
              <div className="bg-[#07090c] border border-amber-500/20 p-3.5 rounded-2xl text-center shadow-lg">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase">Inventory</div>
                <div className="text-xl font-black text-sky-400">Auto <span className="text-[10px] text-slate-500">Tracking</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Workstations Grid Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Role Workstations & Operational Modules</span>
            </h3>
            <p className="text-xs text-slate-400">Modules configured specifically for your logged-in role ({role})</p>
          </div>
        </div>

        {/* Workstation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Tables & Floor Layout */}
          {(() => {
            const allowed = canAccess(['OWNER', 'ADMIN', 'MANAGER', 'WAITER']);
            return (
              <div
                onClick={() => allowed && navigate('/tables')}
                className={`bg-[#11161d] border rounded-3xl p-6 transition duration-300 relative flex flex-col justify-between ${
                  allowed 
                    ? 'border-slate-800 hover:border-amber-500/60 cursor-pointer shadow-xl hover:-translate-y-1 group' 
                    : 'border-slate-800/40 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition border ${
                      allowed 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:scale-110' 
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}>
                      <LayoutGrid className="w-6 h-6" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      allowed 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {allowed ? 'Access Granted' : 'Role Restricted'}
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-white mb-1 group-hover:text-amber-400 transition">
                    Tables & Floor Layout
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    View interactive dining floor zones (Main Floor, Patio, VIP), table availability & reservations.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-bold">Roles: Waiter, Manager, Owner</span>
                  {allowed ? (
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </div>
            );
          })()}

          {/* Card 2: Order Entry Terminal (POS) */}
          {(() => {
            const allowed = canAccess(['OWNER', 'ADMIN', 'MANAGER', 'CASHIER', 'WAITER']);
            return (
              <div
                onClick={() => allowed && navigate('/pos')}
                className={`bg-[#11161d] border rounded-3xl p-6 transition duration-300 relative flex flex-col justify-between ${
                  allowed 
                    ? 'border-slate-800 hover:border-amber-500/60 cursor-pointer shadow-xl hover:-translate-y-1 group' 
                    : 'border-slate-800/40 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition border ${
                      allowed 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:scale-110' 
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}>
                      <ShoppingCart className="w-6 h-6" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      allowed 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {allowed ? 'Access Granted' : 'Role Restricted'}
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-white mb-1 group-hover:text-amber-400 transition">
                    Order Entry Terminal (POS)
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Take orders, customize dish portions (S/M/L), add special requests & dispatch live to kitchen.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-bold">Roles: Cashier, Waiter, Manager</span>
                  {allowed ? (
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </div>
            );
          })()}

          {/* Card 3: Kitchen Display System (KDS) */}
          {(() => {
            const allowed = canAccess(['OWNER', 'ADMIN', 'MANAGER', 'KITCHEN']);
            return (
              <div
                onClick={() => allowed && navigate('/kds')}
                className={`bg-[#11161d] border rounded-3xl p-6 transition duration-300 relative flex flex-col justify-between ${
                  allowed 
                    ? 'border-slate-800 hover:border-amber-500/60 cursor-pointer shadow-xl hover:-translate-y-1 group' 
                    : 'border-slate-800/40 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition border ${
                      allowed 
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:scale-110' 
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}>
                      <Tv className="w-6 h-6" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      allowed 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {allowed ? 'Access Granted' : 'Role Restricted'}
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-white mb-1 group-hover:text-orange-400 transition">
                    Kitchen Display System (KDS)
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Live real-time order tickets push stream via STOMP WebSocket for kitchen prep workflow.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-bold">Roles: Kitchen Chef, Manager</span>
                  {allowed ? (
                    <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </div>
            );
          })()}

          {/* Card 4: Stock & Ingredients */}
          {(() => {
            const allowed = canAccess(['OWNER', 'ADMIN', 'MANAGER', 'KITCHEN']);
            return (
              <div
                onClick={() => allowed && navigate('/inventory')}
                className={`bg-[#11161d] border rounded-3xl p-6 transition duration-300 relative flex flex-col justify-between ${
                  allowed 
                    ? 'border-slate-800 hover:border-amber-500/60 cursor-pointer shadow-xl hover:-translate-y-1 group' 
                    : 'border-slate-800/40 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition border ${
                      allowed 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:scale-110' 
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}>
                      <Package className="w-6 h-6" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      allowed 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {allowed ? 'Access Granted' : 'Role Restricted'}
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-white mb-1 group-hover:text-amber-400 transition">
                    Stock & Ingredients
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Track raw materials, BOM recipe ingredients, low stock threshold warnings & stock adjustments.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-bold">Roles: Kitchen, Manager, Owner</span>
                  {allowed ? (
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </div>
            );
          })()}

          {/* Card 5: Customer QR Order Portal */}
          <div
            onClick={() => window.open('/order', '_blank')}
            className="bg-[#11161d] border border-slate-800 hover:border-amber-500/60 p-6 rounded-3xl transition cursor-pointer group shadow-xl hover:-translate-y-1 duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition border border-amber-500/30 shadow-lg shadow-amber-500/20">
                  <Utensils className="w-6 h-6" />
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                  Public Ordering
                </span>
              </div>

              <h4 className="text-lg font-extrabold text-white mb-1 group-hover:text-amber-400 transition flex items-center space-x-2">
                <span>Customer Order Portal</span>
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Public self-ordering portal for customers to scan table QR code & send live orders to kitchen.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-bold">Open in New Window</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 6: Maison Ceylon Public Website */}
          <div
            onClick={() => window.open('/', '_blank')}
            className="bg-[#11161d] border border-slate-800 hover:border-amber-500/60 p-6 rounded-3xl transition cursor-pointer group shadow-xl hover:-translate-y-1 duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center group-hover:scale-110 transition border border-amber-500/30 shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                  Public Website
                </span>
              </div>

              <h4 className="text-lg font-extrabold text-white mb-1 group-hover:text-amber-400 transition flex items-center space-x-2">
                <span>Main Restaurant Website</span>
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Public fine dining landing page featuring culinary story, signature dishes & table reservation bookings.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-bold">Open Landing Page</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
