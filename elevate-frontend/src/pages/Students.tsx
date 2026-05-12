import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Smartphone, ShieldAlert, Trash2, CheckCircle, RefreshCcw, Loader2 } from 'lucide-react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  device_uuid: string | null;
  is_blocked: boolean;
  created_at: string;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleBlock = async (id: number) => {
    setProcessingId(id);
    try {
      await api.post(`/admin/users/${id}/toggle-block`);
      await fetchStudents();
    } catch (error) {
      console.error('Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleResetDevice = async (id: number) => {
    setProcessingId(id);
    try {
      await api.post(`/admin/users/${id}/reset-device`);
      await fetchStudents();
    } catch (error) {
      console.error('Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-blue-500" />
            إدارة الطلاب
          </h1>
          <p className="text-gray-400 mt-2">إجمالي الطلاب المسجلين: {students.length}</p>
        </div>

        <div className="relative group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="بحث عن طالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pr-12 pl-4 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 font-bold text-sm text-gray-300">الطالب</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-300">معرف الجهاز</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-300">الحالة</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-300">تاريخ التسجيل</th>
                <th className="px-6 py-4 font-bold text-sm text-gray-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/10">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs">
                        <Smartphone size={14} className={student.device_uuid ? "text-emerald-500" : "text-gray-600"} />
                        <span className={student.device_uuid ? "text-gray-300" : "text-gray-600 italic"}>
                          {student.device_uuid || 'لم يتم الربط'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.is_blocked ? (
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
                      {new Date(student.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResetDevice(student.id)}
                          disabled={processingId === student.id || !student.device_uuid}
                          title="إعادة تعيين الجهاز"
                          className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <RefreshCcw size={16} className={processingId === student.id ? "animate-spin" : ""} />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(student.id)}
                          disabled={processingId === student.id}
                          title={student.is_blocked ? "إلغاء الحظر" : "حظر الطالب"}
                          className={`p-2 rounded-lg transition-all ${
                            student.is_blocked 
                              ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' 
                              : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {student.is_blocked ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
        {!loading && filteredStudents.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-gray-500 italic">لا يوجد طلاب متطابقون مع البحث.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
