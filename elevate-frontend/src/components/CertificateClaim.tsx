import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, ShieldCheck, Loader2, Share2, ExternalLink } from 'lucide-react';
import api from '../services/api';

const CertificateClaim: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      setLoading(true);
      try {
        const res = await api.get('/my-certificates');
        const cert = res.data.find((c: any) => c.course_id === courseId);
        setCertificate(cert);
      } catch (err) {
        console.error('Failed to fetch certificate');
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [courseId]);

  const handleIssue = async () => {
    setIsIssuing(true);
    try {
      const res = await api.post('/certificates/issue', { course_id: courseId });
      setCertificate(res.data.certificate || res.data);
    } catch (err) {
      console.error('Failed to issue certificate');
    } finally {
      setIsIssuing(false);
    }
  };

  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-[2.5rem] p-8 mb-10 overflow-hidden relative group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
        <Award size={150} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/40">
            <Award size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-500">شهادة الإتمام</h3>
            <p className="text-gray-400 text-sm">تهانينا! لقد حققت متطلبات هذه الدورة</p>
          </div>
        </div>

        {certificate ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">رقم الشهادة</p>
                <p className="font-mono text-sm font-bold text-amber-500">{certificate.certificate_hash}</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">تاريخ الإصدار</p>
                <p className="text-sm font-bold">{new Date(certificate.issued_at).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-white text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-50 transition-all shadow-xl shadow-white/10">
                <Download size={20} />
                تحميل الشهادة (PDF)
              </button>
              <button className="p-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                <Share2 size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-500/10 w-fit px-4 py-2 rounded-full border border-emerald-500/20">
              <ShieldCheck size={16} />
              هذه الشهادة موثقة وصالحة للعرض العام
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed max-w-md">
              بمجرد ضغطك على الزر أدناه، سيتم إصدار شهادة إتمام رسمية باسمك وموثقة برمز فريد يمكن التحقق منه.
            </p>
            <button
              onClick={handleIssue}
              disabled={isIssuing}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-amber-500/40 flex items-center gap-3"
            >
              {isIssuing ? <Loader2 className="animate-spin" size={24} /> : <ExternalLink size={24} />}
              إصدار الشهادة الآن
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CertificateClaim;
