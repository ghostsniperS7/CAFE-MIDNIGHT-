import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType, signInWithGoogle } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Calendar, Clock, Users, MessageSquare, Send, LogIn, ChevronDown, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { Reservation } from '../types';

interface ReservationSectionProps {
  user: User | null;
}

export default function ReservationSection({ user }: ReservationSectionProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    guests: 2,
    date: '',
    time: '',
    notes: ''
  });
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setUserReservations([]);
      return;
    }

    const q = query(
      collection(db, 'reservations'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
      setUserReservations(data);
    }, (err) => {
      console.error('Failed to fetch user reservations:', err);
    });

    return () => unsubscribe();
  }, [user]);

  const validateForm = () => {
    // Name validation: No numbers
    if (/[0-9]/.test(formData.fullName)) {
      setError('Full name should not contain numbers.');
      return false;
    }
    // Phone validation: No letters
    if (/[A-Za-z]/.test(formData.phone)) {
      setError('Phone number should not contain letters.');
      return false;
    }
    // Date validation: Not in the past
    if (formData.date < today) {
      setError('Please select a current or future date.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    if (!validateForm()) return;

    const path = 'reservations';
    setLoading(true);
    const payload = {
      ...formData,
      userId: user.uid,
      status: 'pending',
      createdAt: serverTimestamp()
    };
    try {
      await addDoc(collection(db, path), payload);
      setSuccess(true);
      setFormData({ fullName: '', phone: '', guests: 2, date: '', time: '', notes: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      const errorMessage = handleFirestoreError(err, OperationType.CREATE, path);
      try {
        const parsedError = JSON.parse(errorMessage);
        setError(`Error: ${parsedError.error || 'Failed to save reservation'}`);
      } catch {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservation" className="section-padding bg-midnight/50 relative overflow-hidden">
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* User Reservation Status Section - MOVED TO TOP for visibility if logged in */}
        {user && userReservations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[40px] border border-gold/30 overflow-hidden bg-gold/5"
          >
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center">
                  <Calendar className="text-gold" size={24} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-serif font-bold text-white">Your Reservations</h3>
                  <p className="text-gold/60 text-sm font-medium">Track your table status here</p>
                </div>
                <span className="bg-gold text-midnight text-[10px] font-black px-2 py-0.5 rounded-full uppercase ml-2">{userReservations.length} Bookings</span>
              </div>
              <ChevronDown className={`text-gold/40 transition-transform duration-500 ${showHistory ? 'rotate-180' : ''}`} size={28} />
            </button>

            <AnimatePresence initial={false}>
              {(showHistory || userReservations.length <= 2) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-8 space-y-4 overflow-hidden"
                >
                  {userReservations.map((res) => (
                    <div key={res.id} className="bg-midnight/40 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/20 transition-all group">
                      <div className="flex items-start gap-5">
                        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${
                          res.status === 'confirmed' ? 'bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 
                          res.status === 'cancelled' ? 'bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 
                          'bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                        }`}>
                          {res.status === 'confirmed' ? <CheckCircle2 className="text-green-500" size={28} /> : 
                           res.status === 'cancelled' ? <XCircle className="text-red-500" size={28} /> : 
                           <Clock3 className="text-amber-500" size={28} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-white mb-1">{res.date}</span>
                            <span className="text-gold font-accent text-lg">@ {res.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                            <Users size={14} />
                            <span>{res.guests} Guests</span>
                            <span className="opacity-30">•</span>
                            <span>{res.fullName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-10">
                        <div className="text-right">
                          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black mb-1">Current Status</p>
                          <p className={`font-black uppercase text-sm tracking-widest ${
                            res.status === 'confirmed' ? 'text-green-500' : 
                            res.status === 'cancelled' ? 'text-red-500' : 
                            'text-amber-500'
                          }`}>
                            {res.status || 'pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="glass p-8 md:p-12 rounded-[40px] border border-white/10">
          <div className="text-center mb-12">
            <span className="text-gold font-accent text-xl">Join Us</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2">Reserve Your Table</h2>
            <p className="text-white/60 mt-4">Secure your spot for a peaceful midnight experience.</p>
          </div>

          <div className="relative">
            {!user && (
              <div className="absolute inset-0 z-20 backdrop-blur-sm bg-midnight/40 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-midnight/80 p-8 rounded-[32px] border border-white/10 shadow-2xl max-w-sm">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LogIn className="text-gold" size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 text-white">Login Required</h3>
                  <p className="text-white/60 mb-8">Please sign in to secure a reservation and track your booking status.</p>
                  <button 
                    onClick={() => signInWithGoogle()}
                    className="btn-primary w-full flex items-center justify-center gap-3 py-4"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={`grid md:grid-cols-2 gap-8 ${!user ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-midnight/50 border border-white/10 rounded-2xl py-4 px-6 focus:border-gold outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-2">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+92 300 0000000"
                  className="w-full bg-midnight/50 border border-white/10 rounded-2xl py-4 px-6 focus:border-gold outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-2">Number of Guests</label>
                <div className="relative flex items-center">
                  <Users className="absolute left-6 text-gold" size={20} />
                  <select 
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                    className="w-full bg-midnight/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-gold outline-none transition-colors appearance-none"
                  >
                    {[1,2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n} className="bg-midnight text-white">{n} Guests</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-2">Date</label>
                  <input 
                    type="date" 
                    required
                    min={today}
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-midnight/50 border border-white/10 rounded-2xl py-4 px-4 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-2">Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-midnight/50 border border-white/10 rounded-2xl py-4 px-4 focus:border-gold outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-white/60 uppercase tracking-widest pl-2">Special Notes</label>
                <textarea 
                  rows={4}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Birthday celebration, anniversary, etc."
                  className="w-full bg-midnight/50 border border-white/10 rounded-2xl py-4 px-6 focus:border-gold outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="md:col-span-2 mt-4 text-center">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`btn-primary w-full md:w-auto px-12 flex items-center justify-center gap-3 mx-auto ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-midnight border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} />
                      Reserve Table Now
                    </>
                  )}
                </button>
                {error && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 font-bold mt-4">{error}</motion.p>
                )}
                {success && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-gold font-bold mt-4">✓ Table reserved successfully!</motion.p>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
