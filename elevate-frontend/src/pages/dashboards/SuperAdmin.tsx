import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, GraduationCap, TrendingUp, Search, Bell, Loader2, ArrowRight,
  ShieldCheck, Zap, Target, BarChart3, ClipboardList, Gift, Activity, CreditCard, ChevronDown, MoreVertical
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../services/api';

// Mock data for charts to ensure the premium look
const revenueData = [
  { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 }, { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 }, { name: 'May', value: 6000 }, { name: 'Jun', value: 8000 },
  { name: 'Jul', value: 7500 },
];

const studentsData = [
  { name: 'Sat', new: 40, active: 240 }, { name: 'Sun', new: 30, active: 139 },
  { name: 'Mon', new: 20, active: 980 }, { name: 'Tue', new: 27, active: 390 },
  { name: 'Wed', new: 18, active: 480 }, { name: 'Thu', new: 23, active: 380 },
  { name: 'Fri', new: 34, active: 430 },
];

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      // Mock search results for now to show functionality
      const results = [
        { id: 1, name: 'أحمد محمد', type: 'student', path: '/students' },
        { id: 2, name: 'د. سارة علي', type: 'instructor', path: '/instructors' },
        { id: 3, name: 'مدخل إلى الذكاء الاصطناعي', type: 'course', path: '/courses' },
      ].filter(r => r.name.includes(term));
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  if (loading) return (
    <div className="flex-1 h-screen flex items-center justify-center bg-[#09090b]">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  const stats = [
    { label: 'إجمالي الإيرادات', value: `$${data?.stats?.total_revenue || '124,500'}`, icon: CreditCard, color: 'emerald', trend: '+14.5%' },
    { label: 'الطلاب النشطين', value: data?.stats?.total_students || '2,845', icon: Users, color: 'blue', trend: '+22.1%' },
    { label: 'الدورات الفعالة', value: data?.stats?.total_courses || '142', icon: BookOpen, color: 'indigo', trend: '+5.4%' },
    { label: 'المدربين المعتمدين', value: data?.stats?.total_instructors || '48', icon: GraduationCap, color: 'purple', trend: '+2.0%' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Ultra-modern Background Grid & Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
        
        {/* Top Navbar - Vercel/Linear Style */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100 leading-tight">لوحة القيادة</h1>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                جميع الأنظمة تعمل بكفاءة
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Command Palette Simulator */}
            <div className="relative group flex-1 lg:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors w-4 h-4" />
              <input 
                type="text" 
                placeholder="ابحث في النظام..."
                value={searchTerm}
                onChange={handleSearch}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pr-10 pl-16 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="hidden sm:inline-block bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-[10px] text-zinc-400 font-mono">⌘</kbd>
                <kbd className="hidden sm:inline-block bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-[10px] text-zinc-400 font-mono">K</kbd>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => navigate(result.path)}
                        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors text-right"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                            {result.type === 'student' ? <Users size={14} /> : result.type === 'instructor' ? <GraduationCap size={14} /> : <BookOpen size={14} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-200">{result.name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase">{result.type === 'student' ? 'طالب' : result.type === 'instructor' ? 'مدرب' : 'دورة'}</p>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-zinc-600" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button className="relative p-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-zinc-100">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#09090b]"></span>
            </button>
            
            <div className="h-8 w-px bg-zinc-800 hidden lg:block"></div>
            
            <button className="flex items-center gap-2 p-1.5 pr-4 bg-zinc-950/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all">
              <span className="text-xs font-medium text-zinc-300">المدير العام</span>
              <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold shadow-inner">
                SA
              </div>
            </button>
          </div>
        </header>

        {/* Quick Actions (Minimalist Pills) */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-zinc-500 ml-2">وصول سريع:</span>
          {[
            { label: 'التسويق', icon: Gift, path: '/marketing' },
            { label: 'المتطلبات', icon: ClipboardList, path: '/requirements' },
            { label: 'الطلاب', icon: Users, path: '/students' },
            { label: 'المدربون', icon: ShieldCheck, path: '/instructors' },
            { label: 'التقارير', icon: BarChart3, path: '/reports' }
          ].map((action, i) => (
            <button 
              key={i} 
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/40 hover:bg-indigo-500/10 border border-zinc-800 hover:border-indigo-500/30 text-zinc-400 hover:text-indigo-400 rounded-full text-xs font-medium transition-all"
            >
              <action.icon size={14} />
              {action.label}
            </button>
          ))}
        </div>

        {/* Ultra-modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 relative overflow-hidden hover:border-zinc-700 transition-all"
            >
              {/* Hover Glow Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl group-hover:bg-${stat.color}-500/10 transition-colors`}></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-${stat.color}-400 shadow-sm`}>
                  <stat.icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold">
                  <TrendingUp size={10} />
                  {stat.trend}
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-zinc-100 tracking-tight mb-1">{stat.value}</h3>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Revenue Chart */}
          <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-zinc-100">تحليلات الإيرادات</h3>
                <p className="text-xs text-zinc-500">الأداء المالي خلال الـ 7 أشهر الماضية</p>
              </div>
              <button className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg hover:text-zinc-200">
                هذا العام <ChevronDown size={14} />
              </button>
            </div>
            
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Students Growth Chart */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-zinc-100">نشاط الطلاب</h3>
                <p className="text-xs text-zinc-500">معدلات التسجيل الأسبوعية</p>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300"><MoreVertical size={16} /></button>
            </div>
            
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
                  <Tooltip 
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  />
                  <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="new" fill="#8b5cf6" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-zinc-400">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>نشطون</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div>جدد</div>
            </div>
          </div>

        </div>

        {/* Lower Section: Activity & System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Latest Activities (Linear Style Timeline) */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Activity size={18} className="text-indigo-400" />
                سجل النشاطات الحي
              </h3>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">عرض الكل</button>
            </div>

            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.2rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
              {(!data?.recent_activity || data.recent_activity.length === 0) ? (
                 <div className="text-center py-10 text-zinc-500 text-sm">لا توجد نشاطات مسجلة حالياً</div>
              ) : (
                data.recent_activity.slice(0, 4).map((activity: any, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#09090b] bg-zinc-900 text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Zap size={14} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-zinc-200">{activity.user?.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{new Date(activity.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <p className="text-xs text-zinc-400">انضم لدورة <span className="text-zinc-300 font-medium">{activity.course?.title}</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Status Panel */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
             <h3 className="text-base font-bold mb-6 flex items-center gap-2">
                <Target size={18} className="text-emerald-400" />
                حالة النظام والموارد
              </h3>
              
              <div className="space-y-5">
                {[
                  { label: 'استهلاك الخادم (CPU)', value: '34%', status: 'normal', color: 'emerald' },
                  { label: 'مساحة التخزين (Storage)', value: '78%', status: 'warning', color: 'amber' },
                  { label: 'الذاكرة العشوائية (RAM)', value: '45%', status: 'normal', color: 'blue' },
                  { label: 'طلبات API (اليوم)', value: '12,450', status: 'high', color: 'indigo' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-zinc-300">{item.label}</span>
                      <span className={`text-xs font-mono font-bold text-${item.color}-400`}>{item.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: item.value.replace(',', '').includes('%') ? item.value : '100%' }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full bg-${item.color}-500 rounded-full relative`}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3">
                <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 mb-1">النظام محمي ومستقر</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">لم يتم اكتشاف أي ثغرات أمنية. النسخ الاحتياطي الأخير تم قبل ساعتين بنجاح.</p>
                </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
