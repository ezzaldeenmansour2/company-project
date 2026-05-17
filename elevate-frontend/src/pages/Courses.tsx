import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import api, { baseURL } from '../services/api';
import CreateCourseModal from '../components/CreateCourseModal';

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  discount_percentage?: string | number;
  discounted_price?: string | number;
  category: { name: string };
  instructor: { name: string };
}

interface PromoAd {
  id: number;
  title: string;
  image_path: string;
  link?: string;
}

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [promoAds, setPromoAds] = useState<PromoAd[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const fetchCoursesAndAds = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, adsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/marketing/ads').catch(() => ({ data: [] }))
      ]);
      const data = Array.isArray(coursesRes.data) ? coursesRes.data : (coursesRes.data?.data || []);
      setCourses(data);
      setPromoAds(Array.isArray(adsRes.data) ? adsRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndAds();
  }, []);

  useEffect(() => {
    if (promoAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % promoAds.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [promoAds.length]);

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 text-white w-full">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <BookOpen className="text-blue-500" size={32} />
            الدورات التدريبية
          </h1>
          <p className="text-gray-400 text-sm">إدارة المحتوى التعليمي، إضافة دورات جديدة أو استكشاف المناهج المتاحة.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="بحث عن دورة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full transition-all"
            />
          </div>
          {(user?.role === 'super_admin' || user?.role === 'academic_admin' || user?.role === 'instructor') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition-all shadow-lg shadow-blue-600/20 w-full md:w-auto"
            >
              <Plus size={20} />
              دورة جديدة
            </button>
          )}
        </div>
      </header>

      {/* Promo Ads Carousel */}
      {promoAds.length > 0 && (
        <div className="relative w-full h-[280px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 group bg-black/20 border border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAdIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => {
                if (promoAds[currentAdIndex].link) {
                  window.open(promoAds[currentAdIndex].link, '_blank');
                }
              }}
            >
              <img
                src={baseURL + '/storage/' + promoAds[currentAdIndex].image_path}
                alt={promoAds[currentAdIndex].title}
                className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-10">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-black text-white leading-tight"
                >
                  {promoAds[currentAdIndex].title}
                </motion.h2>
              </div>
            </motion.div>
          </AnimatePresence>

          {promoAds.length > 1 && (
            <>
              <button
                onClick={() => setCurrentAdIndex((prev) => (prev - 1 + promoAds.length) % promoAds.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/40 hover:bg-blue-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={() => setCurrentAdIndex((prev) => (prev + 1) % promoAds.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/40 hover:bg-blue-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10"
              >
                <ChevronRight size={28} />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {promoAds.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentAdIndex(idx)}
                    className={'h-1.5 rounded-full transition-all ' + (idx === currentAdIndex ? 'w-10 bg-blue-500' : 'w-3 bg-white/30 hover:bg-white/50')}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-16 text-center backdrop-blur-sm">
          <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
            <BookOpen className="text-blue-500 w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold mb-3">لم يتم العثور على دورات</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">لا توجد دورات متاحة حالياً تطابق بحثك. ابدأ بإضافة دورة جديدة أو جرب كلمة بحث أخرى.</p>
          {(user?.role === 'super_admin' || user?.role === 'academic_admin' || user?.role === 'instructor') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-black transition-all shadow-xl shadow-blue-600/20"
            >
              إضافة أول دورة لك
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              onClick={() => navigate('/course/' + course.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/[0.08] hover:border-blue-500/30 transition-all group cursor-pointer relative"
            >
              <div className="h-48 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 flex items-center justify-center relative overflow-hidden">
                <BookOpen className="text-white/10 w-24 h-24 group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                  نشط
                </div>
                {course.discount_percentage && Number(course.discount_percentage) > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-600/90 backdrop-blur-md rounded-lg text-xs font-black text-white shadow-lg">
                    {course.discount_percentage}-%
                  </div>
                )}
              </div>
              <div className="p-7">
                <div className="text-[10px] text-blue-400 font-black mb-3 uppercase tracking-widest">{course.category?.name || 'عام'}</div>
                <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
                      {course.instructor?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{course.instructor?.name || 'مدرب غير معروف'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    {course.discount_percentage && Number(course.discount_percentage) > 0 ? (
                      <>
                        <span className="font-black text-emerald-400 text-xl tracking-tight">${course.discounted_price}</span>
                        <span className="text-[10px] text-gray-500 line-through opacity-50">${course.price}</span>
                      </>
                    ) : (
                      <span className="font-black text-white text-xl tracking-tight">${course.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCoursesAndAds}
      />
    </div>
  );
};

export default Courses;
