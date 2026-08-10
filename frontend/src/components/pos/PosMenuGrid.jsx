import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Flame, Utensils } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const PosMenuGrid = ({ items, loading, onSelectItem, onAddToCart, recommendedItems }) => {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
        <Utensils className="w-12 h-12 mb-2 opacity-30 text-amber-500" />
        <p className="text-sm font-medium">No dishes found</p>
        <p className="text-xs">Try selecting another category or clearing search</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-5 no-scrollbar pb-10">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {items.map(item => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="bg-[#141a22]/80 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 p-3.5 rounded-3xl cursor-pointer shadow-xl flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div 
                onClick={() => onSelectItem(item)}
                className="w-full h-36 bg-slate-950 rounded-2xl overflow-hidden mb-3 relative group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition duration-500"
              >
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-800 shadow-md">
                  {item.category?.name || 'Gourmet'}
                </span>

                <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-800 text-xs font-extrabold shadow-md">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{(item.averageRating || 4.8).toFixed(1)}</span>
                </div>
              </div>

              <div onClick={() => onSelectItem(item)}>
                <h3 className="font-extrabold text-white text-base mb-0.5 group-hover:text-amber-400 transition line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">{item.description || 'Signature dish'}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase block text-[10px]">Price</span>
                <span className="text-base font-black text-amber-500">${item.price?.toFixed(2)}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item);
                }}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
                title="Add to order"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recommended Section */}
      {recommendedItems && recommendedItems.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4 border-t border-slate-800/60 mt-6"
        >
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Recommended for You</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {recommendedItems.map(rec => (
              <div
                key={rec.id}
                onClick={() => onAddToCart(rec)}
                className="bg-[#141a22] border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between hover:border-amber-500/40 cursor-pointer transition group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={rec.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'}
                    alt={rec.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs group-hover:text-amber-400 transition">{rec.name}</h4>
                    <span className="text-[11px] font-extrabold text-amber-500">${rec.price?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-900 group-hover:bg-amber-500 text-slate-400 group-hover:text-white flex items-center justify-center transition">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
