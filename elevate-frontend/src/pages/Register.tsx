import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Smartphone, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    device_uuid: 'UUID-' + Math.random().toString(36).substr(2, 9).toUpperCase() // Simulation
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل عملية التسجيل. يرجى التحقق من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-arabic" dir="rtl">
      <ThemeToggle />
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-[3rem] p-10 relative z-10 shadow-2xl shadow-black/50"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30">
            <GraduationCap className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">إنشاء حساب جديد</h1>
          <p className="text-gray-400">انضم إلى Elevate وابدأ رحلتك التعليمية اليوم</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 mr-4">الاسم الكامل</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="أدخل اسمك الكامل"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 mr-4">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="example@mail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 mr-4">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 mr-4">تأكيد كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3">
            <Smartphone className="text-blue-400" size={24} />
            <div>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">تحقق أمان الجهاز</p>
              <p className="text-xs text-gray-400">سيتم ربط حسابك تلقائياً بهذا الجهاز الحالي.</p>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-2"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all mt-8 group"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={24} />}
            إنشاء الحساب الآن
            <ArrowRight className="group-hover:translate-x-[-5px] transition-transform" size={20} />
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          لديك حساب بالفعل؟ <Link to="/login" className="text-blue-500 font-bold hover:underline">سجل دخولك من هنا</Link>
        </p>
      </motion.div>
    </div>
  );
};

// Re-using icon from lucide
const GraduationCap = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
  </svg>
);

export default Register;
