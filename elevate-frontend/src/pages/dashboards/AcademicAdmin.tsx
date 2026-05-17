import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Search, 
  Bell, 
  Loader2, 
  ArrowRight,
  ClipboardList,
  AlertCircle,
  BarChart,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AcademicAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch academic data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex-1 h-full flex items-center justify-center bg-[#0f172a]">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-[#0f172a] min-h-screen text-white w-full overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
              الإدارة الأكاديمية
            </span>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">إدارة العملية التعليمية 👋</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            متابعة دقيقة للتسجيلات، المتطلبات الأكاديمية، وأداء الطلاب لضمان جودة التعليم.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
           <button 
            onClick={() => navigate('/requirements')}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 text-sm"
          >
            <ClipboardList size={18} />
            إدارة المتطلبات
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'طلبات التسجيل', value: '24', icon: UserCheck, color: 'blue', desc: 'بانتظار المراجعة' },
          { label: 'نسبة النجاح', value: '92%', icon: BarChart, color: 'emerald', desc: 'المتوسط العام' },
          { label: 'الطلاب النشطون', value: data?.stats.total_students || 0, icon: GraduationCap, color: 'purple', desc: 'في جميع الدورات' },
          { label: 'الدورات المراقبة', value: data?.stats.total_courses || 0, icon: BookOpen, color: 'orange', desc: 'تحت الإشراف' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/[0.07] transition-all relative overflow-hidden group">
             <div className="flex justify-between items-center mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
                  <stat.icon size={24} />
                </div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             </div>
             <p className="text-gray-500 text-xs font-medium mb-1">{stat.label}</p>
             <h3 className="text-2xl font-black mb-2">{stat.value}</h3>
             <p className="text-[10px] text-gray-500 font-mono italic">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Performance Monitoring */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
           <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">متابعة الأداء الأكاديمي</h3>
            <div className="flex gap-2">
               <button className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] rounded-lg border border-blue-500/20">الأسبوعي</button>
               <button className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] rounded-lg">الشهري</button>
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-5 bg-white/5 rounded-[2rem] hover:bg-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-lg font-black text-gray-400">
                      {i === 1 ? '🎨' : i === 2 ? '💻' : '📊'}
                   </div>
                   <div>
                      <h4 className="text-sm font-bold">دورة {i === 1 ? 'التصميم الجرافيكي' : i === 2 ? 'برمجة بايثون' : 'إدارة الأعمال'}</h4>
                      <p className="text-[10px] text-gray-500 mt-1">المحاضر: د. أحمد خالد</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-10">
                   <div className="text-right">
                      <p className="text-[10px] text-gray-500 mb-1">نسبة الحضور</p>
                      <div className="flex items-center gap-2">
                         <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: i === 1 ? '95%' : i === 2 ? '82%' : '74%' }}></div>
                         </div>
                         <span className="text-xs font-bold">{i === 1 ? '95%' : i === 2 ? '82%' : '74%'}</span>
                      </div>
                   </div>
                   <button className="p-3 bg-white/5 rounded-xl text-gray-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Alerts */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
           <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <AlertCircle className="text-red-400" size={20} />
              تنبيهات أكاديمية
            </h3>
            
            <div className="space-y-4">
              {[
                { title: 'غياب متكرر (5 طلاب)', desc: 'دورة هندسة البرمجيات', priority: 'high' },
                { title: 'تأخر في تسليم التكاليف', desc: 'دورة الأمن السيبراني', priority: 'medium' },
                { title: 'طلبات استثناء جديدة (3)', desc: 'بانتظار المراجعة الأكاديمية', priority: 'low' },
              ].map((alert, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-2xl border-r-4 border-r-white/10 hover:bg-white/10 transition-all cursor-pointer">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-bold">{alert.title}</h4>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        alert.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        alert.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.priority}
                      </span>
                   </div>
                   <p className="text-[10px] text-gray-500">{alert.desc}</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/academic-alerts')}
              className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all"
            >
               عرض كل التنبيهات الأكاديمية
            </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicAdminDashboard;
