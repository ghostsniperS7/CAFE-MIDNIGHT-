import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      >
        <div className="absolute inset-0 bg-midnight/70" />
      </div>

      {/* Floating GLow Effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gold/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gold/10 blur-[100px] rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-accent text-gold text-2xl mb-4 block">Cafe Midnight 🌙</span>
          <h1 className="text-6xl md:text-8xl font-serif font-extrabold mb-6 leading-tight">
            Open Area Best Place <br />
            <span className="text-gold italic">To Dine In</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience peaceful ambiance, premium food, chai, snacks, and unforgettable nights with friends and family.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#menu" className="btn-primary group flex items-center gap-2 w-full sm:w-auto justify-center">
              View Menu
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#reservation" className="btn-outline w-full sm:w-auto text-center">
              Reserve Table
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-2 bg-gold rounded-full"
          />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Scroll Down</span>
      </motion.div>
    </section>
  );
}
