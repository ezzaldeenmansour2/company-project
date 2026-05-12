import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, TrendingUp, Search, Bell, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#0f172a]">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  const stats = [
    { label: 'إجمالي الطلاب', value: data?.stats.total_students || 0, icon: Users, color: 'blue', trend: '+12%' },
    { label: 'المدربون', value: data?.stats.total_instructors || 0, icon: GraduationCap, color: 'purple', trend: '+5%' },
    { label: 'الدورات الفعالة', value: data?.stats.total_courses || 0, icon: BookOpen, color: 'emerald', trend: '+18%' },
    { label: 'إجمالي الإيرادات', value: `$${data?.stats.total_revenue || 0}`, icon: TrendingUp, color: 'orange', trend: '+22%' },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#0f172a] min-h-screen text-white w-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-1">مرحباً بك، أيها المسؤول 👋</h1>
          <p className="text-gray-400 text-sm">إليك ملخص لما يحدث في Elevate اليوم.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="بحث عن أي شيء..."
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all relative">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/[0.07] transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon size={24} />
              </div>
              <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-bold mb-6">آخر النشاطات</h3>
          <div className="space-y-4">
            {!data?.recent_activity || data.recent_activity.length === 0 ? (
              <p className="text-center text-gray-500 py-10">لا توجد نشاطات مسجلة حالياً.</p>
            ) : (
              data.recent_activity.map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.08] transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      {activity.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">
                        <span className="text-blue-400">{activity.user?.name}</span> اشترك في <span className="text-purple-400">{activity.course?.title}</span>
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono">
                        {new Date(activity.created_at).toLocaleString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-gray-600" size={16} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-bold mb-6">توزيع الأدوار</h3>
          {/* Placeholder for a chart */}
          <div className="aspect-square bg-white/5 rounded-full border-8 border-blue-600/20 flex items-center justify-center relative">
            <div className="text-center">
              <p className="text-3xl font-bold">1.4k</p>
              <p className="text-xs text-gray-500">إجمالي المستخدمين</p>
            </div>
            <div className="absolute inset-0 border-8 border-t-blue-600 border-r-purple-600 border-b-transparent border-l-transparent rounded-full shadow-lg shadow-blue-600/20"></div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span> طلاب
              </span>
              <span>85%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span> مدربون
              </span>
              <span>12%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-600 rounded-full"></span> مسؤولون
              </span>
              <span>3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
