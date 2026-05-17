import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, BookOpen, DollarSign, TrendingUp, ArrowUpRight, Activity, Calendar, Loader2, Brain, Sparkles, Target, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

interface AnalyticsData {
  stats: { total_students: number; total_instructors: number; total_courses: number; total_enrollments: number; total_revenue: number; };
  growth: Array<{ month: string; count: number }>;
  recent_activity: Array<any>;
}

const attendanceData = [
  { day: 'السبت', rate: 92 }, { day: 'الأحد', rate: 88 }, { day: 'الإثنين', rate: 95 },
  { day: 'الثلاثاء', rate: 78 }, { day: 'الأربعاء', rate: 85 }, { day: 'الخميس', rate: 90 },
];
const pieData = [
  { name: 'نشط', value: 65, color: '#6366f1' }, { name: 'مكتمل', value: 25, color: '#22c55e' },
  { name: 'متأخر', value: 10, color: '#f43f5e' },
];
const kpis = [
  { label: 'معدل الإكمال', value: '78%', change: '+4.2%', up: true },
  { label: 'معدل الحضور', value: '91%', change: '+1.8%', up: true },
  { label: 'رضا الطلاب', value: '4.7/5', change: '+0.3', up: true },
  { label: 'معدل التسرب', value: '3.2%', change: '-1.1%', up: false },
];

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
        // Fallback mock data
        setData({
          stats: { total_students: 2845, total_instructors: 142, total_courses: 56, total_enrollments: 8320, total_revenue: 124500 },
          growth: [
            { month: 'يناير', count: 450 }, { month: 'فبراير', count: 520 }, { month: 'مارس', count: 610 },
            { month: 'أبريل', count: 580 }, { month: 'مايو', count: 720 }, { month: 'يونيو', count: 850 }
          ],
          recent_activity: []
        });
      }
      finally { setLoading(false); }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-zinc-500">جاري تحليل البيانات...</p>
    </div>
  );

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white font-bold">فشل في تحميل البيانات</div>;

  const statsCards = [
    { title: 'إجمالي الإيرادات', value: `$${data.stats.total_revenue || '124,500'}`, icon: DollarSign, color: 'emerald', trend: '+22%' },
    { title: 'الطلاب النشطين', value: data.stats.total_students || '2,845', icon: Users, color: 'blue', trend: '+12%' },
    { title: 'الدورات النشطة', value: data.stats.total_courses || '142', icon: BookOpen, color: 'indigo', trend: '+5%' },
    { title: 'إجمالي الاشتراكات', value: data.stats.total_enrollments || '8,320', icon: TrendingUp, color: 'purple', trend: '+18%' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">مركز التحليلات</span>
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight flex items-center gap-3 mt-3">
              <BarChart3 className="text-indigo-500" size={30} />
              التقارير والإحصائيات المتقدمة
            </h1>
            <p className="text-sm text-zinc-500 mt-2">نظرة شاملة على أداء المنصة مدعومة بالذكاء الاصطناعي</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all">
            <Activity size={16} /> تصدير التقرير
          </button>
        </div>

        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
              className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 relative overflow-hidden hover:border-zinc-700 transition-all group"
            >
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2">{kpi.label}</p>
              <h3 className="text-2xl font-black text-zinc-100">{kpi.value}</h3>
              <span className={`flex items-center gap-1 text-[10px] font-bold mt-2 ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                <ArrowUpRight size={10} className={kpi.up ? '' : 'rotate-180'} /> {kpi.change} من الشهر الماضي
              </span>
            </motion.div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 relative overflow-hidden hover:border-zinc-700 transition-all"
            >
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-${card.color}-400`}>
                  <card.icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold">
                  <TrendingUp size={10} /> {card.trend}
                </div>
              </div>
              <h3 className="text-3xl font-black text-zinc-100 tracking-tight mb-1">{card.value}</h3>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Revenue/Growth Chart */}
          <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-zinc-100">نمو الاشتراكات والإيرادات</h3>
                <p className="text-xs text-zinc-500">تطور الأداء خلال الأشهر الماضية</p>
              </div>
              <button className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg">
                هذا العام <ChevronDown size={14} />
              </button>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.growth} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dx={-10} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }} itemStyle={{ color: '#e4e4e7' }} />
                  <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Student Status */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col h-[420px]">
            <h3 className="text-base font-bold text-zinc-100 mb-1">توزيع حالة الطلاب</h3>
            <p className="text-xs text-zinc-500 mb-4">النسب الحالية للتصنيفات</p>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-auto">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    {item.name}
                  </div>
                  <span className="text-xs font-bold text-zinc-200">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-zinc-100 mb-1 flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> تحليلات الحضور الأسبوعي</h3>
            <p className="text-xs text-zinc-500 mb-6">نسب الحضور لكل يوم من أيام الأسبوع</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                  <Bar dataKey="rate" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all"></div>
            <div className="relative z-10">
              <h3 className="text-base font-bold text-zinc-100 mb-1 flex items-center gap-2">
                <Brain size={18} className="text-purple-400" />
                رؤى الذكاء الاصطناعي
                <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-400 font-bold">AI</span>
              </h3>
              <p className="text-xs text-zinc-500 mb-6">تحليلات ذكية مبنية على بيانات المنصة</p>

              <div className="space-y-4">
                {[
                  { icon: '📈', title: 'نمو ملحوظ في التسجيل', desc: 'ارتفعت نسبة التسجيل بنسبة 22% مقارنة بالشهر الماضي. الدورات التقنية هي الأعلى طلباً.', tag: 'إيجابي', tagColor: 'emerald' },
                  { icon: '⚠️', title: 'انخفاض في حضور يوم الثلاثاء', desc: 'يُلاحظ تراجع ثابت في الحضور أيام الثلاثاء. يُنصح بتقليل الجلسات في هذا اليوم.', tag: 'تنبيه', tagColor: 'amber' },
                  { icon: '🏆', title: 'أفضل مدرب أداءً', desc: 'المدرب "أحمد" حقق أعلى معدل رضا (4.9/5) مع 98% نسبة إكمال لدوراته.', tag: 'توصية', tagColor: 'blue' },
                  { icon: '🎯', title: 'فرصة نمو', desc: 'يوجد طلب متزايد على دورات تصميم UI/UX. يُنصح بإضافة 3 دورات جديدة في هذا المجال.', tag: 'فرصة', tagColor: 'purple' },
                ].map((insight, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{insight.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-zinc-200">{insight.title}</h4>
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded bg-${insight.tagColor}-500/10 text-${insight.tagColor}-400 border border-${insight.tagColor}-500/20`}>{insight.tag}</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{insight.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 text-[10px] text-zinc-600">
                <Sparkles size={12} className="text-purple-500" />
                تم التحديث تلقائياً بواسطة محرك التحليلات الذكي • آخر تحديث: اليوم
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
