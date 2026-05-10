import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Calendar,
  Clock,
  Phone,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  X,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { Reservation, Order } from '../types';

interface OrdersPortalProps {
  user: FirebaseUser | null;
  onClose: () => void;
}

export default function OrdersPortal({ user, onClose }: OrdersPortalProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const resQuery = query(
      collection(db, 'reservations'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeReservations = onSnapshot(resQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
      setReservations(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reservations');
    });

    const orderQuery = query(
      collection(db, 'orders'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeOrders = onSnapshot(orderQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => {
      unsubscribeReservations();
      unsubscribeOrders();
    };
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white p-8">
        <p className="text-xl mb-4">Please log in to see your orders.</p>
        <button onClick={onClose} className="px-6 py-2 bg-gold text-midnight rounded-xl font-bold">Close</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'confirmed': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      case 'delivering': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-amber-500 bg-amber-500/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onClose}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Your Orders</h1>
          <p className="text-gray-400">Manage and track your recent activity</p>
        </div>
      </div>

      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-8 max-w-sm">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'orders' ? 'bg-gold text-midnight' : 'text-gray-400 hover:text-white'}`}
        >
          <ShoppingBag size={18} />
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'reservations' ? 'bg-gold text-midnight' : 'text-gray-400 hover:text-white'}`}
        >
          <Calendar size={18} />
          Tables
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'orders' ? (
          orders.length > 0 ? (
            orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Order #{order.id?.slice(-6).toUpperCase()}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin size={14} className="text-gold" />
                      {order.address}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gold">Rs. {order.total}</div>
                    <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-gold text-sm">
                          {item.quantity}x
                        </span>
                        <span className="text-white/80">{item.name}</span>
                      </div>
                      <span className="text-white/60 text-sm">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.status === 'delivering' && (
                  <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 text-midnight rounded-full flex items-center justify-center animate-pulse">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-500">Order Out for Delivery</h4>
                      <p className="text-xs text-amber-500/70">Our delivery partner is on their way to your address.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : !loading && (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <Package size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
              <p className="text-gray-400 mb-6">Looks like you haven't placed any orders yet.</p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-gold text-midnight font-bold rounded-xl"
              >
                Order Now
              </button>
            </div>
          )
        ) : (
          reservations.length > 0 ? (
            reservations.map((res) => (
              <motion.div 
                key={res.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/10">
                      <span className="text-xs text-gray-500 uppercase">{res.date.split('-')[1]}</span>
                      <span className="text-xl font-bold text-gold">{res.date.split('-')[2]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(res.status)}`}>
                          {res.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">Table for {res.guests} Guests</h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-gold" />
                          {res.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gold" />
                          {res.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : !loading && (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No reservations</h3>
              <p className="text-gray-400 mb-6">You haven't booked any tables yet.</p>
              <a 
                href="#reservation"
                onClick={onClose}
                className="inline-block px-8 py-3 bg-gold text-midnight font-bold rounded-xl"
              >
                Book a Table
              </a>
            </div>
          )
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
