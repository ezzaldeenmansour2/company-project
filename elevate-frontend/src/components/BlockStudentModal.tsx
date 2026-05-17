import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface BlockStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

const BlockStudentModal: React.FC<BlockStudentModalProps> = ({ isOpen, onClose, userId, userName }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get('/courses').then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setCourses(data);
      }).catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !reason || !file) {
      setError('يرجى تعبئة جميع الحقول وإرفاق التقرير الإداري');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('report', file);

    try {
      await api.post(`/courses/${courseId}/students/${userId}/block`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('تم حظر الطالب من الدورة بنجاح.');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء حظر الطالب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1f2e] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-red-500/10">
            <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert /> حظر طالب من دورة
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-8">
            <p className="mb-6 text-gray-300">
              أنت تقوم الآن بإجراء إداري بحظر الطالب <span className="font-bold text-white">{userName}</span> من دورة معينة.
            </p>

            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-medium border border-red-500/20 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">اختر الدورة</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  required
                >
                  <option value="">-- اختر الدورة --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">سبب الحظر الإداري</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">التقرير الإداري (مطلوب)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-red-500/30 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors bg-black/20">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">ارفع ملف PDF أو Word</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                </label>
                {file && <p className="mt-2 text-sm text-emerald-400 text-center">{file.name}</p>}
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تنفيذ الحظر'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BlockStudentModal;
