import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';

interface BestSellersProps {
  onProductClick: (item: MenuItem) => void;
}

export default function BestSellers({ onProductClick }: BestSellersProps) {
  const bestSellers = MENU_ITEMS.filter(i => i.isBestSeller);

  return (
    <section className="section-padding bg-midnight">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-gold font-accent text-xl">Top Rated</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2">Our Best Sellers</h2>
          </div>
          <p className="text-white/60 max-w-sm">The most loved tastes of FC Area Karachites, curated for your delight.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {bestSellers.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-gold/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[40px] rounded-full translate-x-10 -translate-y-10" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Best Seller
                  </span>
                  <div className="flex items-center gap-1 text-gold">
                    <Star size={16} fill="currentColor" />
                    <span className="text-white font-bold">{item.rating}.0</span>
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-bold mb-3">{item.name}</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gold">Rs {item.price}</span>
                  <button 
                    onClick={() => onProductClick(item)}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Decorative Image in Background */}
              <div className="mt-8 scale-110 group-hover:scale-125 transition-transform duration-700 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 h-40 rounded-2xl overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
