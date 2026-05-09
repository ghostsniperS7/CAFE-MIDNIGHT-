import { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, Trash2, Minus, Plus, CreditCard, User, Phone, MapPin, Send, LogIn } from 'lucide-react';
import { CartItem } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { db, handleFirestoreError, OperationType, signInWithGoogle } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CheckoutModalProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  user: FirebaseUser | null;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ 
  cart, 
  total, 
  onClose, 
  user,
  updateQuantity, 
  removeFromCart,
  onSuccess 
}: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!user) return;
    setError(null);

    if (!formData.phone || !formData.address) {
      setError('Please fill in all details');
      return;
    }

    // Name validation: No numbers
    if (/[0-9]/.test(formData.fullName)) {
      setError('Full name should not contain numbers.');
      return;
    }
    // Phone validation: No letters
    if (/[A-Za-z]/.test(formData.phone)) {
      setError('Phone number should not contain letters.');
      return;
    }

    const path = 'orders';
    setLoading(true);
    const payload = {
      ...formData,
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      total,
      userId: user.uid,
      status: 'pending',
      createdAt: serverTimestamp()
    };
    console.log('Creating Order Payload:', payload);
    try {
      await addDoc(collection(db, path), payload);
      onSuccess();
      alert('Order placed successfully! We will contact you shortly.');
    } catch (e: any) {
      const errorMessage = handleFirestoreError(e, OperationType.CREATE, path);
      console.error('Order Error:', errorMessage);
      try {
        const parsedError = JSON.parse(errorMessage);
        setError(`Error: ${parsedError.error || 'Failed to place order'}`);
      } catch {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-end"
    >
      <div className="absolute inset-0 bg-midnight/90 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl h-full bg-midnight border-l border-white/10 flex flex-col shadow-2xl"
      >
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ShoppingBag className="text-gold" size={32} />
            <h2 className="text-3xl font-serif font-bold">Your Tray</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar relative">
          {!user && (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-midnight/40 flex items-center justify-center p-8">
              <div className="glass p-10 rounded-[40px] border border-white/10 text-center max-w-sm w-full">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <LogIn className="text-gold" size={40} />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4">Login Required</h3>
                <p className="text-white/60 mb-10 leading-relaxed">Join the Cafe Midnight community to place orders, save your address, and track your history.</p>
                <button 
                  onClick={() => signInWithGoogle()}
                  className="btn-primary w-full py-5 flex items-center justify-center gap-4 text-lg"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                  Continue with Google
                </button>
              </div>
            </div>
          )}

          <div className={`${!user ? 'opacity-20 pointer-events-none grayscale blur-[2px]' : ''} space-y-8`}>
            {step === 1 ? (
            <div className="space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-white/40 mb-8">Your tray is empty.</p>
                  <button onClick={onClose} className="btn-outline">Browse Menu</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 glass p-4 rounded-2xl relative group">
                    <img src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`} className="w-20 h-20 object-cover rounded-xl" alt="" referrerPolicy="no-referrer" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                      <p className="text-gold font-bold mb-3">Rs {item.price}</p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white/10 rounded-lg"><Minus size={16} /></button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white/10 rounded-lg"><Plus size={16} /></button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 text-white/20 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-8">
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase pl-2 flex items-center gap-2"><User size={14}/> Full Name</label>
                    <input 
                      type="text" 
                      required
                      pattern="^[^0-9]*$"
                      title="Numbers are not allowed in the full name"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase pl-2 flex items-center gap-2"><Phone size={14}/> Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      pattern="^[^A-Za-z]*$"
                      title="Letters are not allowed in the phone number"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase pl-2 flex items-center gap-2"><MapPin size={14}/> Delivery Address</label>
                    <textarea 
                      rows={3}
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-gold outline-none resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase pl-2 flex items-center gap-2"><CreditCard size={14}/> Payment Method</label>
                    <select 
                      value={formData.paymentMethod}
                      onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-gold outline-none appearance-none"
                    >
                      <option className="bg-midnight">Cash on Delivery</option>
                      <option className="bg-midnight">Bank Transfer</option>
                      <option className="bg-midnight">EasyPaisa / JazzCash</option>
                    </select>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <span className="text-white/60">Grand Total</span>
            <span className="text-3xl font-serif font-bold text-gold">Rs {total}</span>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 font-bold mb-6 text-center"
            >
              {error}
            </motion.p>
          )}

          <div className={!user ? 'opacity-20 pointer-events-none' : ''}>
            {step === 1 ? (
              <button 
                disabled={cart.length === 0}
                onClick={() => setStep(2)}
                className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-outline px-4">Back</button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary flex-grow py-5 flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-midnight border-t-transparent rounded-full animate-spin" /> : <><Send size={20}/> Place Order</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
