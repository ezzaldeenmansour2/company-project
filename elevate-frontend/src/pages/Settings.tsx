import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, Save, Loader2, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', password: '', password_confirmation: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error('Failed to fetch profile');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const res = await api.put('/profile', profile);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess('تم تحديث الملف الشخصي بنجاح');
    } catch (err) {
      console.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await api.put('/profile/password', passwordData);
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
      setSuccess('تم تغيير كلمة المرور بنجاح');
    } catch (err) {
      console.error('Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black flex items-center gap-4">
          <SettingsIcon className="text-blue-500" size={36} />
          إعدادات الحساب
        </h1>
        <p className="text-gray-400 mt-2">إدارة بياناتك الشخصية وتفضيلات الأمان</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {[
            { id: 'profile', label: 'الملف الشخصي', icon: User },
            { id: 'security', label: 'الأمان والخصوصية', icon: Lock },
            { id: 'notifications', label: 'التنبيهات', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.form
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleUpdateProfile}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">المعلومات الأساسية</h3>
                    <p className="text-xs text-gray-500">سيتم عرض هذا الاسم لزملائك ومدربيك</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold ml-2">الاسم الكامل</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold ml-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  حفظ التغييرات
                </button>
              </motion.form>
            )}

            {activeTab === 'security' && (
              <motion.form
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleUpdatePassword}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-red-500/20 flex items-center justify-center text-red-400">
                    <Shield size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold">تغيير كلمة المرور</h3>
                    <p className="text-xs text-gray-500">تأكد من استخدام كلمة مرور قوية ومعقدة</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold ml-2">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold ml-2">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-bold ml-2">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-red-600/20 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                  تحديث كلمة المرور
                </button>
              </motion.form>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="py-20 text-center"
              >
                <Bell size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                <p className="text-gray-500 italic">إعدادات التنبيهات ستتوفر قريباً.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex items-center gap-2 text-emerald-500 text-sm font-bold bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/10"
              >
                <CheckCircle size={18} />
                {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;
