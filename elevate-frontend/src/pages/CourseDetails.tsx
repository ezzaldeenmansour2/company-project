import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  PlayCircle, 
  FileText, 
  File, 
  Plus, 
  Clock, 
  User, 
  BookOpen,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import CreateLessonModal from '../components/CreateLessonModal';
import AttendanceManager from '../components/AttendanceManager';
import StudentAttendance from '../components/StudentAttendance';
import CourseCommunity from '../components/CourseCommunity';
import AssignmentsList from '../components/AssignmentsList';
import CertificateClaim from '../components/CertificateClaim';
import ExemptionModal from '../components/ExemptionModal';

interface Lesson {
  id: number;
  title: string;
  content_type: 'video' | 'file' | 'text';
  content_body: string;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: { name: string };
  category: { name: string };
  lessons: Lesson[];
  price: string;
  discounted_price?: string;
  discount_percentage?: string;
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isExemptionModalOpen, setIsExemptionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'community' | 'assignments'>('content');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdminOrInstructor = user?.role === 'admin' || user?.role === 'instructor';

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data?.data || response.data);
      
      if (user?.role === 'student') {
        const statusRes = await api.get(`/courses/${id}/enrollment-status`);
        setIsEnrolled(statusRes.data.is_enrolled);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      setCourse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.requires_exemption) {
        setIsExemptionModalOpen(true);
      } else {
        console.error('Enrollment failed');
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (!course) return <div className="p-8 text-center text-white">الدورة غير موجودة</div>;

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="text-blue-400" size={20} />;
      case 'file': return <File className="text-emerald-400" size={20} />;
      case 'text': return <FileText className="text-purple-400" size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        العودة للدورات
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Course Info */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-20 translate-x-20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-blue-400 text-[10px] font-black mb-6 uppercase tracking-widest">
                <span className="bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">{course.category?.name || 'تصنيف عام'}</span>
              </div>
              <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">{course.title}</h1>
              <p className="text-gray-400 leading-relaxed mb-10 text-lg">{course.description}</p>
              
              <div className="flex flex-wrap gap-8 text-sm">
                <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <User size={18} className="text-blue-500" />
                  <span className="font-bold">{course.instructor?.name || 'مدرب غير معروف'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <BookOpen size={18} className="text-purple-500" />
                  <span className="font-bold">{course.lessons?.length || 0} دروس تعليمية</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Certificate Claim (Students Only) */}
          {user?.role === 'student' && isEnrolled && (
            <CertificateClaim courseId={course.id} />
          )}

          {/* Student Attendance Action */}
          {user?.role === 'student' && isEnrolled && (
            <StudentAttendance courseId={course.id} />
          )}

          {/* Attendance Section (Instructors Only) */}
          {isAdminOrInstructor && (
            <AttendanceManager courseId={course.id} />
          )}

          {/* Tabs Switcher */}
          <div className="flex gap-4 border-b border-white/5 pb-4 sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-20">
            {[
              { id: 'content', label: 'المحتوى التعليمي', icon: BookOpen },
              { id: 'community', label: 'المجتمع التفاعلي', icon: MoreVertical },
              { id: 'assignments', label: 'التكاليف والمهام', icon: FileText }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-6 font-black text-sm transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-500' 
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'content' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black">منهج الدورة</h3>
                  {isAdminOrInstructor && (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20"
                    >
                      <Plus size={18} />
                      إضافة درس جديد
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {!course.lessons || course.lessons.length === 0 ? (
                    <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-20 text-center text-gray-500">
                      <BookOpen className="mx-auto mb-4 opacity-20" size={64} />
                      <p className="text-lg">لا توجد دروس مضافة بعد لهذه الدورة.</p>
                    </div>
                  ) : (
                    [...course.lessons].sort((a, b) => a.order - b.order).map((lesson, idx) => (
                      <motion.div 
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all group ${!isEnrolled && !isAdminOrInstructor ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              {getIcon(lesson.content_type)}
                              <h4 className="font-black text-base">{lesson.title}</h4>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{lesson.content_type}</span>
                              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                              <span className="text-[10px] text-gray-500">متاح للمشتركين</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {isEnrolled || isAdminOrInstructor ? (
                            <button className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-lg group-hover:scale-110">
                              <PlayCircle size={24} />
                            </button>
                          ) : (
                            <div className="p-3 bg-white/5 rounded-xl">
                              <Clock size={18} className="text-gray-600" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            ) : activeTab === 'community' ? (
              <CourseCommunity courseId={course.id} />
            ) : (
              <AssignmentsList courseId={course.id} />
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <h4 className="font-black text-2xl mb-8 border-b border-white/10 pb-4">تفاصيل الدورة</h4>
              <ul className="space-y-6">
                {[
                  { label: 'المستوى', value: 'متقدم', color: 'blue' },
                  { label: 'اللغة', value: 'العربية', color: 'purple' },
                  { label: 'تحديث أخير', value: 'منذ يومين', color: 'emerald' },
                  { label: 'الشهادة', value: 'معتمدة', color: 'yellow' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-blue-100/60 font-medium">{item.label}</span>
                    <span className="font-black bg-white/10 px-3 py-1 rounded-lg">{item.value}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-end">
                <span className="text-sm text-blue-100 font-bold uppercase tracking-widest">السعر النهائي</span>
                <div className="flex flex-col items-end">
                  {course.discount_percentage && Number(course.discount_percentage) > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-white/50 line-through">${course.price}</span>
                        <span className="px-2 py-0.5 bg-red-500 rounded text-[10px] font-black">-{course.discount_percentage}%</span>
                      </div>
                      <span className="font-black text-white text-5xl tracking-tighter">${course.discounted_price}</span>
                    </>
                  ) : (
                    <span className="font-black text-white text-5xl tracking-tighter">${course.price}</span>
                  )}
                </div>
              </div>
              
              {user?.role === 'student' && (
                <button 
                  onClick={handleEnroll}
                  disabled={isEnrolled || isEnrolling}
                  className={`w-full mt-10 py-5 font-black rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 text-lg ${
                    isEnrolled 
                      ? 'bg-emerald-500 text-white cursor-default' 
                      : 'bg-white text-blue-700 hover:bg-blue-50 hover:scale-[1.02]'
                  }`}
                >
                  {isEnrolling && <Loader2 className="animate-spin" size={20} />}
                  {isEnrolled ? (
                    <>
                      <CheckCircle size={24} />
                      أنت مشترك بالفعل
                    </>
                  ) : (
                    <>
                      اشترك الآن
                      <ChevronRight size={24} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
            <h4 className="font-black text-lg mb-6 flex items-center gap-3">
              <User className="text-blue-500" size={20} />
              عن المدرب
            </h4>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-black text-2xl shadow-xl">
                {course.instructor?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-black text-lg group-hover:text-blue-400 transition-colors">{course.instructor?.name || 'مدرب معتمد'}</p>
                <p className="text-xs text-gray-500 mt-1">خبير في المجال التعليمي والتقني</p>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              عرض الملف الشخصي
            </button>
          </div>
        </div>
      </div>

      <CreateLessonModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={course.id}
        onSuccess={fetchCourse}
      />
      <ExemptionModal 
        isOpen={isExemptionModalOpen}
        onClose={() => setIsExemptionModalOpen(false)}
        courseId={course.id}
      />
    </div>
  );
};

export default CourseDetails;
