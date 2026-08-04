import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UtensilsCrossed, Crown, LayoutDashboard, ShoppingCart, 
  ChefHat, Boxes, LogOut, ArrowRight, Sparkles, ShieldCheck, 
  MapPin, CheckCircle2, User, Clock, Flame, ShoppingBag
} from 'lucide-react';

export const RoleWelcomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role?.toUpperCase() || 'CASHIER';
  const userName = user?.name || 'Team Member';

  // Role Configuration Mapping
  const roleConfig = {
    ADMIN: {
      title: 'Super Admin Control Center',
      roleBadge: '👑 System Owner & Super Admin',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      heroGradient: 'from-orange-500 via-amber-500 to-amber-600',
      welcomeMsg: 'Full administrative access to manage overall system operations, finances, tables, inventory, and staff terminals.',
      primaryRoute: '/dashboard',
      primaryBtnText: 'Enter Executive Dashboard',
      primaryIcon: LayoutDashboard,
      shortcuts: [
        { label: 'Overview Analytics', route: '/dashboard', icon: LayoutDashboard, desc: 'Sales, revenue & system metrics' },
        { label: 'POS Terminal', route: '/pos', icon: ShoppingCart, desc: 'Process cashier orders & billing' },
        { label: 'Floor & Table Layout', route: '/tables', icon: MapPin, desc: 'Manage dining floor & reservations' },
        { label: 'Kitchen Display (KDS)', route: '/kds', icon: ChefHat, desc: 'Live ticket dispatch stream' },
        { label: 'Inventory Control', route: '/inventory', icon: Boxes, desc: 'Stock ingredients & audit logs' }
      ]
    },
    MANAGER: {
      title: 'Branch Operations Portal',
      roleBadge: '📊 Branch Manager',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      heroGradient: 'from-amber-500 via-orange-500 to-amber-600',
      welcomeMsg: 'Monitor daily branch metrics, stock levels, table occupancy, and review staff performance.',
      primaryRoute: '/dashboard',
      primaryBtnText: 'Launch Manager Dashboard',
      primaryIcon: LayoutDashboard,
      shortcuts: [
        { label: 'Manager Overview', route: '/dashboard', icon: LayoutDashboard, desc: 'Daily revenue & active metrics' },
        { label: 'Inventory Control', route: '/inventory', icon: Boxes, desc: 'Ingredient stock warnings & logs' },
        { label: 'Table Layout', route: '/tables', icon: MapPin, desc: 'Dining floor plan & reservations' }
      ]
    },
    CASHIER: {
      title: 'Billing & POS Session Portal',
      roleBadge: '💳 Billing Cashier',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      heroGradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      welcomeMsg: 'Your checkout session is ready. Process fast customer payments, split bills, and print invoices.',
      primaryRoute: '/pos',
      primaryBtnText: 'Open Express POS Terminal',
      primaryIcon: ShoppingCart,
      shortcuts: [
        { label: 'POS Terminal', route: '/pos', icon: ShoppingCart, desc: 'Dine-in, takeaway & bill checkout' },
        { label: 'Table Status', route: '/tables', icon: MapPin, desc: 'View table occupancy & orders' }
      ]
    },
    WAITER: {
      title: 'Dining Floor & Order Portal',
      roleBadge: '🍷 Dining Floor Waitstaff',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      heroGradient: 'from-sky-500 via-indigo-500 to-blue-600',
      welcomeMsg: 'Manage guest table assignments, take mobile orders, and update reservation status.',
      primaryRoute: '/tables',
      primaryBtnText: 'Open Interactive Floor Plan',
      primaryIcon: MapPin,
      shortcuts: [
        { label: 'Table Layout', route: '/tables', icon: MapPin, desc: 'Visual floor plan & booking status' },
        { label: 'Take New Order', route: '/pos', icon: ShoppingCart, desc: 'Send order directly to kitchen' }
      ]
    },
    KITCHEN: {
      title: 'Live Kitchen Display Station',
      roleBadge: '👨‍🍳 Head Chef & Kitchen Staff',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      heroGradient: 'from-rose-500 via-pink-500 to-rose-600',
      welcomeMsg: 'Live order ticket stream station. Update ticket stages from prep to ready for service.',
      primaryRoute: '/kds',
      primaryBtnText: 'Launch Live Kitchen Display (KDS)',
      primaryIcon: ChefHat,
      shortcuts: [
        { label: 'KDS Live Tickets', route: '/kds', icon: ChefHat, desc: 'Real-time WebSocket ticket updates' },
        { label: 'Stock Ingredients', route: '/inventory', icon: Boxes, desc: 'Check raw ingredient availability' }
      ]
    },
    CUSTOMER: {
      title: 'Maison Ceylon Guest Welcome',
      roleBadge: '🛍️ Valued Guest',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      heroGradient: 'from-purple-500 via-indigo-500 to-purple-600',
      welcomeMsg: 'Welcome to Ceylon fine dining. Order delicious gourmet dishes directly from your table or phone.',
      primaryRoute: '/order',
      primaryBtnText: 'Explore Menu & Self-Order',
      primaryIcon: ShoppingBag,
      shortcuts: [
        { label: 'Online Self-Ordering', route: '/order', icon: ShoppingBag, desc: 'Browse dishes & send to kitchen' },
        { label: 'Live Order Tracker', route: '/track', icon: Clock, desc: 'Track your order progress live' }
      ]
    }
  };

  // Fallback for OWNER or KITCHEN_STAFF aliases
  let currentConfig = roleConfig[userRole];
  if (!currentConfig) {
    if (userRole.includes('OWNER')) currentConfig = roleConfig.ADMIN;
    else if (userRole.includes('KITCHEN')) currentConfig = roleConfig.KITCHEN;
    else currentConfig = roleConfig.CASHIER;
  }

  const PrimaryIconComponent = currentConfig.primaryIcon;

  return (
    <div className="min-h-screen bg-[#0d1217] text-slate-100 font-sans p-4 md:p-8 flex flex-col justify-between selection:bg-orange-500 selection:text-white relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="max-w-5xl w-full mx-auto flex justify-between items-center bg-[#141a22]/90 border border-slate-800/80 p-4 rounded-3xl backdrop-blur-xl shadow-2xl z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-orange-500/25 border border-orange-400/30">
            MC
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight">Maison Ceylon</h1>
            <p className="text-xs text-slate-400">Authenticated Portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3.5 py-1.5 rounded-2xl border text-xs font-extrabold ${currentConfig.badgeColor}`}>
            {currentConfig.roleBadge}
          </span>
          <button
            onClick={logout}
            className="p-2.5 bg-[#0d1217] hover:bg-rose-500/20 hover:text-rose-400 border border-slate-800 rounded-2xl text-slate-400 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Center Welcome Hero Card */}
      <main className="max-w-4xl w-full mx-auto my-8 space-y-8 z-10">
        <div className="bg-[#141a22]/95 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Session Authenticated</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Welcome Back, <span className={`bg-gradient-to-r ${currentConfig.heroGradient} bg-clip-text text-transparent`}>{userName}</span>!
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {currentConfig.welcomeMsg}
            </p>
          </div>

          {/* Primary Action Launchpad Button */}
          <div className="pt-2">
            <button
              onClick={() => navigate(currentConfig.primaryRoute)}
              className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${currentConfig.heroGradient} hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-2xl shadow-orange-500/25 flex items-center justify-center space-x-3 transition transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider`}
            >
              <PrimaryIconComponent className="w-5 h-5" />
              <span>{currentConfig.primaryBtnText}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Quick Module Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
            Available Role Modules ({currentConfig.shortcuts.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentConfig.shortcuts.map((sc, idx) => {
              const IconComp = sc.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(sc.route)}
                  className="bg-[#141a22] border border-slate-800/80 p-5 rounded-3xl shadow-xl hover:border-orange-500/50 transition transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold group-hover:bg-gradient-to-tr group-hover:from-orange-500 group-hover:to-amber-600 group-hover:text-white transition duration-300">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm group-hover:text-orange-400 transition">{sc.label}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{sc.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-xs text-slate-500 pt-4 z-10">
        Maison Ceylon Enterprise POS & Management System • Authenticated User: <span className="text-slate-300 font-bold">{user?.email}</span>
      </footer>
    </div>
  );
};
