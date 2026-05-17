import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Download, 
  ExternalLink, 
  Award, 
  ArrowLeft,
  Loader2,
  Calendar,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Certificate {
  id: number;
  course: { title: string };
  certificate_hash: string;
  issued_at: string;
}

const MyCertificates: React.FC = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/my-certificates');
        setCertificates(res.data);
      } catch (err) {
        console.error('Failed to fetch certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter(c => 
    c.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 text-white max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        العودة للوحة الإنجازات
      </button>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4">
            <Trophy className="text-yellow-500" size={36} />
            شهاداتي وإنجازاتي
          </h1>
          <p className="text-gray-400 mt-2">توثيق رسمي لرحلتك التعليمية ومهاراتك المكتسبة.</p>
        </div>

        <div className="relative group w-full md:w-64">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="بحث عن شهادة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pr-12 pl-4 w-full text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-yellow-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredCertificates.map((cert) => (
              <motion.div 
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-yellow-500/30 transition-all shadow-2xl"
              >
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center border border-yellow-500/20">
                      <Award size={36} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-gray-500 font-black uppercase mb-1">رمز التحقق</p>
                      <p className="text-xs font-mono text-gray-400">#{cert.certificate_hash.substring(0, 8)}</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-2 group-hover:text-yellow-500 transition-colors">{cert.course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-10 font-bold">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(cert.issued_at).toLocaleDateString('ar-EG')}</span>
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                    <span className="flex items-center gap-1.5 text-emerald-500"><ShieldCheck size={14} /> معتمدة</span>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-white text-blue-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-50 transition-all shadow-xl shadow-yellow-900/20">
                      <Download size={20} />
                      تحميل PDF
                    </button>
                    <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCertificates.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
              <Trophy size={64} className="mx-auto mb-6 text-gray-700 opacity-20" />
              <p className="text-gray-500 text-xl font-bold">لا توجد شهادات متاحة حالياً.</p>
              <p className="text-gray-600 text-sm mt-2">أكمل دوراتك التدريبية بنجاح لتحصل على شهاداتك هنا.</p>
            </div>
          )}
        </div>
      )}

      {/* Certification Tip */}
      <div className="mt-16 p-8 bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] flex items-start gap-6">
        <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="font-bold text-blue-400 mb-2">كيف يتم توثيق الشهادات؟</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            تخضع جميع الشهادات الممنوحة لنظام التحقق الرقمي عبر المعرف الفريد (Hash). يمكنك مشاركة الرابط المباشر للشهادة مع جهات التوظيف للتأكد من صحتها فوراً.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyCertificates;
