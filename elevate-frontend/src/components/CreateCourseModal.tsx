import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Category {
  id: number;
  name: string;
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
  });

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const res = await api.get('/categories');
          const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          setCategories(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: data[0].id.toString() }));
          }
        } catch (error) {
          console.error("Failed to fetch categories");
          setCategories([]);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let categoryId = formData.category_id;
      // If category is not a number, attempt to create it
      if (isNaN(Number(categoryId))) {
        // check if exists
        const existing = categories.find(c => c.name === categoryId.trim());
        if (existing) {
          categoryId = existing.id.toString();
        } else {
          const createRes = await api.post('/categories', { name: categoryId.trim() });
          categoryId = createRes.data.id.toString();
        }
      }
      await api.post('/courses', { ...formData, category_id: categoryId });
      onSuccess();
      onClose();
      setFormData({ title: '', description: '', category_id: '', price: '' });
    } catch (error) {
      console.error('Error creating course:', error);
      alert('حدث خطأ أثناء إنشاء الدورة');
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-[#1e293b] border border-white/10 rounded-3xl p-6 relative z-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">إضافة دورة جديدة</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">عنوان الدورة</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="مثال: مدخل إلى الذكاء الاصطناعي"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">التصنيف</label>
                <input 
                  type="text" required
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="مثال: الذكاء الاصطناعي"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">السعر ($)</label>
                <input 
                  type="number" min="0" step="0.01" required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">الوصف</label>
                <textarea 
                  required rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  placeholder="اكتب وصفاً مختصراً عما سيتعلمه الطالب..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" disabled={isLoading}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'إنشاء الدورة'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCourseModal;
