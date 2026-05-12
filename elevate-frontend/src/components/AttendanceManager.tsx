import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Users, Clock, CheckCircle, XCircle, Loader2, Play, StopCircle, UserCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';

interface AttendanceSession {
  id: number;
  course_id: number;
  status: 'active' | 'closed' | 'waiting';
}

interface StudentRecord {
  id: number;
  user: { name: string; email: string };
  scanned_at: string;
}

const AttendanceManager: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [qrToken, setQrToken] = useState<string>('');
  const [presentStudents, setPresentStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // بدء جلسة جديدة
  const startSession = async () => {
    setLoading(true);
    try {
      const res = await api.post('/attendance/start', { course_id: courseId });
      setSession(res.data.session);
    } catch (err) {
      setError('فشل بدء الجلسة');
    } finally {
      setLoading(false);
    }
  };

  // جلب توكن QR متجدد
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session?.status === 'active') {
      const fetchQR = async () => {
        try {
          const res = await api.get(`/attendance/${session.id}/qr`);
          setQrToken(res.data.qr_token);
        } catch (err) {
          console.error('Failed to fetch QR');
        }
      };

      fetchQR();
      interval = setInterval(fetchQR, 5000); // تحديث كل 5 ثوانٍ
    }
    return () => clearInterval(interval);
  }, [session]);

  // إغلاق الجلسة
  const closeSession = async () => {
    if (!session) return;
    try {
      await api.post(`/attendance/${session.id}/close`);
      setSession(null);
      setQrToken('');
    } catch (err) {
      console.error('Failed to close session');
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
            <QrCode size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">نظام التحضير الذكي</h3>
            <p className="text-xs text-gray-500">QR كود متغير لمنع التحايل</p>
          </div>
        </div>

        {!session ? (
          <button
            onClick={startSession}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
            بدء التحضير
          </button>
        ) : (
          <button
            onClick={closeSession}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm border border-red-600/20"
          >
            <StopCircle size={18} />
            إيقاف التحضير
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {session ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* QR Code Display */}
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/20">
              {qrToken ? (
                <div className="relative">
                  <QRCodeSVG 
                    value={qrToken} 
                    size={200} 
                    level="H"
                    includeMargin={true}
                  />
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                    className="absolute -bottom-4 left-0 h-1 bg-blue-500 rounded-full"
                  />
                </div>
              ) : (
                <Loader2 className="animate-spin text-blue-500" size={40} />
              )}
              <p className="mt-8 text-slate-900 font-bold text-center">
                اطلب من الطلاب مسح الكود الآن
                <span className="block text-xs text-slate-400 mt-1 font-normal italic">يتغير الكود كل 5 ثوانٍ تلقائياً</span>
              </p>
            </div>

            {/* Live Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-gray-500 text-xs mb-1">عدد الحضور</p>
                  <p className="text-2xl font-black text-emerald-500">{presentStudents.length}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-gray-500 text-xs mb-1">حالة الجلسة</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold">نشط حالياً</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl border border-white/5 h-[200px] overflow-hidden flex flex-col">
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">آخر المسجلين</span>
                  <UserCheck size={14} className="text-gray-500" />
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {presentStudents.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">
                      في انتظار أول عملية مسح...
                    </div>
                  ) : (
                    presentStudents.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-xs">
                        <span className="font-bold">{s.user.name}</span>
                        <span className="text-gray-500">{new Date(s.scanned_at).toLocaleTimeString('ar-EG')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl"
          >
            <Clock size={40} className="mb-4 opacity-20" />
            <p>لا توجد جلسة تحضير نشطة حالياً</p>
            <p className="text-xs mt-2">اضغط على زر "بدء التحضير" لفتح الجلسة للطلاب</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceManager;
