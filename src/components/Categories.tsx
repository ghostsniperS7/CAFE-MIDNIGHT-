import { motion } from 'motion/react';

interface CategoriesProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function Categories({ activeCategory, onSelectCategory }: CategoriesProps) {
  const categories = [
    { id: 'fastfood', name: 'Fast Food', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 'bbq', name: 'BBQ', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 'beverages', name: 'Chai & Beverages', image: 'https://images.unsplash.com/photo-1544787210-22c3664ef214?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 'desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 'snacks', name: 'Snacks', image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <section className="section-padding bg-midnight" id="menu">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-gold font-accent text-xl">Top Choices</span>
          <h2 className="text-4xl font-serif font-bold mt-2">Popular Categories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative group h-64 rounded-2xl overflow-hidden border transition-all ${
                activeCategory === cat.id ? 'border-gold ring-1 ring-gold/50' : 'border-white/10'
              }`}
            >
              <img 
                src={cat.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={cat.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent" />
              <div className="absolute bottom-4 left-0 w-full text-center px-2">
                <span className="font-serif text-lg font-bold group-hover:text-gold transition-colors">{cat.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
