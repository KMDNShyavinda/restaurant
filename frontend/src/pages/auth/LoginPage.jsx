import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UtensilsCrossed, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, 
  User, Phone, Eye, EyeOff, UserPlus, LogIn, CheckCircle2, Sparkles
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
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
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
      setSuccessMessage('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
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
    <div className="min-h-screen bg-[#0d1217] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#141a22]/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-3">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center space-x-2">
            <span>Maison Ceylon</span>
            <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black rounded-lg uppercase tracking-wider">
              POS System
            </span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Restaurant Management & Terminal Access</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0d1217] p-1 rounded-2xl border border-slate-800 mb-6 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => { setActiveTab('LOGIN'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'LOGIN' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('REGISTER'); setError(null); }}
            className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'REGISTER' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@pos.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0d1217] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#0d1217] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition transform active:scale-[0.98] disabled:opacity-50 cursor-pointer text-xs uppercase tracking-wider"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Sign In to POS Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Perera"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="kasun@pos.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                  Account Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white focus:outline-none focus:border-orange-500 text-xs font-bold"
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
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0d1217] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition transform active:scale-[0.98] disabled:opacity-50 cursor-pointer text-xs uppercase tracking-wider mt-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Launch Session</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Preset Credentials Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>One-Click Role Login:</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Password: password123</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { role: 'Super Admin', email: 'admin@pos.com', color: 'text-orange-400' },
              { role: 'Manager', email: 'manager@pos.com', color: 'text-amber-400' },
              { role: 'Cashier', email: 'cashier@pos.com', color: 'text-emerald-400' },
              { role: 'Waiter', email: 'waiter@pos.com', color: 'text-sky-400' },
              { role: 'Kitchen Staff', email: 'kitchen@pos.com', color: 'text-rose-400' },
              { role: 'Customer Guest', email: 'customer@pos.com', color: 'text-purple-400', isCustomerRedirect: true }
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
                className="px-2.5 py-2.5 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-xs transition text-left cursor-pointer hover:border-orange-500/50 hover:-translate-y-0.5 duration-200"
              >
                <div className={`font-extrabold text-[11px] ${acc.color}`}>{acc.role}</div>
                <div className="text-[10px] text-slate-400 truncate">{acc.email}</div>
              </button>
            ))}
          </div>

          <a
            href="/order"
            className="w-full py-2.5 px-4 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <span>Customer Self-Ordering Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
