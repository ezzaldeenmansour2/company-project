import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BookOpen, Loader2, Plus, QrCode, FileText, MessageSquare, 
  Clock, CheckCircle2, Calendar, ChevronRight, X, Search, Bell, 
  ArrowUpRight, Target, Zap, BarChart3, Users2, Brain, Activity,
  Filter, MoreHorizontal, Mail, ShieldCheck, PieChart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart as RePieChart, Pie 
} from 'recharts';
import api from '../../services/api';
import CreateCourseModal from '../../components/CreateCourseModal';
import AttendanceManager from '../../components/AttendanceManager';

// --- Mock Data & Constants ---
const analyticsData = [
  { name: 'Sat', attendance: 85, engagement: 65 },
  { name: 'Sun', attendance: 70, engagement: 75 },
  { name: 'Mon', attendance: 95, engagement: 90 },
  { name: 'Tue', attendance: 60, engagement: 50 },
  { name: 'Wed', attendance: 88, engagement: 82 },
  { name: 'Thu', attendance: 92, engagement: 88 },
  { name: 'Fri', attendance: 75, engagement: 70 },
];

const studentDistribution = [
  { name: 'Active', value: 450, color: '#6366f1' },
  { name: 'At Risk', value: 80, color: '#f43f5e' },
  { name: 'Graduated', value: 300, color: '#10b981' },
];

// --- Sub-Components ---

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 rounded-full blur-3xl`}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 bg-${color}-500/10 text-${color}-400 rounded-2xl`}>
        <Icon size={24} />
      </div>
      <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
        {trend}
      </span>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</p>
    </div>
  </motion.div>
);

const InstructorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students' | 'attendance' | 'analytics'>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedCourseForQR, setSelectedCourseForQR] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/my-courses');
      setData({ courses: res.data });
    } catch (err) {
      console.error('Failed to fetch instructor data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !data) return (
    <div className="flex-1 h-screen flex items-center justify-center bg-[#09090b]">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <h1 className="text-lg font-bold text-white hidden sm:block">منصة المدرب الذكية</h1>
            </div>
            <div className="h-8 w-px bg-zinc-800 hidden lg:block"></div>
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'نظرة عامة', icon: Activity },
                { id: 'courses', label: 'دوراتي', icon: BookOpen },
                { id: 'students', label: 'طلابي', icon: Users },
                { id: 'attendance', label: 'الحضور الذكي', icon: QrCode },
                { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 lg:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="بحث في الدورات..."
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2 pr-10 pl-4 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button className="relative p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 text-zinc-400">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#09090b]"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2 tracking-tight">مرحباً بك مجدداً، أستاذ 👋</h2>
                  <p className="text-zinc-500 text-sm">إليك ملخص للأداء التعليمي والنشاط الحالي في دوراتك.</p>
                </div>
                <div className="flex gap-3">
                   <button 
                    onClick={() => setIsCourseModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20"
                  >
                    <Plus size={20} />
                    إنشاء دورة جديدة
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="إجمالي الطلاب" value="1,248" icon={Users2} color="indigo" trend="+12.5%" />
                <StatCard label="نسبة الحضور" value="94.2%" icon={Target} color="emerald" trend="+5.2%" />
                <StatCard label="معدل التفاعل" value="88%" icon={Zap} color="amber" trend="+8.1%" />
                <StatCard label="دورات فعالة" value={data?.courses?.length || 0} icon={BookOpen} color="purple" trend="0%" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col h-[400px]">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold">تحليلات التفاعل والحضور</h3>
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>حضور</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div>تفاعل</div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData}>
                        <defs>
                          <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                        <Area type="monotone" dataKey="engagement" stroke="#a855f7" strokeWidth={3} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col h-[400px]">
                  <h3 className="text-lg font-bold mb-8">توزيع حالات الطلاب</h3>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <RePieChart>
                        <Pie data={studentDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {studentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="w-full mt-8 space-y-3">
                      {studentDistribution.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-2 text-zinc-400">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            {item.name}
                          </span>
                          <span className="font-bold">{item.value} طالب</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div 
              key="courses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {data?.courses?.map((course: any, idx: number) => (
                <div key={idx} className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-6 hover:border-indigo-500/50 transition-all">
                  <div className="aspect-video bg-zinc-800 rounded-2xl mb-6 overflow-hidden relative">
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">نشط</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2">{course.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-8">
                    <span className="flex items-center gap-1.5"><Users size={14} /> 42 طالب</span>
                    <span className="flex items-center gap-1.5"><Activity size={14} /> 85% حضور</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                      إدارة المحتوى <ArrowUpRight size={14} />
                    </button>
                    <button 
                      onClick={() => { setSelectedCourseForQR(course.id); setIsQRModalOpen(true); }}
                      className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <QrCode size={18} />
                    </button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setIsCourseModalOpen(true)}
                className="group border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-zinc-500 hover:text-indigo-400 h-full min-h-[300px]"
              >
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={32} />
                </div>
                <p className="font-bold">إضافة دورة جديدة</p>
              </button>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div 
              key="students"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] overflow-hidden"
            >
              <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-xl font-bold">قائمة الطلاب المسجلين</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"><Filter size={18} /></button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20">تصدير التقرير</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                      <th className="px-8 py-4 font-medium">الطالب</th>
                      <th className="px-8 py-4 font-medium">الدورة</th>
                      <th className="px-8 py-4 font-medium">الحضور</th>
                      <th className="px-8 py-4 font-medium">المعدل</th>
                      <th className="px-8 py-4 font-medium">الحالة</th>
                      <th className="px-8 py-4 font-medium text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {[1,2,3,4,5].map((s) => (
                      <tr key={s} className="hover:bg-zinc-800/20 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold">أ</div>
                            <div>
                              <p className="text-sm font-bold">أحمد محمود</p>
                              <p className="text-[10px] text-zinc-500">ahmed@example.com</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm">تطوير الويب</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-[10px] font-bold">85%</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-mono font-bold text-indigo-400">92/100</td>
                        <td className="px-8 py-5">
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20">متفوق</span>
                        </td>
                        <td className="px-8 py-5 text-left">
                          <button className="text-zinc-600 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'attendance' && (
            <motion.div 
              key="attendance"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[3rem] p-12 text-center space-y-8">
                <div className="w-24 h-24 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black">نظام الحضور الذكي المتكامل</h2>
                  <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">
                    قم بتوليد رمز QR ديناميكي لطلابك. بمجرد المسح، سيتم تسجيل حضور الطالب تلقائياً وتحديث القائمة أمامك في الوقت الفعلي.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-8">
                   {data?.courses?.map((course: any, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => { setSelectedCourseForQR(course.id); setIsQRModalOpen(true); }}
                        className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl hover:border-indigo-500 transition-all flex items-center justify-between group"
                      >
                        <div className="text-right">
                          <p className="text-xs text-zinc-500 mb-1">فتح جلسة لـ</p>
                          <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{course.title}</p>
                        </div>
                        <QrCode className="text-zinc-600 group-hover:text-indigo-400" size={24} />
                      </button>
                   ))}
                </div>

                <div className="pt-8 border-t border-zinc-800/50 flex justify-center gap-12">
                   <div className="text-center">
                      <p className="text-2xl font-black text-white">450</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">إجمالي الحاضرين اليوم</p>
                   </div>
                   <div className="text-center">
                      <p className="text-2xl font-black text-emerald-400">92%</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">معدل الالتزام العام</p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                     <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8 h-[450px]">
                        <h3 className="text-lg font-bold mb-8">الأداء الأكاديمي التفصيلي</h3>
                        <ResponsiveContainer width="100%" height="80%">
                           <BarChart data={analyticsData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                              <YAxis hide />
                              <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                              <Bar dataKey="attendance" fill="#6366f1" radius={[6, 6, 0, 0]} />
                              <Bar dataKey="engagement" fill="#a855f7" radius={[6, 6, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-110 transition-transform"><Brain size={120} /></div>
                           <h4 className="text-xl font-bold mb-4">ذكاء اصطناعي (Insights)</h4>
                           <p className="text-sm text-indigo-100/70 mb-6 leading-relaxed">
                              يشير التحليل الحالي إلى أن الطلاب في "دورة React" يحتاجون لمراجعة مفاهيم الـ Hooks قبل الاختبار القادم.
                           </p>
                           <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold">عرض التوصيات</button>
                        </div>
                        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8">
                           <h4 className="text-lg font-bold mb-4">تفاعل المنتدى</h4>
                           <div className="space-y-4">
                              {[
                                { user: 'سارة خالد', text: 'سؤال حول Redux Toolkit...', time: '5د' },
                                { user: 'ياسين علي', text: 'شكراً جزيلاً على الشرح!', time: '12د' },
                              ].map((msg, i) => (
                                <div key={i} className="flex gap-3 text-xs">
                                   <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold">{msg.user[0]}</div>
                                   <div>
                                      <p className="font-bold">{msg.user}</p>
                                      <p className="text-zinc-500">{msg.text}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8">
                     <h3 className="text-lg font-bold mb-6">الجدول الزمني للحصص</h3>
                     <div className="space-y-6">
                        {[
                          { time: '09:00 AM', title: 'أساسيات JavaScript', status: 'done' },
                          { time: '11:30 AM', title: 'مراجعة التصاميم', status: 'current' },
                          { time: '02:00 PM', title: 'ورشة عمل React', status: 'upcoming' },
                          { time: '04:30 PM', title: 'اجتماع الفريق', status: 'upcoming' },
                        ].map((event, i) => (
                          <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1 before:h-full before:bg-zinc-800 last:before:hidden">
                             <div className={`absolute left-[-4px] top-1.5 w-3 h-3 rounded-full border-2 border-[#09090b] ${
                               event.status === 'done' ? 'bg-emerald-500' : 
                               event.status === 'current' ? 'bg-indigo-500' : 'bg-zinc-700'
                             }`}></div>
                             <p className="text-[10px] text-zinc-500 font-mono mb-1">{event.time}</p>
                             <p className={`text-sm font-bold ${event.status === 'current' ? 'text-indigo-400' : 'text-zinc-200'}`}>{event.title}</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <CreateCourseModal 
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSuccess={fetchData}
      />

      <AnimatePresence>
        {isQRModalOpen && selectedCourseForQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setIsQRModalOpen(false)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-zinc-900 border border-zinc-800 rounded-[3.5rem] p-10 max-w-2xl w-full relative z-10 shadow-3xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
              <button 
                onClick={() => setIsQRModalOpen(false)}
                className="absolute top-8 left-8 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
              
              <div className="mt-4">
                 <AttendanceManager courseId={selectedCourseForQR} />
              </div>

              {/* Real-time Indicator */}
              <div className="mt-8 flex items-center justify-center gap-3 py-3 px-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">بث مباشر لنظام الحضور</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstructorDashboard;

