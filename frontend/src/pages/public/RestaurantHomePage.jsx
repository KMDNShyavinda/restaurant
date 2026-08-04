import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, Calendar, Clock, MapPin, Phone, Star, Sparkles, 
  ChevronRight, Award, Flame, ShoppingBag, ShieldCheck, Heart, User, Search, Activity, ChefHat
} from 'lucide-react';
import { ordersApi } from '../../api/ordersApi';

export const RestaurantHomePage = () => {
  const navigate = useNavigate();
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reservation Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingGuests, setBookingGuests] = useState('2');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('19:00');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchFeaturedMenu();
  }, []);

  const fetchFeaturedMenu = async () => {
    try {
      setLoading(true);
      const items = await ordersApi.getMenuItems(1);
      setFeaturedDishes(items.slice(0, 8));
    } catch (err) {
      console.error("Failed to load featured dishes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* High-Class Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#0d1217]/90 border-b border-amber-500/20 backdrop-blur-2xl px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-amber-500/25 border border-amber-400/30">
              MC
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Maison Ceylon
                </span>
                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Fine Dining
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Authentic Gastronomy & Bistro</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition">Our Story</a>
            <a href="#signature" className="hover:text-amber-400 transition">Chef's Specials</a>
            <a href="#experience" className="hover:text-amber-400 transition">Ambiance</a>
            <a href="#contact" className="hover:text-amber-400 transition">Location & Hours</a>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/track')}
              className="px-3.5 py-2.5 bg-[#141a22] hover:bg-slate-900 border border-slate-800 text-amber-400 font-extrabold rounded-2xl text-xs flex items-center space-x-2 transition cursor-pointer shadow-lg"
            >
              <Activity className="w-4 h-4" />
              <span>Track Order</span>
            </button>

            <button
              onClick={() => navigate('/order')}
              className="px-4 py-2.5 bg-[#141a22] hover:bg-slate-900 border border-slate-800 text-amber-400 font-extrabold rounded-2xl text-xs flex items-center space-x-2 transition cursor-pointer shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Online Menu</span>
            </button>

            <button
              onClick={() => setShowBookingModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold rounded-2xl text-xs shadow-xl shadow-amber-500/25 transition cursor-pointer flex items-center space-x-1.5 border border-amber-400/30"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="p-2.5 bg-[#141a22] hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 rounded-2xl transition cursor-pointer"
              title="Staff & POS Portal"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600" 
            alt="Maison Ceylon Restaurant Ambiance"
            className="w-full h-full object-cover opacity-25 scale-105 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090c] via-[#07090c]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090c] via-transparent to-[#07090c]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>Colombo's Premier Culinary Destination</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Authentic Flavor.<br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Elevated Fine Dining.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Immerse yourself in a culinary journey at Maison Ceylon. From wood-fired artisan pizzas and prime burgers to signature seafood, pasta, and handcrafted cocktails.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/order')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm rounded-2xl shadow-2xl shadow-amber-500/35 flex items-center justify-center space-x-3 transition transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider border border-amber-400/30"
            >
              <Utensils className="w-5 h-5" />
              <span>Explore Menu & Order</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[#141a22]/90 hover:bg-slate-900 border border-amber-500/30 text-white font-extrabold text-sm rounded-2xl backdrop-blur-xl flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Reserve a Table</span>
            </button>
          </div>

          {/* Quick Info Badges */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-amber-500/20">
            <div className="text-center">
              <div className="text-2xl font-black text-white">80+</div>
              <div className="text-xs text-slate-400">Gourmet Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-amber-400">4.9 ★</div>
              <div className="text-xs text-slate-400">Guest Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-orange-400">Wood-Fired</div>
              <div className="text-xs text-slate-400">Artisan Ovens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400">100% Fresh</div>
              <div className="text-xs text-slate-400">Local Ingredients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Dishes Showcase Section */}
      <section id="signature" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block mb-2">
              Culinary Artistry
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">Chef's Signature Dishes</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md">Crafted fresh using authentic Ceylon spices, prime meats, and local organic produce.</p>
          </div>

          <button
            onClick={() => navigate('/order')}
            className="px-6 py-3 bg-[#141a22] hover:bg-slate-900 border border-amber-500/30 text-amber-400 font-extrabold text-xs rounded-2xl flex items-center space-x-2 transition cursor-pointer"
          >
            <span>View All 80 Menu Items</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map(dish => (
            <div 
              key={dish.id}
              onClick={() => navigate('/order')}
              className="bg-[#11161d] border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/50 transition transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group"
            >
              <div className="h-52 relative overflow-hidden bg-slate-900">
                <img 
                  src={dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'} 
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11161d] via-transparent to-transparent" />
                <span className="absolute bottom-3 right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm rounded-xl shadow-lg shadow-amber-500/30">
                  ${parseFloat(dish.price).toFixed(2)}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight mb-1 group-hover:text-amber-400 transition">
                    {dish.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                  <span className="text-amber-400 font-extrabold flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Chef Favorite</span>
                  </span>
                  <span className="text-slate-400 font-bold group-hover:text-amber-400 transition">Order Online →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About & Ambiance Section */}
      <section id="about" className="py-16 px-6 bg-[#11161d]/60 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block">
              The Maison Ceylon Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              A Blend of Heritage Spices & Modern Gastronomy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Founded in the heart of Colombo, Maison Ceylon brings together centuries-old Sri Lankan culinary traditions with international fine dining techniques. Our wood-fired ovens burn seasoned cinnamon wood to impart unmatched aroma to every dish.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-[#07090c] border border-amber-500/20 rounded-2xl space-y-1">
                <Award className="w-6 h-6 text-amber-400" />
                <h4 className="font-extrabold text-white text-sm">Culinary Excellence</h4>
                <p className="text-xs text-slate-400">Award-winning chefs & mixologists</p>
              </div>

              <div className="p-4 bg-[#07090c] border border-amber-500/20 rounded-2xl space-y-1">
                <Utensils className="w-6 h-6 text-orange-400" />
                <h4 className="font-extrabold text-white text-sm">Wood-Fired Pizza</h4>
                <p className="text-xs text-slate-400">Handcrafted artisan crusts</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" 
              alt="Maison Ceylon Dining Area" 
              className="rounded-3xl shadow-2xl border border-amber-500/30 object-cover w-full h-[400px]"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 rounded-3xl shadow-2xl text-white max-w-xs border border-amber-400/30">
              <div className="text-lg font-black mb-1">Open 7 Days</div>
              <div className="text-xs font-medium">11:00 AM – 11:00 PM Daily for Lunch & Dinner</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Contact */}
      <footer id="contact" className="py-12 px-6 border-t border-amber-500/20 bg-[#07090c] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-black font-extrabold flex items-center justify-center">MC</div>
              <span className="text-lg font-extrabold text-white">Maison Ceylon</span>
            </div>
            <p className="text-slate-400 leading-relaxed">Premier fine dining restaurant & bistro. Experience Ceylon gastronomy at its finest.</p>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Hours & Location</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>124 Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+94 11 234 5678</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/order')} className="hover:text-amber-400 transition">Online Self-Ordering</button></li>
              <li><button onClick={() => setShowBookingModal(true)} className="hover:text-amber-400 transition">Table Reservations</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-amber-400 transition">Staff & POS Terminal</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Maison Ceylon Ecosystem</h4>
            <p className="text-slate-400 mb-3">Complete Web Application, QR Self-Ordering & POS Management System.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-[#141a22] hover:bg-slate-900 border border-amber-500/30 text-amber-400 font-extrabold rounded-xl transition cursor-pointer"
            >
              Sign In to Staff Portal →
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} Maison Ceylon Fine Dining Restaurant. All Rights Reserved.
        </div>
      </footer>

      {/* Table Reservation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#11161d] border border-amber-500/30 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Reserve a Dining Table</h3>
                <p className="text-xs text-slate-400">Book your table at Maison Ceylon</p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                <h4 className="font-extrabold text-white text-base">Table Reservation Confirmed!</h4>
                <p className="text-xs text-slate-300">We look forward to welcoming you at Maison Ceylon for fine dining.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-400/90 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Perera"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#07090c] border border-slate-800 rounded-2xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400/90 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#07090c] border border-slate-800 rounded-2xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-400/90 mb-1">Guests</label>
                    <select
                      value={bookingGuests}
                      onChange={(e) => setBookingGuests(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#07090c] border border-slate-800 rounded-2xl text-white text-xs focus:outline-none focus:border-amber-500 font-bold"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="8">8+ Guests (VIP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400/90 mb-1">Time</label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#07090c] border border-slate-800 rounded-2xl text-white text-xs focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold rounded-2xl text-xs shadow-xl shadow-amber-500/25 transition cursor-pointer border border-amber-400/30"
                >
                  Confirm Table Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
