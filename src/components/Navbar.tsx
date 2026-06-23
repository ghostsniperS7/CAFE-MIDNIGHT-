import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { ShoppingCart, LogIn, LogOut, Menu, X, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { signInWithGoogle, logout } from '../lib/firebase';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onOpenCart: () => void;
  onOrdersClick: () => void;
  onAdminClick: () => void;
}

export default function Navbar({ user, cartCount, onOpenCart, onOrdersClick, onAdminClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.email?.toLowerCase() === 'asifsafwan43@gmail.com' || user?.uid === 'ko89RmZBBiOkZFqhYbQWlEu1LEC2';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-midnight/95 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between min-h-[80px]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative">
            <img 
              src="logo.png" 
              alt="Cafe Midnight" 
              className="h-16 md:h-24 transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden flex items-center gap-2">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <span className="text-midnight font-black text-2xl">M</span>
              </div>
              <span className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                Cafe<span className="text-gold">Midnight</span>
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="relative text-white/80 hover:text-gold font-medium transition-colors group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
             <button 
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-gold transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-midnight text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3 bg-white/5 p-1 pr-2 md:pr-4 rounded-full border border-white/10">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                <button 
                  onClick={onOrdersClick}
                  className="hidden md:flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold hover:bg-gold/20 transition-colors"
                >
                  MY ORDERS
                </button>
                {isAdmin && (
                  <button 
                    onClick={onAdminClick}
                    className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold hover:bg-amber-500/20 transition-colors"
                  >
                    ADMIN
                  </button>
                )}
                <button onClick={logout} className="text-white/60 hover:text-white transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
              >
                <LogIn size={20} />
                <span className="hidden md:inline font-medium">Login</span>
              </button>
            )}

            <a 
              href="#reservation" 
              className="btn-primary py-2 px-5 text-sm"
            >
              Reserve Table
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-white p-3 -mr-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} className="text-gold" /> : <Menu size={28} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden absolute top-full left-0 w-full bg-midnight/95 backdrop-blur-md border-b border-white/10 p-6 flex flex-col gap-5 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            {navLinks.map((link) => (
              <motion.a 
                key={link.name} 
                href={link.href} 
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 block text-2xl font-serif text-white/95 hover:text-gold active:text-gold/80 transition-colors border-b border-white/5"
              >
                {link.name}
              </motion.a>
            ))}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => { onOpenCart(); setIsMenuOpen(false); }}
                className="flex items-center gap-3 text-xl py-2 w-full text-left text-white/90 active:text-gold transition-colors"
              >
                <ShoppingCart size={24} className="text-gold" /> Cart ({cartCount})
              </motion.button>
              {!user ? (
                 <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { signInWithGoogle(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-xl py-2 w-full text-left text-gold active:text-gold/80 transition-colors"
                >
                  <LogIn size={24} /> Login
                 </motion.button>
              ) : (
                <>
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { onOrdersClick(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-xl py-2 w-full text-left text-gold active:text-gold/80 transition-colors"
                  >
                    <ShoppingBag size={24} /> My Orders
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-xl py-2 w-full text-left text-red-400 active:text-red-500 transition-colors"
                  >
                    <LogOut size={24} /> Logout
                  </motion.button>
                </>
              )}
              {isAdmin && (
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onAdminClick(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-xl py-2 w-full text-left text-amber-500 active:text-amber-600 transition-colors"
                >
                  <LayoutDashboard size={24} /> Admin Portal
                </motion.button>
              )}
              <motion.a 
                whileTap={{ scale: 0.95 }}
                href="#reservation" 
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary w-full text-center py-4 text-base mt-2"
              >
                Reserve Table
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
