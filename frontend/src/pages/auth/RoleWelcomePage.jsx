import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UtensilsCrossed, Crown, LayoutDashboard, ShoppingCart, 
  ChefHat, Boxes, LogOut, ArrowRight, Sparkles, ShieldCheck, 
  MapPin, CheckCircle2, User, Clock, Flame, ShoppingBag, CreditCard,
  TrendingUp, Award, Layers
} from 'lucide-react';

export const RoleWelcomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role?.toUpperCase() || 'CASHIER';
  const userName = user?.name || 'Team Member';

  // Customized Role Portal Configurations with Specific Hero Images & Visual Layouts
  const roleConfig = {
    ADMIN: {
      title: 'System Owner Executive Control',
      subtitle: 'Full Administrative Authority & Multi-Branch Control',
      roleBadge: '👑 System Owner & Super Admin',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      heroGradient: 'from-amber-400 via-orange-400 to-amber-500',
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      welcomeMsg: 'Welcome to the Executive Command Hub. Oversee revenue analytics, manage user roles, dining layout, inventory stock thresholds, and live KDS streams.',
      primaryRoute: '/dashboard',
      primaryBtnText: 'Enter Executive Command Center',
      primaryIcon: LayoutDashboard,
      metrics: [
        { label: 'System Status', val: '100% Online', color: 'text-amber-400' },
        { label: 'Role Authority', val: 'Super Admin', color: 'text-orange-400' },
        { label: 'Store Control', val: 'All Modules', color: 'text-emerald-400' }
      ],
      shortcuts: [
        { label: 'Executive Analytics', route: '/dashboard', icon: LayoutDashboard, desc: 'Sales, revenue & system metrics' },
        { label: 'POS Billing Terminal', route: '/pos', icon: ShoppingCart, desc: 'Process cashier orders & billing' },
        { label: 'Floor Plan & Tables', route: '/tables', icon: MapPin, desc: 'Manage dining floor & reservations' },
        { label: 'Kitchen Display (KDS)', route: '/kds', icon: ChefHat, desc: 'Live ticket dispatch stream' },
        { label: 'Inventory & Stock', route: '/inventory', icon: Boxes, desc: 'Stock ingredients & audit logs' }
      ]
    },
    MANAGER: {
      title: 'Branch Management & Operations',
      subtitle: 'Bistro Operations, Sales Reports & Inventory Supervision',
      roleBadge: '📊 Branch Operations Manager',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      heroGradient: 'from-orange-400 via-amber-400 to-amber-500',
      heroImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
      welcomeMsg: 'Welcome to Branch Operations. Monitor daily sales metrics, table occupancy rates, ingredient stock levels, and staff shift performance.',
      primaryRoute: '/dashboard',
      primaryBtnText: 'Launch Manager Dashboard',
      primaryIcon: LayoutDashboard,
      metrics: [
        { label: 'Daily Sales Status', val: 'Active Track', color: 'text-orange-400' },
        { label: 'Stock Warnings', val: 'Auto Audit', color: 'text-amber-400' },
        { label: 'Table Utilization', val: 'Live Sync', color: 'text-emerald-400' }
      ],
      shortcuts: [
        { label: 'Manager Dashboard', route: '/dashboard', icon: LayoutDashboard, desc: 'Daily sales & active metrics' },
        { label: 'Inventory Control', route: '/inventory', icon: Boxes, desc: 'Ingredient stock warnings & logs' },
        { label: 'Floor Plan & Tables', route: '/tables', icon: MapPin, desc: 'Dining floor plan & reservations' }
      ]
    },
    CASHIER: {
      title: 'Express Billing & POS Terminal',
      subtitle: 'Checkout Session, Fast Payment Processing & Invoices',
      roleBadge: '💳 Billing Cashier Station',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      heroGradient: 'from-emerald-400 via-teal-400 to-emerald-500',
      heroImage: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200',
      welcomeMsg: 'Your POS Terminal session is active. Ready to process fast customer orders, accept Cash/Card/QR payments, apply discounts, and generate split bills.',
      primaryRoute: '/pos',
      primaryBtnText: 'Open Express POS Terminal',
      primaryIcon: ShoppingCart,
      metrics: [
        { label: 'Terminal Mode', val: 'Express Checkout', color: 'text-emerald-400' },
        { label: 'Payment Gateway', val: 'Cash / Card / QR', color: 'text-amber-400' },
        { label: 'Session ID', val: '#CSH-2026', color: 'text-teal-400' }
      ],
      shortcuts: [
        { label: 'POS Billing Terminal', route: '/pos', icon: ShoppingCart, desc: 'Dine-in, takeaway & bill checkout' },
        { label: 'Table Occupancy', route: '/tables', icon: MapPin, desc: 'View active dining tables & bills' }
      ]
    },
    WAITER: {
      title: 'Dining Floor & Table Service Portal',
      subtitle: 'Table Assignments, Order Taking & Guest Reservations',
      roleBadge: '🍷 Dining Floor Waitstaff',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      heroGradient: 'from-sky-400 via-indigo-400 to-blue-500',
      heroImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1200',
      welcomeMsg: 'Welcome to Floor Service. Manage table assignments across Main Floor, Patio, and VIP zones, take mobile orders, and track guest requests.',
      primaryRoute: '/waiter',
      primaryBtnText: 'Open Order Management',
      primaryIcon: CheckCircle2,
      metrics: [
        { label: 'Dining Zones', val: '3 Floor Zones', color: 'text-sky-400' },
        { label: 'Table Layout', val: '8 Active Tables', color: 'text-amber-400' },
        { label: 'Order Dispatch', val: 'Direct to Kitchen', color: 'text-emerald-400' }
      ],
      shortcuts: [
        { label: 'Order Management', route: '/waiter', icon: CheckCircle2, desc: 'Manage and serve ready orders' },
        { label: 'Interactive Floor Plan', route: '/tables', icon: MapPin, desc: 'Visual floor plan & reservation status' },
        { label: 'Take New Order', route: '/pos', icon: ShoppingCart, desc: 'Send order directly to kitchen' }
      ]
    },
    KITCHEN: {
      title: 'Executive Kitchen & KDS Dispatch',
      subtitle: 'Real-Time Culinary Tickets, Order Pipeline & Prep Timers',
      roleBadge: '👨‍🍳 Head Chef & Kitchen Crew',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      heroGradient: 'from-rose-400 via-pink-400 to-rose-500',
      heroImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200',
      welcomeMsg: 'Welcome to the Kitchen Display Station. Live WebSocket order ticket stream active. Track ticket prep stages from Pending to Ready for Service.',
      primaryRoute: '/kds',
      primaryBtnText: 'Launch Live Kitchen Display (KDS)',
      primaryIcon: ChefHat,
      metrics: [
        { label: 'Stream Protocol', val: 'WebSocket STOMP', color: 'text-rose-400' },
        { label: 'Prep Speed Goal', val: '<15 Mins Target', color: 'text-amber-400' },
        { label: 'Station Mode', val: 'Live Ticket Queue', color: 'text-emerald-400' }
      ],
      shortcuts: [
        { label: 'KDS Live Stream', route: '/kds', icon: ChefHat, desc: 'Real-time WebSocket ticket updates' },
        { label: 'Raw Ingredients Check', route: '/inventory', icon: Boxes, desc: 'Check ingredient availability' }
      ]
    },
    CUSTOMER: {
      title: 'Maison Ceylon Fine Dining Guest Portal',
      subtitle: 'Authentic Ceylon Gastronomy, Self-Ordering & Live Tracking',
      roleBadge: '🛍️ Valued Guest',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      heroGradient: 'from-purple-400 via-indigo-400 to-purple-500',
      heroImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      welcomeMsg: 'Welcome to Maison Ceylon. Browse gourmet dishes with dietary filters (Vegan, Gluten-Free, Halal, Spicy), order from your table, and track live cooking status.',
      primaryRoute: '/order',
      primaryBtnText: 'Explore Menu & Self-Order',
      primaryIcon: ShoppingBag,
      metrics: [
        { label: 'Menu Catalog', val: '80+ Dishes', color: 'text-purple-400' },
        { label: 'Dietary Filters', val: 'Vegan / GF / Halal', color: 'text-amber-400' },
        { label: 'Order Tracking', val: 'Real-Time Status', color: 'text-emerald-400' }
      ],
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

  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning,', icon: '🌅' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon,', icon: '☀️' };
    } else if (hour >= 17 && hour < 22) {
      return { text: 'Good Evening,', icon: '🌙' };
    } else {
      return { text: 'Late Hours Welcome,', icon: '🌌' };
    }
  };

  const greeting = getDynamicGreeting();

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 font-sans p-4 md:p-8 flex flex-col justify-between selection:bg-amber-500 selection:text-black relative overflow-hidden">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Glassmorphic Navigation Bar */}
      <nav className="max-w-6xl w-full mx-auto flex justify-between items-center bg-[#11161d]/90 border border-amber-500/30 p-4 rounded-3xl backdrop-blur-2xl shadow-2xl z-10">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-amber-500/25 border border-amber-400/30">
            MC
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center space-x-1.5">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Maison Ceylon</span>
            </h1>
            <p className="text-xs text-slate-400">Authenticated Role Launchpad</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3.5 py-1.5 rounded-2xl border text-xs font-extrabold ${currentConfig.badgeColor}`}>
            {currentConfig.roleBadge}
          </span>
          <button
            onClick={logout}
            className="p-2.5 bg-[#07090c] hover:bg-rose-500/20 hover:text-rose-400 border border-slate-800 rounded-2xl text-slate-400 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Role-Tailored Visual Hero Card */}
      <main className="max-w-6xl w-full mx-auto my-8 space-y-8 z-10">
        <div className="bg-[#11161d]/95 border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl relative backdrop-blur-2xl flex flex-col" style={{minHeight: '420px'}}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1" style={{minHeight: '420px'}}>
            
            {/* Left Hero Text Section */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>{currentConfig.subtitle}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  <span className="text-white">{greeting.text}</span><br />
                  <span className={`bg-gradient-to-r ${currentConfig.heroGradient} bg-clip-text text-transparent`}>
                    {userName}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {currentConfig.welcomeMsg}
                </p>

                {/* Role Specific Quick Metrics Badges */}
                <div className="pt-2 grid grid-cols-3 gap-3">
                  {currentConfig.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 bg-[#07090c] border border-amber-500/20 rounded-2xl text-center">
                      <div className="text-[10px] text-slate-400 font-extrabold uppercase truncate">{m.label}</div>
                      <div className={`text-xs sm:text-sm font-black ${m.color} truncate`}>{m.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => navigate(currentConfig.primaryRoute)}
                  className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${currentConfig.heroGradient} hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-2xl shadow-amber-500/25 flex items-center justify-center space-x-3 transition transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-widest border border-amber-400/30`}
                >
                  <PrimaryIconComponent className="w-5 h-5" />
                  <span>{currentConfig.primaryBtnText}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Role-Tailored Visual Imagery - always fills full card height */}
            <div className="lg:col-span-5 relative overflow-hidden bg-slate-900" style={{minHeight: '420px'}}>
              <img 
                src={currentConfig.heroImage} 
                alt={currentConfig.title} 
                className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-110"
                style={{objectPosition: 'center center'}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11161d] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#11161d] lg:via-transparent lg:to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#07090c]/80 backdrop-blur-md border border-amber-500/30 text-xs">
                <div className="font-extrabold text-amber-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentConfig.title}</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">Role Station Ready • Maison Ceylon Fine Dining System</div>
              </div>
            </div>

          </div>
        </div>

        {/* Role Quick Module Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Available Role Workstations ({currentConfig.shortcuts.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentConfig.shortcuts.map((sc, idx) => {
              const IconComp = sc.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(sc.route)}
                  className="bg-[#11161d] border border-slate-800 p-5 rounded-3xl shadow-xl hover:border-amber-500/50 transition transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group space-y-4 backdrop-blur-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-white transition duration-300 border border-amber-500/20">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm group-hover:text-amber-400 transition">{sc.label}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{sc.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-3 border-t border-slate-800">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:text-amber-400 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 pt-4 z-10">
        Maison Ceylon Enterprise POS & Management System • Authenticated Account: <span className="text-amber-300 font-bold">{user?.email}</span>
      </footer>
    </div>
  );
};
