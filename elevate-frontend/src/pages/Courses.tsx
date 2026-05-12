import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Loader2 } from 'lucide-react';
import api from '../services/api';
import CreateCourseModal from '../components/CreateCourseModal';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  category: { name: string };
  instructor: { name: string };
}

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/courses');
      // التأكد من أن البيانات مصفوفة للتحمل (Resilience)
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]); // تعيين مصفوفة فارغة في حالة الخطأ لتجنب الانهيار
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-8 space-y-8 text-white w-full">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <BookOpen className="text-blue-500" />
            الدورات التعليمية
          </h1>
          <p className="text-gray-400 text-sm">أدر المحتوى التعليمي، أضف دورات جديدة أو عدل الحالية.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="بحث في الدورات..."
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            دورة جديدة
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : !Array.isArray(courses) || courses.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-blue-500 w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">لا توجد دورات بعد</h3>
          <p className="text-gray-400 mb-6">ابدأ بإنشاء أول دورة تعليمية لك الآن.</p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all shadow-lg">
            إنشاء دورة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div 
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] transition-all group cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center relative">
                <BookOpen className="text-white/20 w-16 h-16" />
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  نشط
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-blue-400 font-bold mb-2">{course.category?.name || 'تصنيف عام'}</div>
                <h3 className="text-lg font-bold mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold">
                      {course.instructor?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs text-gray-300">{course.instructor?.name || 'مدرب'}</span>
                  </div>
                  <span className="font-bold text-white">${course.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreateCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCourses} 
      />
    </div>
  );
};

export default Courses;
