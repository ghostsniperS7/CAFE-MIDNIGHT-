import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { ShoppingCart, LogIn, LogOut, Menu, X, LayoutDashboard, ShoppingBag, Calendar } from 'lucide-react';
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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-midnight/90 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
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
        <div className="flex items-center gap-2 md:gap-4">
          {/* Always Visible Shopping Cart */}
          <button 
            onClick={onOpenCart}
            className="relative p-2.5 text-white hover:text-gold active:scale-95 transition-all flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Open Cart"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-gold text-midnight text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-midnight">
                {cartCount}
              </span>
            )}
          </button>

          {/* Desktop/Tablet Only Navigation Controls */}
          <div className="hidden md:flex items-center gap-3">
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
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={28} />
          </motion.button>
        </div>
      </div>

      {/* Side Navigation Drawer for Mobile/Tablet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            />

            {/* Side Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="lg:hidden fixed top-0 right-0 h-screen w-[320px] max-w-full bg-midnight/98 border-l border-white/10 shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-midnight font-black text-lg">M</span>
                  </div>
                  <span className="text-xl font-serif font-bold text-white tracking-tight">
                    Cafe<span className="text-gold">Midnight</span>
                  </span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2 text-white hover:text-gold rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center min-w-[40px] min-h-[40px]"
                  aria-label="Close Menu"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Navigation</span>
                {navLinks.map((link) => (
                  <motion.a 
                    key={link.name} 
                    href={link.href} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-serif text-white hover:text-gold active:text-gold/80 transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}

                {/* Account / Administration Options */}
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2 mt-4">Account</span>
                
                {user ? (
                  <div className="space-y-4">
                    {/* User Profile Summary */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <img 
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} 
                        alt="" 
                        className="w-10 h-10 rounded-full" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-white text-sm truncate">{user.displayName || 'Cafe Guest'}</div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { onOrdersClick(); setIsMenuOpen(false); }}
                        className="flex items-center gap-3 text-lg py-3 px-4 bg-gold/10 text-gold rounded-2xl w-full text-left font-semibold active:bg-gold/20 transition-all"
                      >
                        <ShoppingBag size={20} /> My Orders
                      </motion.button>

                      {isAdmin && (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { onAdminClick(); setIsMenuOpen(false); }}
                          className="flex items-center gap-3 text-lg py-3 px-4 bg-amber-500/10 text-amber-500 rounded-2xl w-full text-left font-semibold active:bg-amber-500/20 transition-all"
                        >
                          <LayoutDashboard size={20} /> Admin Portal
                        </motion.button>
                      )}

                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="flex items-center gap-3 text-lg py-3 px-4 bg-red-500/10 text-red-400 rounded-2xl w-full text-left font-semibold active:bg-red-500/20 transition-all"
                      >
                        <LogOut size={20} /> Logout
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { signInWithGoogle(); setIsMenuOpen(false); }}
                    className="flex items-center justify-center gap-3 text-lg py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl w-full font-bold border border-white/10 active:scale-98 transition-all"
                  >
                    <LogIn size={20} className="text-gold" /> Login with Google
                  </motion.button>
                )}
              </div>

              {/* Drawer Footer Reservation CTA */}
              <div className="p-6 border-t border-white/5 bg-midnight/50">
                <motion.a 
                  whileTap={{ scale: 0.95 }}
                  href="#reservation" 
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-primary w-full text-center py-4 text-base flex items-center justify-center gap-2 shadow-lg shadow-gold/10"
                >
                  <Calendar size={18} />
                  Reserve Table
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
