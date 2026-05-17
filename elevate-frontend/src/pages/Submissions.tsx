import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, 
  User, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Loader2,
  Award,
  MessageSquare
} from 'lucide-react';
import api from '../services/api';

interface Submission {
  id: number;
  user: { name: string; email: string };
  file_path: string;
  grade?: number;
  feedback?: string;
  created_at: string;
}

const Submissions: React.FC = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [processing, setProcessing] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get(`/assignments/${assignmentId}/submissions`);
      setSubmissions(res.data);
    } catch (err) {
      console.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setProcessing(true);
    try {
      await api.post(`/submissions/${selectedSubmission.id}/grade`, {
        grade: Number(gradeData.grade),
        feedback: gradeData.feedback
      });
      setSelectedSubmission(null);
      setGradeData({ grade: '', feedback: '' });
      fetchSubmissions();
    } catch (err) {
      console.error('Grading failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 text-white max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        العودة للتكاليف
      </button>

      <header className="mb-10">
        <h1 className="text-4xl font-black flex items-center gap-4">
          <FileCheck className="text-blue-500" size={36} />
          تقييم الحلول المرسلة
        </h1>
        <p className="text-gray-400 mt-2">مراجعة أعمال الطلاب وتقديم التغذية الراجعة والدرجات.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {submissions.length === 0 ? (
            <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-20 text-center text-gray-500">
              لم يقم أي طالب بتسليم هذا التكليف بعد.
            </div>
          ) : (
            submissions.map((sub) => (
              <motion.div 
                key={sub.id}
                layout
                className={`bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 transition-all ${sub.grade ? 'border-emerald-500/20 opacity-80' : 'hover:bg-white/[0.08]'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center font-black text-blue-400">
                    {sub.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{sub.user.name}</h3>
                    <p className="text-xs text-gray-500">{sub.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 flex-1 justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 uppercase font-black mb-1">تاريخ التسليم</span>
                    <span className="text-sm font-mono">{new Date(sub.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 uppercase font-black mb-1">الحالة</span>
                    {sub.grade ? (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <CheckCircle size={14} /> تم التقييم ({sub.grade}%)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                        <Clock size={14} /> قيد الانتظار
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                  <a 
                    href={`http://localhost:8000/storage/${sub.file_path}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
                  >
                    <ExternalLink size={16} />
                    فتح الملف
                  </a>
                  <button 
                    onClick={() => setSelectedSubmission(sub)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
                  >
                    <Award size={16} />
                    {sub.grade ? 'تعديل الدرجة' : 'رصد الدرجة'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Grading Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm"
              onClick={() => setSelectedSubmission(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-10 max-w-xl w-full relative z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                <Award className="text-blue-500" />
                تقييم: {selectedSubmission.user.name}
              </h2>
              <p className="text-gray-500 text-sm mb-8">قم بتحديد الدرجة وإضافة ملاحظاتك الفنية للطالب.</p>
              
              <form onSubmit={handleGrade} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-2">الدرجة النهائية (من 100)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    max="100"
                    value={gradeData.grade}
                    onChange={(e) => setGradeData({...gradeData, grade: e.target.value})}
                    placeholder="مثال: 95"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-2xl font-black text-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-2 flex items-center gap-2">
                    <MessageSquare size={14} />
                    الملاحظات والتعليقات
                  </label>
                  <textarea 
                    value={gradeData.feedback}
                    onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                    placeholder="اكتب تعليقك للطالب هنا..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 text-sm"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    disabled={processing}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {processing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                    اعتماد التقييم
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Submissions;
