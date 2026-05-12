import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Calendar,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import api from '../services/api';

interface AnalyticsData {
  stats: {
    total_students: number;
    total_instructors: number;
    total_courses: number;
    total_enrollments: number;
    total_revenue: number;
  };
  growth: Array<{ month: string; count: number }>;
  recent_activity: Array<any>;
}

const Reports: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
      <p className="text-gray-400">جاري تحليل البيانات...</p>
    </div>
  );

  if (!data) return <div className="p-20 text-center text-white font-bold">فشل في تحميل البيانات</div>;

  const statsCards = [
    { title: 'إجمالي الطلاب', value: data.stats.total_students, icon: Users, color: 'blue', trend: '+12%' },
    { title: 'الدورات النشطة', value: data.stats.total_courses, icon: BookOpen, color: 'purple', trend: '+5%' },
    { title: 'إجمالي الاشتراكات', value: data.stats.total_enrollments, icon: TrendingUp, color: 'emerald', trend: '+18%' },
    { title: 'صافي الأرباح', value: `${data.stats.total_revenue} $`, icon: DollarSign, color: 'amber', trend: '+22%' },
  ];

  return (
    <div className="p-8 text-white max-w-[1600px] mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black flex items-center gap-4">
          <BarChart3 className="text-blue-500" size={36} />
          التقارير والإحصائيات
        </h1>
        <p className="text-gray-400 mt-2">نظرة شاملة على أداء المنصة ونموها</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/[0.08] transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl bg-${card.color}-500/10 text-${card.color}-500 group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} />
                {card.trend}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-bold">{card.title}</p>
            <h2 className="text-3xl font-black mt-1">{card.value}</h2>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">نمو الاشتراكات</h3>
              <p className="text-xs text-gray-500 mt-1">تطور عدد المسجلين خلال الأشهر الستة الماضية</p>
            </div>
            <Activity className="text-blue-500" size={20} />
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.growth}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '1rem' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">النشاط الأخير</h3>
            <Calendar className="text-purple-500" size={20} />
          </div>

          <div className="space-y-6">
            {data.recent_activity.length === 0 ? (
              <p className="text-center text-gray-600 italic py-10">لا يوجد نشاط مسجل مؤخراً.</p>
            ) : (
              data.recent_activity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">
                    {activity.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      <span className="text-blue-400">{activity.user?.name}</span> اشترك في دورة <span className="text-purple-400">{activity.course?.title}</span>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono">
                      {new Date(activity.created_at).toLocaleString('ar-EG')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all">
            عرض كافة السجلات
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
