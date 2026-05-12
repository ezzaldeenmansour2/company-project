import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Calendar, Send, CheckCircle, Clock, FileText, Plus, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  submissions_count: number;
}

const AssignmentsList: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', deadline: '' });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdminOrInstructor = user.role === 'admin' || user.role === 'instructor';

  const fetchAssignments = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/assignments`);
      setAssignments(res.data);
    } catch (err) {
      console.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const handleCreateAssignment = async () => {
    try {
      await api.post('/assignments', { ...newAssignment, course_id: courseId });
      setIsModalOpen(false);
      setNewAssignment({ title: '', description: '', deadline: '' });
      fetchAssignments();
    } catch (err) {
      console.error('Failed to create assignment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="text-blue-500" />
            التكاليف والواجبات
          </h3>
          <p className="text-xs text-gray-500 mt-1">قم بإنجاز المهام المطلوبة للحصول على الشهادة</p>
        </div>
        {isAdminOrInstructor && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            تكليف جديد
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
        ) : assignments.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-gray-500">
            لا توجد تكاليف مضافة لهذه الدورة حالياً.
          </div>
        ) : (
          assignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/[0.08] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                  <FileText size={24} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                  <Clock size={12} />
                  {new Date(assignment.deadline).toLocaleDateString('ar-EG')}
                </div>
              </div>
              
              <h4 className="text-lg font-bold mb-2">{assignment.title}</h4>
              <p className="text-gray-400 text-sm line-clamp-2 mb-6">{assignment.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                {isAdminOrInstructor ? (
                  <button className="text-blue-400 text-xs font-bold hover:underline flex items-center gap-1">
                    عرض {assignment.submissions_count} حلاً مرسلاً
                  </button>
                ) : (
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <Send size={16} />
                    إرسال الحل
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal Simulation */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 relative z-10"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">إضافة تكليف جديد</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="عنوان التكليف"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                />
                <textarea
                  placeholder="وصف المهمة المطلوبة..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                />
                <input
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})}
                />
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={handleCreateAssignment}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    حفظ التكليف
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignmentsList;
