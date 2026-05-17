import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  User, 
  BookOpen, 
  Clock, 
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

interface ExemptionRequest {
  id: number;
  user: { name: string; email: string };
  course: { title: string };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const Requirements: React.FC = () => {
  const [requests, setRequests] = useState<ExemptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      // Endpoint logic: we might need a general index for exemptions
      const res = await api.get('/admin/exemptions').catch(() => ({ data: [] }));
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      await api.post(`/exemptions/${id}/${action}`);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-8 text-white max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black flex items-center gap-4">
          <ClipboardList className="text-purple-500" size={36} />
          إدارة المتطلبات والتسجيلات
        </h1>
        <p className="text-gray-400 mt-2">مراجعة طلبات الاستثناء من المتطلبات الأكاديمية والموافقة على التسجيلات الخاصة.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple-500" size={40} />
        </div>
      ) : (
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-20 text-center">
              <FileText size={64} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500 font-bold text-lg">لا توجد طلبات معلقة حالياً.</p>
              <p className="text-gray-600 text-sm mt-2">سيظهر هنا أي طالب يطلب تجاوز متطلب سابق لدورة ما.</p>
            </div>
          ) : (
            <AnimatePresence>
              {requests.map((request) => (
                <motion.div 
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.08] transition-all flex flex-col lg:flex-row gap-8 items-start lg:items-center"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                        {request.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{request.user.name}</h3>
                        <p className="text-xs text-gray-500">{request.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-purple-400" />
                        <span>طلب استثناء لدورة: <span className="text-white font-bold">{request.course.title}</span></span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <Clock size={14} />
                        {new Date(request.created_at).toLocaleString('ar-EG')}
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-sm text-gray-300 leading-relaxed italic">
                      " {request.reason} "
                    </div>
                  </div>

                  <div className="flex gap-3 w-full lg:w-auto">
                    <button 
                      onClick={() => handleAction(request.id, 'approve')}
                      disabled={processingId === request.id}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                      {processingId === request.id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                      موافقة
                    </button>
                    <button 
                      onClick={() => handleAction(request.id, 'reject')}
                      disabled={processingId === request.id}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                      {processingId === request.id ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                      رفض
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      )}
      
      {/* Policy Tip */}
      <div className="mt-12 p-6 bg-blue-600/5 border border-blue-600/10 rounded-[2rem] flex items-start gap-4">
        <AlertCircle className="text-blue-500 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-bold text-blue-400 mb-1">تذكير بالسياسة الأكاديمية</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            يجب مراجعة خلفية الطالب الأكاديمية قبل الموافقة على الاستثناء. الموافقة تمنح الطالب حق التسجيل في الدورة المختارة حتى لو لم يستوفِ المتطلبات السابقة المحددة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Requirements;
