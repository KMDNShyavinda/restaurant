import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UtensilsCrossed, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, 
  User, Phone, Eye, EyeOff, UserPlus, LogIn, CheckCircle2, Sparkles,
  Crown, ChefHat, ShoppingCart, LayoutDashboard, Utensils
} from 'lucide-react';

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('LOGIN'); // 'LOGIN' or 'REGISTER'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('admin@pos.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('CASHIER');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/welcome');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      navigate('/welcome');
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        roleName: regRole,
        branchId: 1
      });
      setSuccessMessage('Account created successfully! Redirecting to welcome portal...');
      setTimeout(() => {
        navigate('/welcome');
      }, 1500);
    } catch (err) {
      console.error("Registration failed", err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail) => {
    setLoginEmail(roleEmail);
    setLoginPassword('password123');
    setActiveTab('LOGIN');
  };

  return (
    <div className="min-h-screen bg-[#07090c] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      
      {/* High-Resolution Luxury Restaurant Ambiance Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600" 
          alt="Maison Ceylon Fine Dining Ambiance"
          className="w-full h-full object-cover opacity-25 filter brightness-50 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090c] via-[#07090c]/80 to-[#07090c]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      </div>

      {/* Decorative Gold & Amber Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Auth Card */}
      <div className="w-full max-w-lg bg-[#11161d]/85 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.15)] relative z-10 space-y-6">
        
        {/* Header Luxury Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 shadow-xl shadow-amber-500/30 border border-amber-300/40 transform hover:rotate-6 transition duration-300">
            <UtensilsCrossed className="w-8 h-8 text-white drop-shadow" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Fine Dining Gastronomy & POS</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Maison Ceylon
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-medium">Enterprise Management & Terminal Portal</p>
          </div>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex bg-[#0a0d12]/90 p-1.5 rounded-2xl border border-slate-800/90 text-xs font-extrabold shadow-inner">
          <button
            type="button"
            onClick={() => { setActiveTab('LOGIN'); setError(null); }}
            className={`flex-1 py-3 rounded-xl transition duration-300 cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'LOGIN' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 border border-amber-400/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Terminal</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('REGISTER'); setError(null); }}
            className={`flex-1 py-3 rounded-xl transition duration-300 cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'REGISTER' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 border border-amber-400/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-400 text-xs font-bold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400/90 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@pos.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0d12]/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400/90 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-10 py-3 bg-[#0a0d12]/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition transform active:scale-[0.98] disabled:opacity-50 cursor-pointer text-xs uppercase tracking-widest border border-amber-400/30"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Sign In & Launch Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400/90 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Perera"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0a0d12]/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400/90 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="kasun@pos.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0a0d12]/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400/90 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0a0d12]/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400/90 mb-1">
                  Role Type
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0a0d12]/90 border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-amber-500 text-xs font-bold"
                >
                  <option value="ADMIN">System Admin</option>
                  <option value="MANAGER">Branch Manager</option>
                  <option value="CASHIER">Billing Cashier</option>
                  <option value="WAITER">Waitstaff</option>
                  <option value="KITCHEN_STAFF">Kitchen Staff</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400/90 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0a0d12]/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition transform active:scale-[0.98] disabled:opacity-50 cursor-pointer text-xs uppercase tracking-wider mt-2 border border-amber-400/30"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Register</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Luxury Role Quick Login Keycards Grid */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-extrabold uppercase tracking-wider">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>One-Click Role Access Keys:</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Password: password123</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { role: 'Super Admin', email: 'admin@pos.com', color: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
              { role: 'Manager', email: 'manager@pos.com', color: 'text-orange-400 border-orange-500/30 bg-orange-500/5' },
              { role: 'Cashier', email: 'cashier@pos.com', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
              { role: 'Waitstaff', email: 'waiter@pos.com', color: 'text-sky-400 border-sky-500/30 bg-sky-500/5' },
              { role: 'Kitchen Chef', email: 'kitchen@pos.com', color: 'text-rose-400 border-rose-500/30 bg-rose-500/5' },
              { role: 'Customer', email: 'customer@pos.com', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5', isCustomerRedirect: true }
            ].map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  if (acc.isCustomerRedirect) {
                    navigate('/order');
                  } else {
                    handleQuickLogin(acc.email);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition duration-300 cursor-pointer hover:scale-[1.03] hover:shadow-lg ${acc.color} backdrop-blur-md`}
              >
                <div className="font-extrabold text-[11px] tracking-tight">{acc.role}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{acc.email}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/order')}
            className="w-full py-3 px-4 bg-[#0a0d12]/90 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>Open Customer Self-Ordering Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
