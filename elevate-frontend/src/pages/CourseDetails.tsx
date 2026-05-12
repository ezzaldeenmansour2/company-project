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
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'community' | 'assignments'>('content');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdminOrInstructor = user.role === 'admin' || user.role === 'instructor';

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data?.data || response.data);
      
      if (user.role === 'student') {
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
    } catch (error) {
      console.error('Enrollment failed');
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Info */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 text-blue-400 text-sm font-bold mb-4">
              <span className="bg-blue-500/10 px-3 py-1 rounded-full">{course.category?.name || 'تصنيف عام'}</span>
            </div>
            <h1 className="text-4xl font-black mb-4">{course.title}</h1>
            <p className="text-gray-400 leading-relaxed mb-8">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-500" />
                <span>المدرب: <span className="font-bold">{course.instructor?.name || 'غير معروف'}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-gray-500" />
                <span>{course.lessons?.length || 0} دروس</span>
              </div>
            </div>
          </motion.div>

          {/* Certificate Claim (Students Only) */}
          {user.role === 'student' && isEnrolled && (
            <CertificateClaim courseId={course.id} />
          )}

          {/* Student Attendance Action */}
          {user.role === 'student' && isEnrolled && (
            <StudentAttendance courseId={course.id} />
          )}

          {/* Attendance Section (Instructors Only) */}
          {isAdminOrInstructor && (
            <AttendanceManager courseId={course.id} />
          )}

          {/* Tabs Switcher */}
          <div className="flex gap-4 border-b border-white/5 pb-4">
            <button 
              onClick={() => setActiveTab('content')}
              className={`pb-2 px-4 font-bold transition-all border-b-2 ${activeTab === 'content' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              المحتوى التعليمي
            </button>
            <button 
              onClick={() => setActiveTab('community')}
              className={`pb-2 px-4 font-bold transition-all border-b-2 ${activeTab === 'community' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              المجتمع التفاعلي
            </button>
            <button 
              onClick={() => setActiveTab('assignments')}
              className={`pb-2 px-4 font-bold transition-all border-b-2 ${activeTab === 'assignments' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-white'}`}
            >
              التكاليف والمهام
            </button>
          </div>

          {activeTab === 'content' ? (
            /* Lessons List */
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold">منهج الدورة</h3>
                {isAdminOrInstructor && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                  >
                    <Plus size={18} />
                    إضافة درس
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {!course.lessons || course.lessons.length === 0 ? (
                  <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-10 text-center text-gray-500">
                    لا توجد دروس مضافة بعد لهذه الدورة.
                  </div>
                ) : (
                  [...course.lessons].sort((a, b) => a.order - b.order).map((lesson, idx) => (
                    <motion.div 
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group ${!isEnrolled && !isAdminOrInstructor ? 'opacity-50 grayscale' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getIcon(lesson.content_type)}
                            <h4 className="font-bold text-sm">{lesson.title}</h4>
                          </div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{lesson.content_type} content</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {isEnrolled || isAdminOrInstructor ? (
                          <button className="p-2 hover:bg-blue-600/20 rounded-lg text-blue-400 transition-all">
                            <PlayCircle size={22} />
                          </button>
                        ) : (
                          <Clock size={18} className="text-gray-600" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === 'community' ? (
            /* Community Section */
            <CourseCommunity courseId={course.id} />
          ) : (
            /* Assignments Section */
            <AssignmentsList courseId={course.id} />
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-blue-600/20">
            <h4 className="font-bold text-lg mb-4">ملخص الدورة</h4>
            <ul className="space-y-4">
              <li className="flex items-center justify-between text-sm">
                <span className="text-blue-100">المستوى</span>
                <span className="font-bold">متقدم</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-blue-100">اللغة</span>
                <span className="font-bold">العربية</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-blue-100">تحديث أخير</span>
                <span className="font-bold">اليوم</span>
              </li>
            </ul>
            
            {user.role === 'student' && (
              <button 
                onClick={handleEnroll}
                disabled={isEnrolled || isEnrolling}
                className={`w-full mt-8 py-4 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isEnrolled 
                    ? 'bg-emerald-500 text-white cursor-default' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                {isEnrolling && <Loader2 className="animate-spin" size={20} />}
                {isEnrolled ? (
                  <>
                    <CheckCircle size={20} />
                    أنت مشترك بالفعل
                  </>
                ) : 'اشترك الآن'}
              </button>
            )}
            
            {isAdminOrInstructor && (
              <button className="w-full mt-8 py-4 bg-white/20 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/30 transition-all">
                معاينة كطالب
              </button>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <h4 className="font-bold mb-4">المدرب</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                {course.instructor?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-sm">{course.instructor?.name || 'غير معروف'}</p>
                <p className="text-xs text-gray-500">خبير تطوير برمجيات</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateLessonModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={course.id}
        onSuccess={fetchCourse}
      />
    </div>
  );
};

export default CourseDetails;
