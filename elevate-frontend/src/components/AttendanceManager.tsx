import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Users, Clock, CheckCircle, XCircle, Loader2, Play, StopCircle, UserCheck, ShieldCheck, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import { useAttendance } from '../hooks/useAttendance';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use the new Enterprise Hook for real-time updates
  const { data: attendanceData, isLoading: isAttendanceLoading } = useAttendance(session?.id || null);
  const presentStudents = attendanceData?.records || [];

  // بدء جلسة جديدة
  const startSession = async () => {
    setLoading(true);
    setError('');
    
    // محاولة الحصول على الموقع الجغرافي لتفعيل الـ Geo-fencing
    let locationData = {};
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        radius: 100 // افتراضي 100 متر
      };
    } catch (err) {
      console.warn('Geolocation failed or denied, continuing without location check');
    }

    try {
      const res = await api.post('/attendance/start', { 
        course_id: courseId,
        ...locationData
      });
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
      interval = setInterval(fetchQR, 3000);
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
    <div className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-8 overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 shadow-inner">
            <QrCode size={32} />
          </div>
          <div>
            <h3 className="font-black text-2xl text-white tracking-tight">نظام التحضير الذكي</h3>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Zap size={12} className="text-amber-500" />
              تشفير ديناميكي متجدد كل 3 ثوانٍ
            </p>
          </div>
        </div>

        {!session ? (
          <button
            onClick={startSession}
            disabled={loading}
            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl transition-all font-bold text-sm shadow-xl shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            بدء جلسة تحضير جديدة
          </button>
        ) : (
          <button
            onClick={closeSession}
            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white px-8 py-4 rounded-2xl transition-all font-bold text-sm border border-rose-500/20"
          >
            <StopCircle size={20} />
            إنهاء الجلسة الحالية
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {session ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            {/* QR Code Canvas */}
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-[3rem] shadow-3xl relative group">
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]"></div>
              {qrToken ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full scale-110"></div>
                  <div className="relative bg-white p-4 rounded-3xl shadow-inner">
                    <QRCodeSVG 
                      value={qrToken} 
                      size={240} 
                      level="H"
                      includeMargin={false}
                      fgColor="#09090b"
                    />
                  </div>
                  {/* Progress Ring / Line */}
                  <div className="absolute -bottom-6 left-0 w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      key={qrToken}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 3, ease: "linear" }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <Loader2 className="animate-spin text-indigo-500" size={60} />
              )}
              <div className="mt-12 text-center space-y-2">
                <p className="text-zinc-900 font-black text-lg">وجه الطلاب لمسح الكود</p>
                <p className="text-zinc-400 text-xs font-medium flex items-center justify-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  يتم التحقق من الموقع الجغرافي والجهاز
                </p>
              </div>
            </div>

            {/* Live Feed */}
            <div className="flex flex-col h-full">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-[2rem]">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">الحضور الآن</p>
                  <p className="text-4xl font-black text-indigo-400">{presentStudents.length}</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-[2rem]">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">الحالة</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-sm font-bold text-emerald-400">بث مباشر</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col min-h-[300px]">
                <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                  <span className="text-xs font-bold text-zinc-300">سجل المسح اللحظي</span>
                  <UserCheck size={16} className="text-indigo-400" />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  <AnimatePresence>
                    {presentStudents.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-zinc-600 text-xs gap-3"
                      >
                        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center animate-bounce">
                           <Users size={20} className="opacity-20" />
                        </div>
                        في انتظار أول عملية تحضير...
                      </motion.div>
                    ) : (
                      presentStudents.map((s, idx) => (
                        <motion.div 
                          key={s.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl group hover:border-indigo-500/30 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center font-bold text-[10px]">
                               {s.user.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-zinc-200">{s.user.name}</p>
                               <p className="text-[10px] text-zinc-500">{s.user.email}</p>
                            </div>
                          </div>
                          <div className="text-left">
                             <p className="text-[10px] font-mono text-zinc-600">{new Date(s.scanned_at).toLocaleTimeString('ar-EG')}</p>
                             <div className="flex justify-end mt-1">
                               <CheckCircle size={12} className="text-emerald-500" />
                             </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-950/20"
          >
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <Clock size={40} className="opacity-20" />
            </div>
            <h4 className="text-xl font-bold text-zinc-400 mb-2">لا توجد جلسة نشطة</h4>
            <p className="text-xs text-zinc-600">قم ببدء الجلسة للسماح للطلاب بتسجيل حضورهم في القاعة</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceManager;

