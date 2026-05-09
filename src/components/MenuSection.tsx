import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Utensils } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';

interface MenuSectionProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onProductClick: (item: MenuItem) => void;
}

export default function MenuSection({ activeCategory, onSelectCategory, onProductClick }: MenuSectionProps) {
  const filters = [
    { label: 'All Items', value: 'All Items' },
    { label: 'Fast Food', value: 'fastfood' },
    { label: 'BBQ', value: 'bbq' },
    { label: 'Beverages', value: 'beverages' },
    { label: 'Desserts', value: 'desserts' },
    { label: 'Snacks', value: 'snacks' },
  ];

  const filteredItems = MENU_ITEMS.filter(item => {
    if (activeCategory === 'All Items') return true;
    return item.category === activeCategory;
  });

  return (
    <section className="section-padding bg-midnight/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => onSelectCategory(filter.value)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === filter.value ? 'bg-gold text-midnight' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className="glass rounded-2xl overflow-hidden flex flex-col h-full group"
              >
                <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => onProductClick(item)}>
                  <img 
                    src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {item.isBestSeller && (
                    <span className="absolute top-4 left-4 bg-gold text-midnight text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                      Best Seller
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white bg-gold/80 px-6 py-2 rounded-full font-bold">View Details</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-1 text-gold mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < item.rating ? "currentColor" : "none"} strokeWidth={i < item.rating ? 0 : 2} />
                    ))}
                    <span className="text-white/40 text-[10px] ml-1 font-bold">({item.reviews} Reviews)</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{item.name}</h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-2xl font-serif font-bold text-gold">Rs {item.price}</span>
                    <button 
                      onClick={() => onProductClick(item)}
                      className="p-3 bg-white/5 hover:bg-gold hover:text-midnight rounded-xl transition-all"
                    >
                      <Utensils size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
