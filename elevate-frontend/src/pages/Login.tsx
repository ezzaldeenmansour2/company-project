import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Smartphone, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../services/api';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    device_uuid: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password, device_uuid: formData.device_uuid }
        : { ...formData, role };

      const response = await api.post(endpoint, payload);
      
      const { access_token, user } = response.data;
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      alert(isLogin ? 'تم تسجيل الدخول بنجاح!' : 'تم إنشاء الحساب بنجاح!');
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30"
          >
            <LogIn className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Elevate LMS</h1>
          <p className="text-gray-400 text-sm">ارتقِ بتجربتك التعليمية إلى آفاق جديدة</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            دخول
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            تسجيل جديد
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="الاسم الكامل"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="البريد الإلكتروني"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="كلمة المرور"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                required
                value={formData.password_confirmation}
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                placeholder="تأكيد كلمة المرور"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
          )}

          {(!isLogin || (isLogin && role === 'student')) && (
            <div className="space-y-4">
              {!isLogin && (
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex-1 py-2 rounded-xl border transition-all text-xs ${role === 'student' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-white/10 text-gray-500'}`}
                  >
                    طالب
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('instructor')}
                    className={`flex-1 py-2 rounded-xl border transition-all text-xs ${role === 'instructor' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'border-white/10 text-gray-500'}`}
                  >
                    مدرب
                  </button>
                </div>
              )}

              {(role === 'student' || isLogin) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="relative"
                >
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input 
                    type="text" 
                    required={role === 'student'}
                    value={formData.device_uuid}
                    onChange={(e) => setFormData({...formData, device_uuid: e.target.value})}
                    placeholder="مُعرّف الجهاز (UUID)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 mr-1">ارتباط الحساب بالجهاز إلزامي للطالب.</p>
                </motion.div>
              )}
            </div>
          )}

          <motion.button 
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl mt-6 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500 text-[10px]">
            بإكمال العملية، أنت توافق على <span className="text-gray-300 underline cursor-pointer">شروط الخدمة</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
