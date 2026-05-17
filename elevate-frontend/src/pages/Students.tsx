import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Smartphone, ShieldAlert, Trash2, CheckCircle, RefreshCcw, Loader2, UserMinus, Filter, Download, MoreHorizontal, ChevronDown } from 'lucide-react';
import api from '../services/api';
import BlockStudentModal from '../components/BlockStudentModal';
import AddUserModal from '../components/AddUserModal';

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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{id: number, name: string} | null>(null);

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

  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Device UUID', 'Blocked', 'Created At'];
    const rows = students.map(s => [
      s.id,
      s.name,
      s.email,
      s.device_uuid || 'N/A',
      s.is_blocked ? 'Yes' : 'No',
      s.created_at
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? !s.is_blocked : s.is_blocked;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 lg:p-10 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">قاعدة البيانات</span>
            </div>
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight flex items-center gap-3">
              <Users className="text-indigo-500" />
              إدارة الطلاب
            </h1>
            <p className="text-sm text-zinc-500 mt-2">إجمالي المسجلين: <span className="font-bold text-zinc-300">{students.length}</span> طالب</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 rounded-xl transition-all text-sm font-medium"
            >
              <Download size={16} />
              تصدير CSV
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all text-sm font-bold shadow-lg shadow-indigo-600/20"
            >
              إضافة طالب
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/80 p-2 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors w-4 h-4" />
              <input
                type="text"
                placeholder="بحث بالاسم أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2 pr-10 pl-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-xl shrink-0">
              <button 
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                الكل
              </button>
              <button 
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                نشط
              </button>
              <button 
                onClick={() => setStatusFilter('blocked')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'blocked' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                محظور
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all text-xs font-medium shrink-0">
              <Filter size={14} />
              فلاتر متقدمة
            </button>
          </div>
        </div>

        {/* Stripe-style Data Table */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
              <p className="text-sm text-zinc-500">جاري تحميل البيانات...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                    <th className="px-6 py-4 font-medium text-xs w-10">
                      <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                    </th>
                    <th className="px-6 py-4 font-medium text-xs">الطالب</th>
                    <th className="px-6 py-4 font-medium text-xs">معرف الجهاز (UUID)</th>
                    <th className="px-6 py-4 font-medium text-xs">تاريخ التسجيل</th>
                    <th className="px-6 py-4 font-medium text-xs">الحالة</th>
                    <th className="px-6 py-4 font-medium text-xs text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  <AnimatePresence>
                    {filteredStudents.map((student, idx) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-zinc-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0 shadow-inner">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">{student.name}</p>
                              <p className="text-[10px] text-zinc-500 font-mono">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Smartphone size={14} className={student.device_uuid ? "text-indigo-400" : "text-zinc-700"} />
                            <span className={student.device_uuid ? "text-zinc-400 font-mono text-[11px] bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800" : "text-zinc-600 text-[11px] italic"}>
                              {student.device_uuid ? student.device_uuid.substring(0, 16) + '...' : 'غير مرتبط'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-500 font-mono">
                          {new Date(student.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          {student.is_blocked ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                              محظور
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                              نشط
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleResetDevice(student.id)}
                              disabled={processingId === student.id || !student.device_uuid}
                              title="إعادة تعيين الجهاز"
                              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/20 border border-transparent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <RefreshCcw size={16} className={processingId === student.id ? "animate-spin" : ""} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudent({ id: student.id, name: student.name });
                                setIsBlockModalOpen(true);
                              }}
                              title="حظر من دورة"
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent transition-all"
                            >
                              <UserMinus size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleBlock(student.id)}
                              disabled={processingId === student.id}
                              title={student.is_blocked ? "إلغاء الحظر" : "حظر الطالب"}
                              className={`p-1.5 rounded-lg border border-transparent transition-all ${
                                student.is_blocked 
                                  ? 'text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20' 
                                  : 'text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20'
                              }`}
                            >
                              {student.is_blocked ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                            </button>
                          </div>
                          {/* Fallback for mobile/non-hover state */}
                          <button className="p-1 text-zinc-500 md:hidden"><MoreHorizontal size={16} /></button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 mb-4 shadow-inner">
                <Search size={24} />
              </div>
              <h3 className="text-zinc-300 font-bold mb-1">لا توجد نتائج</h3>
              <p className="text-sm text-zinc-500">لم نتمكن من العثور على أي طلاب يتطابقون مع بحثك الحالي.</p>
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="mt-4 text-indigo-400 text-xs font-bold hover:text-indigo-300"
              >
                مسح الفلاتر
              </button>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && filteredStudents.length > 0 && (
            <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                عرض <span className="font-bold text-zinc-300">{filteredStudents.length}</span> من <span className="font-bold text-zinc-300">{students.length}</span> نتيجة
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-500 cursor-not-allowed">السابق</button>
                <button className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800">التالي</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedStudent && (
        <BlockStudentModal 
          isOpen={isBlockModalOpen}
          onClose={() => {
            setIsBlockModalOpen(false);
            setSelectedStudent(null);
          }}
          userId={selectedStudent.id}
          userName={selectedStudent.name}
        />
      )}

      <AddUserModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchStudents}
        defaultRole="student"
      />
    </div>
  );
};

export default Students;
