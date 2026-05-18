import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Download, ShieldCheck, Loader2, Share2,
  CheckCircle, ExternalLink, BadgeCheck, Copy
} from 'lucide-react';
import api, { baseURL } from '../services/api';

interface Certificate {
  id: number;
  course_id: number;
  certificate_hash: string;
  file_url: string;
  issued_at: string;
  course?: { title: string };
}

const CertificateClaim: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading]         = useState(true);
  const [isIssuing, setIsIssuing]     = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied]           = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    const fetchCert = async () => {
      setLoading(true);
      try {
        const res  = await api.get('/my-certificates');
        const cert = (res.data as Certificate[]).find((c) => c.course_id === courseId);
        setCertificate(cert || null);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [courseId]);

  // Issue certificate
  const handleIssue = async () => {
    setIsIssuing(true);
    setError('');
    try {
      const res = await api.post('/certificates/issue', { course_id: courseId });
      setCertificate(res.data.certificate ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل إصدار الشهادة.');
    } finally {
      setIsIssuing(false);
    }
  };

  // Download real PDF
  const handleDownload = async () => {
    if (!certificate) return;
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${baseURL}/api/certificates/download/${certificate.certificate_hash}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/pdf' } }
      );
      if (!response.ok) throw new Error('فشل التحميل');
      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `elevate-certificate-${certificate.certificate_hash}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('فشل تحميل الشهادة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy hash to clipboard
  const handleCopy = () => {
    if (!certificate) return;
    navigator.clipboard.writeText(certificate.certificate_hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[2.5rem] p-8 mb-10 border border-amber-500/30 bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-amber-900/20"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Watermark icon */}
      <div className="absolute top-4 left-4 opacity-5 pointer-events-none">
        <Award size={200} className="text-amber-500" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/40 flex-shrink-0">
            <Award size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-400">شهادة إتمام الدورة</h3>
            <p className="text-slate-400 text-sm">
              {certificate ? 'شهادتك جاهزة وموثقة' : 'أتممت الدورة بنجاح — أصدر شهادتك الآن'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {certificate ? (
            /* ─── Certificate issued ─── */
            <motion.div
              key="issued"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Certificate details */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex-1 min-w-[180px]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">رقم الشهادة</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-bold text-amber-400 tracking-widest">{certificate.certificate_hash}</p>
                    <button
                      onClick={handleCopy}
                      className="text-slate-500 hover:text-amber-400 transition-colors"
                      title="نسخ رقم الشهادة"
                    >
                      {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">تاريخ الإصدار</p>
                  <p className="text-sm font-bold text-slate-200">
                    {new Date(certificate.issued_at).toLocaleDateString('ar-EG', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 min-w-[180px] bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/30"
                >
                  {isDownloading
                    ? <Loader2 className="animate-spin" size={20} />
                    : <Download size={20} />}
                  {isDownloading ? 'جاري التحميل...' : 'تحميل الشهادة (PDF)'}
                </button>

                <button
                  onClick={() => {
                    const url = `${window.location.origin}/verify/${certificate.certificate_hash}`;
                    navigator.share?.({ title: 'شهادتي من Elevate LMS', url }) ||
                      navigator.clipboard.writeText(url);
                  }}
                  className="p-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl transition-all border border-white/10"
                  title="مشاركة الشهادة"
                >
                  <Share2 size={20} />
                </button>

                <a
                  href={`/verify/${certificate.certificate_hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl transition-all border border-white/10"
                  title="التحقق العام من الشهادة"
                >
                  <ExternalLink size={20} />
                </a>
              </div>

              {/* Verified badge */}
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 w-fit px-4 py-2.5 rounded-full border border-emerald-500/20">
                <BadgeCheck size={16} />
                شهادة موثقة ويمكن التحقق منها عبر المنصة
              </div>
            </motion.div>
          ) : (
            /* ─── Not yet issued ─── */
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <p className="text-slate-300 leading-relaxed max-w-md">
                بمجرد الضغط على الزر أدناه سيتم إنشاء <strong className="text-amber-400">شهادة PDF احترافية</strong> باسمك
                وبرقم تعريفي فريد يمكن التحقق منه من قبل أي جهة.
              </p>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">{error}</p>
              )}

              <button
                onClick={handleIssue}
                disabled={isIssuing}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-amber-500/40 flex items-center gap-3"
              >
                {isIssuing ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
                {isIssuing ? 'جاري إصدار الشهادة...' : 'إصدار الشهادة الآن'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CertificateClaim;
