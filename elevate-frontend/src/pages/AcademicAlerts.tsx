import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  User, 
  BookOpen, 
  Calendar, 
  ArrowLeft,
  Mail,
  ShieldAlert,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Alert {
  id: number;
  student_name: string;
  course_title: string;
  type: 'absence' | 'performance';
  value: string;
  status: 'new' | 'addressed';
  created_at: string;
}

const AcademicAlerts: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is a mockup endpoint, in real life we'd calculate this or have an alerts table
    const fetchAlerts = async () => {
      try {
        // const res = await api.get('/admin/academic-alerts');
        // setAlerts(res.data);
        // Mock data for demo
        setAlerts([
          { id: 1, student_name: 'أحمد محمد', course_title: 'برمجة بايثون', type: 'absence', value: '30% غياب', status: 'new', created_at: new Date().toISOString() },
          { id: 2, student_name: 'سارة علي', course_title: 'الأمن السيبراني', type: 'performance', value: 'درجة 45%', status: 'new', created_at: new Date().toISOString() },
        ]);
      } catch (err) {
        console.error('Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="p-8 text-white max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        العودة للوحة الإدارة
      </button>

      <header className="mb-10">
        <h1 className="text-4xl font-black flex items-center gap-4">
          <ShieldAlert className="text-red-500" size={36} />
          التنبيهات الأكاديمية
        </h1>
        <p className="text-gray-400 mt-2">مراقبة الطلاب المعرضين للخطر الأكاديمي بسبب الغياب أو تدني المستوى.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-red-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-center gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${alert.type === 'absence' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'}`}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{alert.student_name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <BookOpen size={14} />
                      {alert.course_title}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex justify-center items-center gap-10">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase mb-1">نوع التنبيه</p>
                    <span className={`text-xs font-bold ${alert.type === 'absence' ? 'text-orange-400' : 'text-red-400'}`}>
                      {alert.type === 'absence' ? 'غياب متكرر' : 'تدني مستوى'}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase mb-1">القيمة</p>
                    <span className="text-sm font-black">{alert.value}</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full lg:w-auto">
                   <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                    <Mail size={16} />
                    مراسلة الطالب
                  </button>
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all">
                    <CheckCircle size={16} />
                    تم الإجراء
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {alerts.length === 0 && (
            <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl text-gray-500">
               لا توجد تنبيهات أكاديمية نشطة حالياً.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcademicAlerts;
