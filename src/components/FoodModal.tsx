import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../types';

interface FoodModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export default function FoodModal({ item, onClose, onAddToCart }: FoodModalProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-midnight/90 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-midnight border border-white/10 rounded-[40px] overflow-hidden grid md:grid-cols-2 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-3 bg-midnight/50 hover:bg-midnight rounded-full border border-white/10">
          <X size={24} />
        </button>

        <div className="h-80 md:h-full relative overflow-hidden">
          <img 
            src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
            alt={item.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="p-8 md:p-12 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">{item.category}</span>
            <div className="flex items-center gap-1 text-gold ml-2">
              <Star size={16} fill="currentColor" />
              <span className="text-white font-bold">{item.rating}.0</span>
            </div>
          </div>

          <h2 className="text-4xl font-serif font-bold mb-4">{item.name}</h2>
          <p className="text-white/60 text-lg mb-8 leading-relaxed">{item.description}</p>

          <div className="mb-8">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ing, i) => (
                <span key={i} className="text-sm bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-white/70">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-3xl font-serif font-bold text-gold">Rs {item.price}</span>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-bold w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(item, quantity)}
              className="btn-primary w-full py-4 flex items-center justify-center gap-4 text-lg"
            >
              <ShoppingCart size={24} />
              Add to Cart - Rs {item.price * quantity}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
