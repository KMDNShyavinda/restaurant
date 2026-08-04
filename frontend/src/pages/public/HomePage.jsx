import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UtensilsCrossed, Calendar, ShoppingBag, Award, 
  Clock, Star, Sparkles, ShieldCheck, Flame, ArrowRight 
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  const chefSpecials = [
    {
      id: 1,
      name: "Artisanal Margherita Pizza",
      category: "Pizza",
      price: 14.99,
      description: "San Marzano tomato sauce, fresh buffalo mozzarella, organic basil, and extra virgin olive oil.",
      rating: 4.9,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Truffle Mushroom Burger",
      category: "Burgers",
      price: 16.50,
      description: "Angus beef patty, black truffle aioli, sauteed wild mushrooms, swiss cheese on brioche bun.",
      rating: 4.8,
      badge: "Chef Choice"
    },
    {
      id: 3,
      name: "Classic Tagliatelle Bolognese",
      category: "Pasta",
      price: 18.00,
      description: "Handmade egg pasta with slow-simmered beef ragù, parmigiano-reggiano, and fresh herbs.",
      rating: 4.9,
      badge: "Popular"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Banner Section */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-slate-900">
        {/* Background Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Award-Winning Fine Dining & Express Online Delivery</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Exquisite Taste, Crafted with <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Passion & Quality</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience hand-crafted artisanal dishes made from 100% fresh organic ingredients. Order online for instant express delivery or reserve your table for a memorable dining experience.
          </p>

          {/* Action Callouts */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Order Online Now</span>
            </Link>

            <Link
              to="/reservations"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold rounded-2xl flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-sky-400" />
              <span>Reserve a Table</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 pt-10 border-t border-slate-900 text-xs font-semibold text-slate-400">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Fresh Ingredients</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Artisanal Chef Recipes</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>30-Min Express Delivery</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>4.9★ Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Chef Specials Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1 block">Culinary Delights</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Chef's Special Recommendations</h2>
          </div>

          <Link
            to="/menu"
            className="mt-4 md:mt-0 text-sm font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
          >
            <span>View Full Online Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chefSpecials.map(dish => (
            <div
              key={dish.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-sky-500/50 transition transform hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {dish.badge}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition">{dish.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{dish.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <span className="text-xl font-black text-emerald-400">${dish.price.toFixed(2)}</span>
                <Link
                  to="/menu"
                  className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-bold rounded-xl transition"
                >
                  Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-10">What Our Diners Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 italic mb-4">"The Truffle Burger is out of this world! Delivered hot and fresh in under 25 minutes."</p>
              <div className="text-xs font-bold text-white">— Sarah Jenkins</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 italic mb-4">"Online table booking was seamless. The outdoor patio ambiance and wine pairing were fantastic."</p>
              <div className="text-xs font-bold text-white">— David Miller</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-300 italic mb-4">"Real-time live order tracking kept us informed every step of the way. 5-star service!"</p>
              <div className="text-xs font-bold text-white">— Emily Watson</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
