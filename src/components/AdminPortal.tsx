import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Reservation } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  User, 
  Trash2, 
  Edit2, 
  Plus, 
  X, 
  Check,
  Search,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface AdminPortalProps {
  user: FirebaseUser | null;
  onClose: () => void;
}

export default function AdminPortal({ user, onClose }: AdminPortalProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    guests: 2,
    date: '',
    time: '',
    notes: '',
    userId: user?.uid || '',
    status: 'pending' as const
  });

  useEffect(() => {
    if (errorVisible) {
      const timer = setTimeout(() => setErrorVisible(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorVisible]);

  useEffect(() => {
    if (!user || user.email?.toLowerCase() !== 'asifsafwan43@gmail.com') return;

    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
      setReservations(data);
      setLoading(false);
    }, (error) => {
      setErrorVisible('Failed to load reservations. Please check your permissions.');
      handleFirestoreError(error, OperationType.LIST, 'reservations');
    });

    // Fetch users for reference
    const fetchUsers = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, 'users'));
        const userMap: Record<string, any> = {};
        userSnapshot.forEach(doc => {
          userMap[doc.id] = doc.data();
        });
        setUsers(userMap);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();

    return () => unsubscribe();
  }, [user]);

  if (!user || user.email?.toLowerCase() !== 'asifsafwan43@gmail.com') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center text-white pt-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 max-w-md w-full"
        >
          <LayoutDashboard className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">This area is reserved for administrators only.</p>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors"
          >
            Return to Site
          </button>
        </motion.div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reservations', id));
      setDeletingId(null);
    } catch (err) {
      setErrorVisible('Delete failed: Missing or insufficient permissions.');
      handleFirestoreError(err, OperationType.DELETE, `reservations/${id}`);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'reservations', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setErrorVisible('Status update failed: Missing or insufficient permissions.');
      handleFirestoreError(err, OperationType.UPDATE, `reservations/${id}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'reservations', editingId), {
          ...formData,
          status: formData.status,
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'reservations'), {
          ...formData,
          createdAt: serverTimestamp()
        });
        setIsAdding(false);
      }
      setFormData({ fullName: '', phone: '', guests: 2, date: '', time: '', notes: '', userId: user.uid, status: 'pending' });
    } catch (err) {
      setErrorVisible('Save failed: Missing or insufficient permissions.');
      handleFirestoreError(err, OperationType.WRITE, 'reservations');
    }
  };

  const handleEdit = (res: Reservation) => {
    setFormData({
      fullName: res.fullName,
      phone: res.phone,
      guests: res.guests,
      date: res.date,
      time: res.time,
      notes: res.notes || '',
      userId: res.userId,
      status: res.status || 'pending'
    });
    setEditingId(res.id || null);
  };

  const filteredReservations = reservations.filter(res => 
    res.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.phone.includes(searchTerm) ||
    res.date.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6 pb-8 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user.displayName || user.email}</p>
        </div>
        <AnimatePresence>
          {errorVisible && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-red-500/20 border border-red-500/50 text-red-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <X size={16} />
              {errorVisible}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center flex-wrap gap-3">
          <button 
            onClick={() => {
              setEditingId(null);
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            New Reservation
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            <ExternalLink size={20} />
            View Site
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Reservations</h3>
            <p className="text-3xl font-bold text-white">{reservations.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Upcoming Today</h3>
            <p className="text-3xl font-bold text-amber-500">
              {reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-gray-400 font-medium text-sm">Customer</th>
                    <th className="px-6 py-4 text-gray-400 font-medium text-sm">Guests</th>
                    <th className="px-6 py-4 text-gray-400 font-medium text-sm">Schedule</th>
                    <th className="px-6 py-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="px-6 py-4 text-gray-400 font-medium text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredReservations.map((res) => (
                      <motion.tr 
                        key={res.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{res.fullName}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                            <Phone size={12} /> {res.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <Users size={16} className="text-amber-500" />
                            {res.guests} People
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <Calendar size={16} className="text-amber-500" />
                            {res.date}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <Clock size={16} />
                            {res.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            res.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 
                            res.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {res.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {res.status !== 'confirmed' && (
                              <button 
                                onClick={() => handleStatusUpdate(res.id!, 'confirmed')}
                                className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                title="Confirm"
                              >
                                <Check size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleEdit(res)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => setDeletingId(res.id!)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredReservations.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        No reservations found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#1A1F2C] border border-white/10 w-full max-w-lg rounded-3xl p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {editingId ? 'Edit Reservation' : 'New Reservation'}
                </h2>
                <button 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter customer name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Date</label>
                    <input 
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Time</label>
                    <input 
                      required
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Number of Guests</label>
                  <div className="flex items-center gap-4">
                    {[1, 2, 4, 6, 8, 10].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setFormData({...formData, guests: n})}
                        className={`flex-1 py-3 rounded-xl border ${formData.guests === n ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Notes</label>
                  <textarea 
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any special requests?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors mt-4"
                >
                  {editingId ? 'Save Changes' : 'Create Reservation'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-[#1A1F2C] border border-white/10 w-full max-w-sm rounded-[32px] p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-red-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Are you sure?</h3>
              <p className="text-gray-400 mb-8">This will permanently delete this reservation record. This action cannot be undone.</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(deletingId)}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors"
                >
                  Yes, Delete It
                </button>
                <button 
                  onClick={() => setDeletingId(null)}
                  className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
