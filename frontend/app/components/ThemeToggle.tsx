'use client';

import * as React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl border border-transparent" />; // Placeholder to avoid hydration mismatch
  }

  return (
    <div className="relative group">
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="flex items-center justify-center w-9 h-9 rounded-xl 
                   bg-white hover:bg-gray-50 shadow-sm border border-gray-200
                   dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:border-white/10 dark:shadow-none
                   transition-all"
        title="Toggle theme"
      >
        {resolvedTheme === 'dark' ? (
          <Sun size={18} className="text-amber-300" />
        ) : (
          <Moon size={18} className="text-slate-600" />
        )}
      </button>
      
      {/* Dropdown for explicit selection (optional, but nice for power users) */}
      <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-800 
                      rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200 overflow-hidden z-50">
        <div className="p-1 flex flex-col">
          <button 
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                       ${theme === 'light' ? 'bg-[#24638F]/10 text-[#24638F] dark:bg-slate-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
          >
            <Sun size={14} /> Light
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                       ${theme === 'dark' ? 'bg-[#24638F]/10 text-[#24638F] dark:bg-slate-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
          >
            <Moon size={14} /> Dark
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                       ${theme === 'system' ? 'bg-[#24638F]/10 text-[#24638F] dark:bg-slate-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
          >
            <Laptop size={14} /> System
          </button>
        </div>
      </div>
    </div>
  );
}
