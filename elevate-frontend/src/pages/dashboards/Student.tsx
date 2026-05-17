import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Loader2, 
  Play,
  CheckCircle2,
  Clock,
  Trophy,
  Star,
  ChevronRight,
  Search,
  Zap,
  Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/my-courses');
        setData({ myCourses: res.data });
      } catch (err) {
        console.error('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex-1 h-full flex items-center justify-center bg-[#0f172a]">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-[#0f172a] min-h-screen text-white w-full overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20 uppercase tracking-widest">
              بوابة الطالب
            </span>
            <div className="flex items-center gap-1 text-yellow-400 text-[10px] font-medium">
              <Star size={12} fill="currentColor" />
              أنت متألق اليوم! واصل التقدم
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">أهلاً بك، بطل المستقبل 👋</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            رحلتك التعليمية مستمرة. أكمل من حيث توقفت وحقق أهدافك التعليمية اليوم.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-4 h-4" />
            <input 
              type="text" 
              placeholder="ابحث عن درس جديد..."
              className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-48 md:w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-xs shadow-lg shadow-blue-600/20"
          >
            <Zap size={16} />
            التحاق بدورة
          </button>
        </div>
      </header>

      {/* Hero Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-y-20 translate-x-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-[8px] border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-black">68%</p>
                  <p className="text-[10px] text-gray-400 uppercase">معدل الإنجاز</p>
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="76" fill="transparent" stroke="url(#blueGrad)" strokeWidth="8" strokeDasharray="477" strokeDashoffset="152" strokeLinecap="round" />
                <defs><linearGradient id="blueGrad"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
              </svg>
            </div>
            
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-2xl font-bold mb-3">آخر دورة تابعتها</h3>
              <p className="text-blue-400 font-bold text-lg mb-6">أساسيات تصميم واجهات المستخدم (UI/UX)</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-end mb-8">
                <div className="flex items-center gap-2 text-xs text-gray-400"><Clock size={14} /> تبقى 4 ساعات</div>
                <div className="flex items-center gap-2 text-xs text-gray-400"><Layout size={14} /> 12 درس متبقي</div>
              </div>
              <button 
                onClick={() => {
                  if (data?.myCourses?.length > 0) {
                    navigate(`/course/${data.myCourses[0].id}`);
                  }
                }}
                className="px-8 py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 text-sm shadow-xl group/btn"
              >
                مواصلة التعلم الآن
                <Play size={18} className="group-hover/btn:scale-125 transition-transform" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-600/10"></div>
          <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-3xl flex items-center justify-center mb-6 relative z-10">
            <Trophy size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2 relative z-10">أفضل الإنجازات</h3>
          <p className="text-gray-500 text-xs mb-8 relative z-10">لقد حصلت على 4 أوسمة هذا الشهر!</p>
          <div className="flex gap-2 relative z-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                <Star size={16} className="text-yellow-500/50" />
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/my-certificates')}
            className="mt-8 text-blue-400 text-xs font-bold hover:underline relative z-10"
          >
            مشاهدة كل الإنجازات
          </button>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">دوراتي المسجلة</h3>
          <button onClick={() => navigate('/courses')} className="text-blue-400 text-xs hover:underline">مشاهدة الكل</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.myCourses?.map((course: any, idx: number) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/course/${course.id}`)}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-5 hover:bg-white/[0.08] transition-all group cursor-pointer"
            >
              <div className="aspect-video w-full bg-white/5 rounded-2xl mb-4 overflow-hidden relative">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <BookOpen size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                      <Play size={18} fill="currentColor" />
                   </div>
                </div>
              </div>
              <h4 className="text-sm font-bold mb-3 line-clamp-1">{course.title}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>التقدم</span>
                  <span>45%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Add Course Card */}
          <button 
            onClick={() => navigate('/courses')}
            className="border-2 border-dashed border-white/10 rounded-[2rem] p-5 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-blue-500/50 hover:text-blue-400 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-all">
              <BookOpen size={24} />
            </div>
            <span className="text-xs font-bold">استكشف دورات جديدة</span>
          </button>
        </div>
      </div>

      {/* Task Reminders */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle2 className="text-emerald-400" size={24} />
          <h3 className="text-xl font-bold">مهام قادمة</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'تسليم مشروع الـ Figma', course: 'UI/UX Design', due: 'غداً', color: 'blue' },
            { title: 'اختبار نصف الفصل', course: 'React Framework', due: 'بعد يومين', color: 'purple' },
            { title: 'حل تكليفات الـ CSS', course: 'Web Basics', due: 'اليوم', color: 'orange' },
          ].map((task, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-${task.color}-500/10 text-${task.color}-400 flex items-center justify-center shrink-0`}>
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{task.title}</h4>
                <p className="text-[10px] text-gray-500">{task.course} • <span className="text-red-400 font-bold">{task.due}</span></p>
              </div>
              <ChevronRight className="ml-auto text-gray-700 group-hover:text-white transition-colors" size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
