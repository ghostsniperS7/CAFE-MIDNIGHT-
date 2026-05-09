import { motion } from 'motion/react';
import { Utensils, Users, ShieldCheck, Banknote } from 'lucide-react';

export default function About() {
  const highlights = [
    { icon: <Utensils size={24} />, text: 'Open Air Dining' },
    { icon: <ShieldCheck size={24} />, text: 'Premium Food' },
    { icon: <Users size={24} />, text: 'Friendly Staff' },
    { icon: <Banknote size={24} />, text: 'Affordable Prices' },
  ];

  return (
    <section id="about" className="section-padding bg-midnight overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
        >
          <span className="text-gold font-accent text-xl mb-2 block">Our Story</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Cafe Midnight</h2>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Located in the heart of FC Area Nazimabad, Karachi, Cafe Midnight is more than just a restaurant. It's a peaceful escape from the bustling city. We pride ourselves on offering a unique open-air dining experience coupled with high-quality, affordable premium food.
          </p>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Whether you're looking for a quiet evening with family or a vibrant night out with friends, our friendly staff and cozy ambiance ensure every visit is an unforgettable one.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-gold/10 text-gold rounded-lg flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gold/10 blur-[60px] rounded-full translate-x-10 translate-y-10" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 group">
            <img 
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="About Cafe Midnight" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl hidden md:block">
            <p className="text-gold font-serif text-3xl font-bold">10+</p>
            <p className="text-sm text-white/60 uppercase tracking-widest">Premium Dishes</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
