import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithGoogle, logout, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ShoppingCart, 
  Menu as MenuIcon, 
  X, 
  Star, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  MessageSquare,
  ArrowRight,
  Utensils,
  Coffee,
  Flame,
  IceCream,
  Pizza
} from 'lucide-react';
import { MENU_ITEMS, REVIEWS } from './constants';
import { MenuItem, CartItem, Reservation, Order } from './types';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Categories from './components/Categories';
import MenuSection from './components/MenuSection';
import BestSellers from './components/BestSellers';
import ReviewsSection from './components/ReviewsSection';
import ContactSection from './components/ContactSection';
import ReservationSection from './components/ReservationSection';
import Gallery from './components/Gallery';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import FoodModal from './components/FoodModal';
import CheckoutModal from './components/CheckoutModal';
import AdminPortal from './components/AdminPortal';
import { signInWithEmail } from './lib/firebase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Items');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        console.log('Syncing user profile for UID:', u.uid);
        const userRef = doc(db, 'users', u.uid);
        try {
          await setDoc(userRef, {
            displayName: u.displayName || '',
            email: u.email || '',
            photoURL: u.photoURL || '',
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp() 
          }, { merge: true });
        } catch (error) {
          console.warn('User profile sync failure', handleFirestoreError(error, OperationType.WRITE, `users/${u.uid}`));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item: MenuItem, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
    setSelectedFood(null);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen font-sans bg-midnight text-white">
      <Navbar 
        user={user} 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)} 
        onAdminClick={() => setIsAdminPortalOpen(true)}
      />
      
      <main>
        {isAdminPortalOpen ? (
          <AdminPortal user={user} onClose={() => setIsAdminPortalOpen(false)} />
        ) : (
          <>
            <Hero />
            <About />
            <Features />
            <Categories activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            <MenuSection 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory}
              onProductClick={setSelectedFood} 
            />
            <BestSellers onProductClick={setSelectedFood} />
            <ReviewsSection />
            <Gallery />
            <BlogSection />
            <ReservationSection user={user} />
            <ContactSection />
          </>
        )}
      </main>

      <Footer onAdminLogin={() => setIsAdminLoginOpen(true)} />

      <AnimatePresence>
        {selectedFood && (
          <FoodModal 
            item={selectedFood} 
            onClose={() => setSelectedFood(null)} 
            onAddToCart={addToCart} 
          />
        )}
        {isCartOpen && (
          <CheckoutModal 
            cart={cart} 
            total={totalAmount}
            onClose={() => setIsCartOpen(false)} 
            user={user}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            onSuccess={() => {
              setCart([]);
              setIsCartOpen(false);
            }}
          />
        )}
        {isAdminLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminLoginOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-lighter-midnight border border-white/10 w-full max-w-md rounded-3xl p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                  <p className="text-sm text-gray-400 mt-1">Access restricted to authorized personnel.</p>
                </div>
                <button 
                  onClick={() => setIsAdminLoginOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
                const email = form.email.value;
                const password = form.password.value;
                try {
                  await signInWithEmail(email, password);
                  setIsAdminLoginOpen(false);
                  setIsAdminPortalOpen(true);
                } catch (err: any) {
                  alert("Login Failed: " + err.message);
                }
              }}>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    required
                    placeholder="admin@cafemidnight.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                  <input 
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-gold text-midnight font-bold rounded-xl hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  Sign In to Admin
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
