import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, Loader2, AlertCircle, X } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import api from '../services/api';

const StudentAttendance: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isMarking, setIsMarking] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
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

  const handleScan = async (scannedToken: string) => {
    if (!activeSession || isMarking) return;
    setIsScanning(false);
    setIsMarking(true);
    setStatus('idle');
    
    try {
      let lat = 0;
      let lng = 0;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (err) {
        console.warn('Could not get student location');
      }

      const res = await api.post(`/attendance/${activeSession.id}/mark`, {
        qr_token: scannedToken,
        latitude: lat, 
        longitude: lng 
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

  const toggleScanner = () => {
    setIsScanning(!isScanning);
    setStatus('idle');
    setMessage('');
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
            onClick={toggleScanner}
            disabled={isMarking}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            {isMarking ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
            {isScanning ? 'إلغاء المسح' : 'تسجيل الحضور الآن'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden relative rounded-2xl bg-black"
          >
            <Scanner 
              onScan={(result) => {
                if (result && result.length > 0) {
                  handleScan(result[0].rawValue);
                }
              }}
              onError={(error) => console.warn(error?.message)}
              components={{
                audio: false,
                finder: true,
              }}
            />
            <button 
              onClick={() => setIsScanning(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
