import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Plus, Trash2, Mail, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  is_blocked: boolean;
  created_at: string;
}

const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

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
    <div className="p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="text-purple-500" />
            إدارة المدربين
          </h1>
          <p className="text-gray-400 mt-2">إجمالي المدربين: {instructors.length}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="بحث عن مدرب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pr-12 pl-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all font-bold text-sm">
            <Plus size={18} />
            إضافة مدرب
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-purple-500" size={40} />
          </div>
        ) : (
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 font-bold text-sm text-gray-300">المدرب</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-300">البريد الإلكتروني</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-300">الحالة</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-300">تاريخ الانضمام</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredInstructors.map((instructor) => (
                  <motion.tr
                    key={instructor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/10">
                          {instructor.name.charAt(0)}
                        </div>
                        <p className="font-bold text-sm">{instructor.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Mail size={14} className="text-gray-500" />
                        {instructor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {instructor.is_blocked ? (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 flex items-center gap-1 w-fit">
                          <ShieldAlert size={10} />
                          محظور
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1 w-fit">
                          <CheckCircle size={10} />
                          نشط
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                      {new Date(instructor.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBlock(instructor.id)}
                          disabled={processingId === instructor.id}
                          title={instructor.is_blocked ? "تفعيل" : "حظر"}
                          className={`p-2 rounded-lg transition-all ${
                            instructor.is_blocked 
                              ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' 
                              : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {instructor.is_blocked ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
        {!loading && filteredInstructors.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-gray-500 italic">لا يوجد مدربون حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructors;
