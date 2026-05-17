import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Plus, Trash2, Mail, ShieldAlert, CheckCircle, Loader2, Star, BookOpen, MessageSquare, MoreVertical, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import api from '../services/api';
import AddUserModal from '../components/AddUserModal';

interface User {
  id: number;
  name: string;
  email: string;
  is_blocked: boolean;
  created_at: string;
}

// Mock Data for the mini-charts to give a premium SaaS feel
const generateMockChartData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 50) + 10
  }));
};

const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchInstructors = async () => {
    try {
      const res = await api.get('/admin/instructors');
      setInstructors(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleToggleBlock = async (id: number) => {
    setProcessingId(id);
    try {
      await api.post(`/admin/users/${id}/toggle-block`);
      await fetchInstructors();
    } catch (error) {
      console.error('Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredInstructors = instructors.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 lg:p-10 font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">هيئة التدريس</span>
            </div>
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-purple-500" />
              إدارة المدربين
            </h1>
            <p className="text-sm text-zinc-500 mt-2">إجمالي الخبراء المسجلين: <span className="font-bold text-zinc-300">{instructors.length}</span> مدرب</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                شبكة
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                قائمة
              </button>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all text-sm font-bold shadow-lg shadow-purple-600/20"
            >
              <Plus size={16} />
              إضافة مدرب
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/80 p-2 rounded-2xl backdrop-blur-sm">
          <div className="relative group w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="بحث باسم المدرب أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2 pr-10 pl-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl backdrop-blur-sm">
            <Loader2 className="animate-spin text-purple-500" size={32} />
            <p className="text-sm text-zinc-500">جاري تحميل بيانات المدربين...</p>
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-900/30 border border-zinc-800/80 rounded-2xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 mb-4 shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-zinc-300 font-bold mb-1">لا توجد نتائج</h3>
            <p className="text-sm text-zinc-500">لم يتم العثور على مدربين متطابقين مع البحث.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredInstructors.map((instructor, idx) => (
                  <motion.div
                    key={instructor.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-zinc-900/40 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-900/10"
                  >
                    {/* Card Header & Avatar */}
                    <div className="p-6 pb-4 border-b border-zinc-800/50 flex justify-between items-start relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xl shadow-inner">
                            {instructor.name.charAt(0)}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-[#121215] rounded-full ${instructor.is_blocked ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-100 text-base group-hover:text-purple-400 transition-colors">{instructor.name}</h3>
                          <p className="text-xs text-zinc-500 font-mono mt-0.5">{instructor.email}</p>
                        </div>
                      </div>
                      <button className="text-zinc-600 hover:text-zinc-300 transition-colors relative z-10">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    {/* Stats & Mini Chart */}
                    <div className="p-6 py-4 flex gap-6 items-center">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Star size={14} className="text-amber-500 fill-amber-500/20" />
                            <span>4.8</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <BookOpen size={14} className="text-blue-400" />
                            <span>{Math.floor(Math.random() * 10) + 1} دورات</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 w-fit px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <TrendingUp size={10} /> +12% نمو
                        </div>
                      </div>
                      
                      <div className="w-24 h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateMockChartData()}>
                            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                            <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 bg-zinc-950/50 border-t border-zinc-800/50 flex justify-between items-center gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-all">
                        <MessageSquare size={14} /> مراسلة
                      </button>
                      <button
                        onClick={() => handleToggleBlock(instructor.id)}
                        disabled={processingId === instructor.id}
                        className={`px-4 py-2 rounded-xl border transition-all flex items-center justify-center ${
                          instructor.is_blocked 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
                        }`}
                        title={instructor.is_blocked ? "تفعيل الحساب" : "حظر الحساب"}
                      >
                        {processingId === instructor.id ? (
                           <Loader2 size={16} className="animate-spin" />
                        ) : instructor.is_blocked ? (
                           <CheckCircle size={16} />
                        ) : (
                           <ShieldAlert size={16} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // List View - Similar premium table as Students.tsx
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                        <th className="px-6 py-4 font-medium text-xs">المدرب</th>
                        <th className="px-6 py-4 font-medium text-xs">البريد الإلكتروني</th>
                        <th className="px-6 py-4 font-medium text-xs">التقييم</th>
                        <th className="px-6 py-4 font-medium text-xs">الحالة</th>
                        <th className="px-6 py-4 font-medium text-xs">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {filteredInstructors.map((instructor) => (
                        <tr key={instructor.id} className="hover:bg-zinc-800/30 transition-colors group">
                           <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs shrink-0 shadow-inner">
                                {instructor.name.charAt(0)}
                              </div>
                              <p className="font-bold text-zinc-200 group-hover:text-purple-400 transition-colors">{instructor.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                              <Mail size={14} className="text-zinc-600" />
                              {instructor.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                                <Star size={14} className="text-amber-500 fill-amber-500/20" />
                                <span>4.8</span>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                            {instructor.is_blocked ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span> محظور
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> نشط
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleBlock(instructor.id)}
                                disabled={processingId === instructor.id}
                                title={instructor.is_blocked ? "تفعيل" : "حظر"}
                                className={`p-1.5 rounded-lg border border-transparent transition-all ${
                                  instructor.is_blocked 
                                    ? 'text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20' 
                                    : 'text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20'
                                }`}
                              >
                                {processingId === instructor.id ? <Loader2 size={16} className="animate-spin" /> : instructor.is_blocked ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <AddUserModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchInstructors}
        defaultRole="instructor"
      />
    </div>
  );
};

export default Instructors;
