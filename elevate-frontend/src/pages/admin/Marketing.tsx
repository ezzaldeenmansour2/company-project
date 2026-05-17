import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Gift, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../services/api';

const Marketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ads' | 'discounts'>('ads');
  
  // Ad Form State
  const [adTitle, setAdTitle] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adFile, setAdFile] = useState<File | null>(null);
  const [isAdSubmitting, setIsAdSubmitting] = useState(false);

  // Discount Form State
  const [discountTitle, setDiscountTitle] = useState('');
  const [percentage, setPercentage] = useState('');
  const [courseId, setCourseId] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [isDiscountSubmitting, setIsDiscountSubmitting] = useState(false);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adFile || !adTitle) return;
    setIsAdSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', adTitle);
    formData.append('image', adFile);
    if (adLink) formData.append('link', adLink);

    try {
      await api.post('/marketing/ads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('تم إضافة الإعلان بنجاح');
      setAdTitle(''); setAdLink(''); setAdFile(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء إضافة الإعلان');
    } finally {
      setIsAdSubmitting(false);
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountTitle || !percentage || !courseId) return;
    setIsDiscountSubmitting(true);

    try {
      await api.post('/marketing/discounts', {
        title: discountTitle,
        percentage: Number(percentage),
        course_id: Number(courseId),
        starts_at: startsAt || null,
        ends_at: endsAt || null
      });
      alert('تم إنشاء الخصم بنجاح');
      setDiscountTitle(''); setPercentage(''); setCourseId(''); setStartsAt(''); setEndsAt('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء إضافة الخصم');
    } finally {
      setIsDiscountSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-white space-y-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Gift className="text-blue-500" />
          التسويق والإعلانات
        </h1>
        <p className="text-gray-400">إدارة البنرات الإعلانية الترويجية وخصومات الدورات الاستراتيجية.</p>
      </header>

      <div className="flex gap-4 border-b border-white/5 pb-4">
        <button 
          onClick={() => setActiveTab('ads')}
          className={`pb-2 px-4 font-bold transition-all border-b-2 ` + (activeTab === 'ads' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-white')}
        >
          البنرات الإعلانية (Ads)
        </button>
        <button 
          onClick={() => setActiveTab('discounts')}
          className={`pb-2 px-4 font-bold transition-all border-b-2 ` + (activeTab === 'discounts' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-white')}
        >
          الخصومات (Discounts)
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activeTab === 'ads' ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="text-blue-400" /> رفع إعلان جديد
            </h2>
            <form onSubmit={handleCreateAd} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">عنوان الإعلان</label>
                <input 
                  type="text" 
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">رابط التوجيه (اختياري)</label>
                <input 
                  type="url" 
                  value={adLink}
                  onChange={(e) => setAdLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">صورة البانر</label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-blue-500 transition-colors bg-black/20">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-500 mb-3" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">انقر للرفع</span>
                    </p>
                    <p className="text-xs text-gray-500">1920x500 موصى به</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setAdFile(e.target.files?.[0] || null)}
                    required
                  />
                </label>
                {adFile && <p className="mt-2 text-sm text-emerald-400 font-medium">{adFile.name}</p>}
              </div>

              <button
                type="submit"
                disabled={isAdSubmitting || !adFile || !adTitle}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAdSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
                نشر الإعلان
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Gift className="text-blue-400" /> إنشاء خصم جديد
            </h2>
            <form onSubmit={handleCreateDiscount} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">اسم الحملة / الخصم</label>
                  <input 
                    type="text" 
                    value={discountTitle}
                    onChange={(e) => setDiscountTitle(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">نسبة الخصم (%)</label>
                  <input 
                    type="number" 
                    min="1" max="100"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">رقم الدورة (ID)</label>
                <input 
                  type="number" 
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">تاريخ البدء (اختياري)</label>
                  <input 
                    type="datetime-local" 
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">تاريخ الانتهاء (اختياري)</label>
                  <input 
                    type="datetime-local" 
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isDiscountSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDiscountSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
                إنشاء الخصم
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Marketing;
