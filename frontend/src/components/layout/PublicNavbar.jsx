import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, Calendar, Lock, Menu, X, PhoneCall } from 'lucide-react';

export const PublicNavbar = ({ cartCount = 0, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight block">Gourmet Bistro</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 block -mt-1">Fine Dining & Bar</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <Link to="/" className="hover:text-sky-400 transition">Home</Link>
            <Link to="/menu" className="hover:text-sky-400 transition">Our Menu</Link>
            <Link to="/reservations" className="hover:text-sky-400 transition flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Book Table</span>
            </Link>
            <Link to="/track-order" className="hover:text-sky-400 transition">Track Order</Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition cursor-pointer border border-slate-700/50 flex items-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Staff Terminal Login Link */}
            <Link
              to="/login"
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700/50 transition"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Staff POS Login</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={onOpenCart}
              className="relative p-2 bg-slate-800 text-white rounded-xl border border-slate-700"
            >
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-800 text-slate-300 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-semibold">Home</Link>
          <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-semibold">Our Menu</Link>
          <Link to="/reservations" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-semibold">Book Table</Link>
          <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-semibold">Track Order</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sky-400 font-semibold">Staff Terminal Login</Link>
        </div>
      )}
    </nav>
  );
};
