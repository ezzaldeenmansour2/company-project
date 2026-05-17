import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Shield, Loader2, CheckCircle } from 'lucide-react';
import api from '../services/api';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultRole: 'student' | 'instructor';
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSuccess, defaultRole }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: defaultRole
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/register', { ...formData, password_confirmation: formData.password });
      onSuccess();
      onClose();
      setFormData({ name: '', email: '', password: '', role: defaultRole });
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في إضافة المستخدم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
          >
            <button onClick={onClose} className="absolute left-6 top-6 p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${defaultRole === 'student' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-purple-500/10 text-purple-500'}`}>
                <User size={32} />
              </div>
              <h2 className="text-2xl font-black text-white">إضافة {defaultRole === 'student' ? 'طالب جديد' : 'مدرب جديد'}</h2>
              <p className="text-sm text-zinc-500 mt-2">قم بملء البيانات لإنشاء حساب جديد في المنصة</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 mr-2">الاسم الكامل</label>
                <div className="relative group">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
                    placeholder="أدخل الاسم..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 mr-2">البريد الإلكتروني</label>
                <div className="relative group">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 mr-2">كلمة المرور المؤقتة</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="password" required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 mt-4 ${
                  defaultRole === 'student' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' 
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                تأكيد الإضافة
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddUserModal;
