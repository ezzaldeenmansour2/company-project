import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, PlayCircle, FileText, File } from 'lucide-react';
import api from '../services/api';

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  onSuccess: () => void;
}

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ isOpen, onClose, courseId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'video',
    content_body: '',
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/lessons', { ...formData, course_id: courseId });
      onSuccess();
      onClose();
      setFormData({ title: '', content_type: 'video', content_body: '', order: 0 });
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('حدث خطأ أثناء إضافة الدرس');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-[32px] p-8 relative z-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">إضافة درس جديد</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">عنوان الدرس</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="مثال: مقدمة في البرمجة الكائنية"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'video', label: 'فيديو', icon: PlayCircle },
                  { id: 'text', label: 'مقال', icon: FileText },
                  { id: 'file', label: 'ملف', icon: File },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({...formData, content_type: type.id as any})}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                      formData.content_type === type.id 
                        ? 'bg-blue-600/10 border-blue-600 text-blue-400 shadow-lg shadow-blue-600/10' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                    }`}
                  >
                    <type.icon size={24} />
                    <span className="text-xs font-bold">{type.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  {formData.content_type === 'video' ? 'رابط الفيديو (URL)' : 'المحتوى / الوصف'}
                </label>
                <textarea 
                  required rows={4}
                  value={formData.content_body}
                  onChange={(e) => setFormData({...formData, content_body: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  placeholder={formData.content_type === 'video' ? 'https://youtube.com/watch?v=...' : 'اكتب المحتوى هنا...'}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" onClick={onClose}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors font-bold"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" disabled={isLoading}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all flex justify-center items-center gap-2 shadow-xl shadow-blue-600/20"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ الدرس'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateLessonModal;
