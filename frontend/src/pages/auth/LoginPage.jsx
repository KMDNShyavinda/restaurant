import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Lock, Mail, ArrowRight, AlertCircle, User, Phone,
  Eye, EyeOff, UserPlus, LogIn, CheckCircle2,
  ChefHat, ShoppingCart, LayoutDashboard, MapPin,
  UtensilsCrossed, Sparkles, ShieldCheck, Boxes
} from 'lucide-react';

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('LOGIN');
  const [loginEmail, setLoginEmail]   = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName,  setRegName]    = useState('');
  const [regEmail, setRegEmail]   = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone]   = useState('');
  const [regRole,  setRegRole]    = useState('CASHIER');
  const [showPass, setShowPass]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState(null);
  const [success,  setSuccess]    = useState('');

  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) navigate('/welcome');
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); setError(null); setLoading(true);
    try { await login(loginEmail, loginPassword); navigate('/welcome'); }
    catch (err) { setError(err.response?.data?.message || 'Invalid email or password.'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError(null);
    if (regPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register({ name: regName, email: regEmail, password: regPassword, phone: regPhone, roleName: regRole, branchId: 1 });
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/welcome'), 1500);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const quickRoles = [
    { role: 'Admin',    email: 'admin@pos.com',   icon: LayoutDashboard, c: 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' },
    { role: 'Manager',  email: 'manager@pos.com', icon: ShieldCheck,     c: 'border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' },
    { role: 'Cashier',  email: 'cashier@pos.com', icon: ShoppingCart,    c: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' },
    { role: 'Waiter',   email: 'waiter@pos.com',  icon: MapPin,          c: 'border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20' },
    { role: 'Kitchen',  email: 'kitchen@pos.com', icon: ChefHat,         c: 'border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' },
    { role: 'Inventory',email: 'manager@pos.com', icon: Boxes,           c: 'border-purple-500/40 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' },
  ];

  const inp = "w-full bg-[#0b0f16] border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/25 transition text-sm";

  return (
    <div className="h-screen bg-[#07090c] flex font-sans overflow-hidden">

      {/* ═══ LEFT — Branding ═══ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400"
            alt="" className="w-full h-full object-cover brightness-[0.4]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090c] via-[#07090c]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090c]/20 to-transparent" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg border border-amber-400/30">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">Maison Ceylon</div>
            <div className="text-[10px] text-slate-400 font-medium">Fine Dining &amp; Enterprise POS</div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /><span>Colombo's Premier Gastronomy</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1]">
            Your workspace,<br />
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">ready to serve.</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Manage tables, billing, kitchen tickets, inventory &amp; analytics — from one terminal.
          </p>

          {/* Quick access */}
          <div className="pt-1 space-y-2">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center space-x-1.5">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Quick Access — password: <span className="font-mono text-amber-400/90">password123</span></span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {quickRoles.map(({ role, email, icon: Icon, c }) => (
                <button key={role} type="button"
                  onClick={() => { setLoginEmail(email); setLoginPassword('password123'); setActiveTab('LOGIN'); }}
                  className={`px-2.5 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2 hover:scale-[1.02] ${c}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <div>
                    <div className="font-extrabold text-[10px]">{role}</div>
                    <div className="text-[9px] text-slate-500 truncate">{email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-slate-600">
          © {new Date().getFullYear()} Maison Ceylon · Enterprise Dining System
        </div>
      </div>

      {/* ═══ RIGHT — Auth Card ═══ */}
      <div className="w-full lg:w-[48%] h-full flex items-center justify-center p-5 bg-[#0d1117] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-600/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center space-x-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-black text-white">Maison Ceylon</div>
          </div>

          {/* ─── THE CARD ─── */}
          <div className="bg-[#141b24] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Card header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-800">

              {/* Active tab icon + title */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                  activeTab === 'LOGIN'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/30'
                    : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-purple-500/30'
                }`}>
                  {activeTab === 'LOGIN'
                    ? <LogIn className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} />
                    : <UserPlus className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} />}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">
                    {activeTab === 'LOGIN' ? 'Welcome back' : 'Create Account'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {activeTab === 'LOGIN' ? 'Sign in to your staff portal' : 'Register a new team member'}
                  </div>
                </div>
              </div>

              {/* Segmented pill toggle */}
              <div className="flex bg-[#0b0f16] rounded-xl p-[3px] border border-slate-800 gap-[3px]">
                {[['LOGIN','Sign In', LogIn], ['REGISTER','Create Account', UserPlus]].map(([id, label, Icon]) => (
                  <button key={id} type="button"
                    onClick={() => { setActiveTab(id); setError(null); }}
                    className={`flex-1 py-2 rounded-[10px] text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      activeTab === id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 border border-amber-400/20'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    <Icon style={{width:'12px',height:'12px'}} /><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alert */}
            {(error || success) && (
              <div className={`mx-6 mt-4 p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                error ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
              }`}>
                {error ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                <span>{error || success}</span>
              </div>
            )}

            {/* ─── FORMS CONTAINER: fixed height so both tabs identical ─── */}
            <div className="relative overflow-hidden" style={{ height: '292px' }}>

              {/* SIGN IN — absolute, always same size */}
              <div className={`absolute inset-0 px-6 py-4 transition-all duration-300 ${
                activeTab === 'LOGIN' ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none -translate-x-4'
              }`}>
                <form onSubmit={handleLogin} className="flex flex-col h-full gap-3">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                          placeholder="your@email.com" className={`${inp} pl-10 pr-4 py-3`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type={showPass ? 'text' : 'password'} required value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)} placeholder="Enter your password"
                          className={`${inp} pl-10 pr-10 py-3`} />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition cursor-pointer">
                          {showPass ? <EyeOff style={{width:'14px',height:'14px'}} /> : <Eye style={{width:'14px',height:'14px'}} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm border border-amber-400/25">
                    {loading ? <div className="animate-spin w-4 h-4 border-t-2 border-b-2 border-white rounded-full" />
                      : <><span>Sign In &amp; Launch Portal</span><ArrowRight style={{width:'15px',height:'15px'}} /></>}
                  </button>
                </form>
              </div>

              {/* CREATE ACCOUNT — absolute, always same size */}
              <div className={`absolute inset-0 px-6 py-4 transition-all duration-300 ${
                activeTab === 'REGISTER' ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none translate-x-4'
              }`}>
                <form onSubmit={handleRegister} className="flex flex-col h-full gap-3">
                  <div className="flex-1 space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" required placeholder="e.g. Kasun Perera" value={regName}
                          onChange={e => setRegName(e.target.value)} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                          className={`${inp} pl-10 pr-4 py-2.5`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="email" required placeholder="kasun@restaurant.com" value={regEmail}
                          onChange={e => setRegEmail(e.target.value)} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                          className={`${inp} pl-10 pr-4 py-2.5`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="password" required placeholder="Min 6 chars" value={regPassword}
                            onChange={e => setRegPassword(e.target.value)} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                            className={`${inp} pl-9 pr-3 py-2.5`} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</label>
                        <select value={regRole} onChange={e => setRegRole(e.target.value)}
                          tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                          className={`${inp} px-3 py-2.5 font-bold`}>
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
                          className={`${inp} pl-10 pr-4 py-2.5`} />
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} tabIndex={activeTab === 'REGISTER' ? 0 : -1}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm border border-amber-400/25">
                    {loading ? <div className="animate-spin w-4 h-4 border-t-2 border-b-2 border-white rounded-full" />
                      : <><UserPlus style={{width:'15px',height:'15px'}} /><span>Create Account</span></>}
                  </button>
                </form>
              </div>

            </div>{/* end fixed-height forms container */}

            {/* Card footer */}
            <div className="px-6 pb-5 pt-3 border-t border-slate-800">
              <button onClick={() => navigate('/order')}
                className="w-full py-2.5 bg-[#0b0f16] hover:bg-slate-900 border border-slate-800 hover:border-amber-500/30 text-slate-400 hover:text-amber-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer">
                <UtensilsCrossed style={{width:'13px',height:'13px'}} />
                <span>Browse menu as guest — no account needed</span>
              </button>
            </div>

          </div>{/* end card */}
        </div>
      </div>
    </div>
  );
};
