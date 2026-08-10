import React from 'react';
import { motion } from 'framer-motion';

export const PosCategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center space-x-6 overflow-x-auto pb-2 mb-4 shrink-0 no-scrollbar border-b border-slate-800/60 relative">
      <div className="flex flex-col items-center relative group">
        <button
          onClick={() => onSelectCategory(null)}
          className={`text-sm font-bold transition cursor-pointer pb-2 px-1 relative z-10 ${
            selectedCategory === null
              ? 'text-amber-400 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Items
        </button>
        {selectedCategory === null && (
          <motion.div
            layoutId="activeCategory"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>

      {categories.map(c => {
        const isSelected = String(selectedCategory) === String(c.id);
        return (
          <div key={c.id} className="flex flex-col items-center relative group">
            <button
              onClick={() => onSelectCategory(c.id)}
              className={`text-sm font-bold transition cursor-pointer pb-2 px-1 relative z-10 ${
                isSelected
                  ? 'text-amber-400 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.name}
            </button>
            {isSelected && (
              <motion.div
                layoutId="activeCategory"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
