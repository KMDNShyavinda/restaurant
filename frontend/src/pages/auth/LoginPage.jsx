import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Lock, Mail, ArrowRight, AlertCircle,
  User, Phone, Eye, EyeOff, UserPlus, LogIn, CheckCircle2,
  ChefHat, ShoppingCart, LayoutDashboard, MapPin,
  UtensilsCrossed, Sparkles, ShieldCheck, Boxes
} from 'lucide-react';

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('LOGIN');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('CASHIER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) navigate('/welcome');
  }, [isAuthenticated, user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/welcome');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (regPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register({ name: regName, email: regEmail, password: regPassword, phone: regPhone, roleName: regRole, branchId: 1 });
      setSuccessMessage('Account created! Redirecting...');
      setTimeout(() => navigate('/welcome'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const quickRoles = [
    { role: 'Admin',    email: 'admin@pos.com',   icon: LayoutDashboard, color: 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' },
    { role: 'Manager',  email: 'manager@pos.com', icon: ShieldCheck,     color: 'border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' },
    { role: 'Cashier',  email: 'cashier@pos.com', icon: ShoppingCart,    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' },
    { role: 'Waiter',   email: 'waiter@pos.com',  icon: MapPin,          color: 'border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20' },
    { role: 'Kitchen',  email: 'kitchen@pos.com', icon: ChefHat,         color: 'border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' },
    { role: 'Inventory',email: 'manager@pos.com', icon: Boxes,           color: 'border-purple-500/40 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' },
  ];

  const inputCls = "w-full bg-[#0d1117] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition text-sm";

  return (
    <div className="h-screen bg-[#07090c] flex font-sans selection:bg-amber-500 selection:text-black overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"
            alt="Maison Ceylon" className="w-full h-full object-cover brightness-50 contrast-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090c] via-[#07090c]/60 to-transparent" />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Brand */}
        <div className="relative z-10 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-xl border border-amber-400/30">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">Maison Ceylon</h1>
            <p className="text-[11px] text-slate-400">Fine Dining &amp; Enterprise POS</p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /><span>Colombo's Premier Gastronomy</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight">
            Your workspace,<br />
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">ready to serve.</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
            Manage tables, POS billing, kitchen tickets, inventory, and analytics — all from one premium terminal.
          </p>

          {/* Quick role keycards */}
          <div className="pt-2 space-y-2">
            <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Access — password: <span className="font-mono text-amber-400">password123</span></span>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickRoles.map(acc => {
                const Icon = acc.icon;
                return (
                  <button key={acc.role} type="button"
                    onClick={() => { setLoginEmail(acc.email); setLoginPassword('password123'); setActiveTab('LOGIN'); }}
                    className={`px-3 py-2 rounded-xl border text-left transition cursor-pointer flex items-center space-x-2 ${acc.color}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <div>
                      <div className="font-extrabold text-[10px]">{acc.role}</div>
                      <div className="text-[9px] text-slate-400 truncate">{acc.email}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-500">
          © {new Date().getFullYear()} Maison Ceylon. Enterprise Dining System.
        </div>
      </div>

      {/* ── RIGHT PANEL — fills full height, centered ── */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 sm:p-8 bg-[#0d1117] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white">Maison Ceylon</h1>
              <p className="text-[9px] text-slate-400">Fine Dining &amp; Enterprise POS</p>
            </div>
          </div>

          {/* ════ SINGLE CARD ════ */}
          <div className="bg-[#141b24]/95 border border-slate-700/70 rounded-2xl shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/6 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="px-5 pt-5 pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  activeTab === 'LOGIN'
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/30'
                    : 'bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-purple-500/30'
                }`}>
                  {activeTab === 'LOGIN' ? <LogIn className="w-4 h-4 text-white" /> : <UserPlus className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">
                    {activeTab === 'LOGIN' ? 'Sign In' : 'Create Account'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {activeTab === 'LOGIN' ? 'Access your staff portal' : 'Register a new team member'}
                  </div>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex bg-[#0d1117] rounded-xl p-1 border border-slate-800 gap-1">
                {[{ id: 'LOGIN', label: 'Sign In', icon: LogIn }, { id: 'REGISTER', label: 'Create Account', icon: UserPlus }].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} type="button"
                      onClick={() => { setActiveTab(tab.id); setError(null); }}
                      className={`flex-1 py-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md border border-amber-400/30'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}>
                      <Icon className="w-3 h-3" /><span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Body — both forms always mounted, one visible at a time via opacity */}
            <div className="px-5 py-4">

              {(error || successMessage) && (
                <div className={`mb-3 p-2.5 rounded-xl border flex items-center space-x-2 text-xs font-bold ${
                  error ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  {error ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  <span>{error || successMessage}</span>
                </div>
              )}

              {/* Forms wrapper — Register sets height, Login overlays */}
              <div className="relative">

                {/* REGISTER FORM — always in normal flow, permanently sets card height */}
                <form onSubmit={handleRegisterSubmit}
                  className={`space-y-2.5 transition-opacity duration-200 ${activeTab === 'REGISTER' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="text" required placeholder="e.g. Kasun Perera" value={regName}
                        onChange={e => setRegName(e.target.value)} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                        className={`${inputCls} pl-10 pr-4 py-2.5`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="email" required placeholder="kasun@restaurant.com" value={regEmail}
                        onChange={e => setRegEmail(e.target.value)} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                        className={`${inputCls} pl-10 pr-4 py-2.5`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="password" required placeholder="Min 6 chars" value={regPassword}
                          onChange={e => setRegPassword(e.target.value)} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                          className={`${inputCls} pl-9 pr-3 py-2.5`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</label>
                      <select value={regRole} onChange={e => setRegRole(e.target.value)}
                        tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                        className={`${inputCls} px-3 py-2.5 font-bold`}>
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Manager</option>
                        <option value="CASHIER">Cashier</option>
                        <option value="WAITER">Waitstaff</option>
                        <option value="KITCHEN_STAFF">Kitchen</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Phone <span className="text-slate-600 normal-case font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="tel" placeholder="+94 77 123 4567" value={regPhone}
                        onChange={e => setRegPhone(e.target.value)} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                        className={`${inputCls} pl-10 pr-4 py-2.5`} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                    className="w-full py-2.5 mt-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm border border-amber-400/30">
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                      : <><UserPlus className="w-4 h-4" /><span>Create Account</span></>}
                  </button>
                </form>

                {/* LOGIN FORM — always absolute overlay, never affects card height */}
                <form onSubmit={handleLoginSubmit}
                  className={`absolute inset-0 transition-opacity duration-200 ${activeTab === 'LOGIN' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                          placeholder="your@email.com" tabIndex={activeTab === 'LOGIN' ? 0 : -1}
                          className={`${inputCls} pl-10 pr-4 py-2.5`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type={showPassword ? 'text' : 'password'} required value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)} placeholder="Enter your password"
                          tabIndex={activeTab === 'LOGIN' ? 0 : -1}
                          className={`${inputCls} pl-10 pr-10 py-2.5`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition">
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={loading} tabIndex={activeTab === 'LOGIN' ? 0 : -1}
                      className="w-full py-2.5 mt-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm border border-amber-400/30">
                      {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                        : <><span>Sign In &amp; Launch Portal</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>
                </form>

              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 pb-4 border-t border-slate-800/80 pt-3">
              <button onClick={() => navigate('/order')}
                className="w-full py-2.5 px-4 bg-[#0d1117] hover:bg-slate-900 border border-slate-800 hover:border-amber-500/30 text-slate-400 hover:text-amber-400 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Browse menu as guest — no account needed</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
