import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const StudentAttendance: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isMarking, setIsMarking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkActive = async () => {
      try {
        const res = await api.get(`/attendance/active/${courseId}`);
        setActiveSession(res.data.session);
      } catch (err) {
        console.error('Failed to check active session');
      }
    };

    checkActive();
    const interval = setInterval(checkActive, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [courseId]);

  const simulateScan = async () => {
    if (!activeSession) return;
    setIsMarking(true);
    setStatus('idle');
    
    try {
      // In a real app, this would get the token from a QR scanner.
      // Here we fetch the current valid token from the API to simulate a successful scan.
      const qrRes = await api.get(`/attendance/${activeSession.id}/qr`);
      const res = await api.post(`/attendance/${activeSession.id}/mark`, {
        qr_token: qrRes.data.qr_token
      });
      
      setStatus('success');
      setMessage(res.data.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'فشل تسجيل الحضور');
    } finally {
      setIsMarking(false);
    }
  };

  if (!activeSession) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 mb-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white animate-pulse">
            <Camera size={20} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-500">جلسة تحضير نشطة!</h4>
            <p className="text-xs text-emerald-500/70">قم بمسح الكود المعروض من قبل المدرب لتسجيل حضورك.</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl">
            <CheckCircle size={18} />
            تم التحضير
          </div>
        ) : (
          <button
            onClick={simulateScan}
            disabled={isMarking}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            {isMarking ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
            تسجيل الحضور الآن
          </button>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-4 flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/10">
          <AlertCircle size={14} />
          {message}
        </div>
      )}
    </motion.div>
  );
};

export default StudentAttendance;
