import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Gourmet Bistro</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Crafting memorable culinary experiences with fresh organic ingredients, artisanal chef recipes, and romantic ambiance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-sky-400 transition">Home & About</Link></li>
            <li><Link to="/menu" className="hover:text-sky-400 transition">Online Food Menu</Link></li>
            <li><Link to="/reservations" className="hover:text-sky-400 transition">Reserve a Table</Link></li>
            <li><Link to="/track-order" className="hover:text-sky-400 transition">Live Order Tracking</Link></li>
            <li><Link to="/login" className="hover:text-sky-400 transition text-sky-400 font-semibold">Staff Terminal Login</Link></li>
          </ul>
        </div>

        {/* Opening Hours */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Opening Hours</h4>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Mon - Thu: 11:00 AM - 10:00 PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Fri - Sun: 11:00 AM - 11:30 PM</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Contact & Location</h4>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>123 Main Culinary Boulevard, Downtown Gourmet Zone</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>+1 (555) 019-2834</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>orders@gourmetbistro.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <p>© 2026 Gourmet Bistro Fine Dining. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for food lovers</span>
        </p>
      </div>
    </footer>
  );
};
