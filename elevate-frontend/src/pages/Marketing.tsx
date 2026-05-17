import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Plus, 
  Trash2, 
  Tag, 
  Image as ImageIcon, 
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import api, { baseURL } from '../services/api';

interface Ad {
  id: number;
  title: string;
  image_path: string;
  link?: string;
}

const Marketing: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [newAd, setNewAd] = useState({
    title: '',
    link: '',
    image: null as File | null
  });

  const fetchAds = async () => {
    try {
      const res = await api.get('/marketing/ads');
      setAds(res.data);
    } catch (err) {
      console.error('Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('title', newAd.title);
    if (newAd.link) formData.append('link', newAd.link);
    if (newAd.image) formData.append('image', newAd.image);

    try {
      await api.post('/marketing/ads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(progress);
        }
      });
      setSuccess('تمت إضافة الإعلان بنجاح');
      setIsModalOpen(false);
      setNewAd({ title: '', link: '', image: null });
      setUploadProgress(0);
      fetchAds();
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل في إضافة الإعلان. تأكد من حجم الصورة والبيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4">
            <Gift className="text-blue-500" size={36} />
            إدارة التسويق والإعلانات
          </h1>
          <p className="text-gray-400 mt-2">إدارة العروض الترويجية والإعلانات التي تظهر للطلاب في الصفحة الرئيسية.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all"
        >
          <Plus size={20} />
          إعلان جديد
        </button>
      </header>

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-2 font-bold animate-pulse">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {loading && ads.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ads.map((ad) => (
            <motion.div 
              key={ad.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/30 transition-all"
            >
              <div className="h-48 relative">
                <img 
                  src={baseURL + '/storage/' + ad.image_path} 
                  alt={ad.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <h3 className="text-xl font-bold">{ad.title}</h3>
                </div>
              </div>
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ExternalLink size={14} />
                  {ad.link ? <span className="truncate max-w-[150px]">{ad.link}</span> : 'لا يوجد رابط'}
                </div>
                <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          
          {ads.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem]">
              <ImageIcon size={64} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500 font-bold">لا توجد إعلانات نشطة حالياً.</p>
            </div>
          )}
        </div>
      )}

      {/* New Ad Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 max-w-xl w-full relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-black mb-2">إضافة إعلان جديد</h2>
              <p className="text-gray-500 text-sm mb-10">سيظهر هذا الإعلان في السلايدر الرئيسي بصفحة الدورات.</p>
              
              <form onSubmit={handleCreateAd} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-2 text-sm font-bold">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-2">عنوان الإعلان</label>
                  <input 
                    type="text" 
                    required
                    value={newAd.title}
                    onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                    placeholder="مثال: خصم 50% على دورات الذكاء الاصطناعي"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-2">رابط التوجيه (اختياري)</label>
                  <input 
                    type="url" 
                    value={newAd.link}
                    onChange={(e) => setNewAd({...newAd, link: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 mr-2">صورة الإعلان</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      required
                      accept="image/*"
                      onChange={(e) => setNewAd({...newAd, image: e.target.files ? e.target.files[0] : null})}
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-blue-500/50 transition-all">
                      <ImageIcon size={32} className="text-gray-600 group-hover:text-blue-500" />
                      <span className="text-xs text-gray-500">
                        {newAd.image ? newAd.image.name : 'اسحب الصورة هنا أو اضغط للاختيار'}
                      </span>
                    </div>
                  </div>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-blue-400">
                      <span>جاري رفع الصورة...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  نشر الإعلان الآن
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketing;
