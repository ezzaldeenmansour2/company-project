import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  ShieldCheck,
  BarChart3,
  Gift,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userRole = user?.role || 'student';
  
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, path: '/dashboard', roles: ['super_admin', 'academic_admin', 'instructor', 'student'] },
    { id: 'students', label: 'الطلاب', icon: Users, path: '/students', roles: ['super_admin', 'academic_admin', 'instructor'] },
    { id: 'instructors', label: 'المدربون', icon: ShieldCheck, path: '/instructors', roles: ['super_admin'] },
    { id: 'courses', label: 'الدورات', icon: BookOpen, path: '/courses', roles: ['super_admin', 'academic_admin', 'instructor', 'student'] },
    { id: 'requirements', label: 'المتطلبات', icon: ClipboardList, path: '/requirements', roles: ['super_admin', 'academic_admin'] },
    { id: 'reports', label: 'التقارير', icon: BarChart3, path: '/reports', roles: ['super_admin', 'academic_admin'] },
    { id: 'marketing', label: 'التسويق', icon: Gift, path: '/marketing', roles: ['super_admin'] },
    { id: 'settings', label: 'الإعدادات', icon: Settings, path: '/settings', roles: ['super_admin', 'academic_admin', 'instructor', 'student'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-[#0f172a] h-screen border-l border-white/5 flex flex-col py-6 sticky top-0">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <span className="text-white font-bold text-xl">E</span>
        </div>
        <h2 className="text-white font-bold text-xl tracking-tight">Elevate</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
