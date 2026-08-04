import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UtensilsCrossed, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@pos.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.role === 'KITCHEN') {
        navigate('/kds');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#0d1217] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Orange & Amber Gradients */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#141a22]/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-4">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Maison Ceylon</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to access your POS terminal session</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pos.com"
                className="w-full pl-11 pr-4 py-3 bg-[#0d1217] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[#0d1217] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Sign In to Terminal</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Credentials Demo Presets */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Select Staff Account:</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Password: password123</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {[
              { role: 'Super Admin', email: 'admin@pos.com', color: 'text-orange-400' },
              { role: 'Manager', email: 'manager@pos.com', color: 'text-amber-400' },
              { role: 'Cashier', email: 'cashier@pos.com', color: 'text-emerald-400' },
              { role: 'Waiter', email: 'waiter@pos.com', color: 'text-sky-400' },
              { role: 'Kitchen Staff', email: 'kitchen@pos.com', color: 'text-rose-400' }
            ].map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickFill(acc.email)}
                className="px-2.5 py-2 bg-[#0d1217] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-xs transition text-left cursor-pointer hover:border-orange-500/40"
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
            <span>Customer? Open Self-Ordering Menu</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
