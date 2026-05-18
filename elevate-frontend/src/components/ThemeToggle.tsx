import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 left-6 z-50 p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all shadow-xl backdrop-blur-md cursor-pointer flex items-center justify-center"
      title={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-amber-500 animate-pulse" />
      ) : (
        <Moon size={20} className="text-indigo-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
