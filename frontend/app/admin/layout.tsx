'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Newspaper, CalendarDays, Palmtree,
  Users, Settings, Menu, ArrowLeft, Search, LogOut,
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { Toaster } from 'sonner';
import { logoutAdmin } from './actions';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/newsroom', label: 'Newsroom', icon: Newspaper },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/holidays', label: 'Holidays', icon: Palmtree },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ fullName?: string; email?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('glideparcs_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a1929]">
      {/* Sidebar - desktop */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden w-64 flex-col border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0f2744] lg:flex">
        <AdminSidebarContent pathname={pathname} />
      </aside>

      {/* Sidebar - mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex w-64 flex-col border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0f2744] lg:hidden"
            >
              <AdminSidebarContent pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#0f2744]/80 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 lg:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-slate-800 dark:text-white">
                {NAV_ITEMS.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Admin'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5">
              <Search size={14} className="text-slate-400 dark:text-white/30" />
              <input
                type="text"
                placeholder="Search…"
                className="bg-transparent text-sm text-slate-700 dark:text-white/70 placeholder-slate-400 dark:placeholder-white/30 focus:outline-none w-40"
              />
            </div>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <button
              onClick={() => logoutAdmin()}
              className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <LogOut size={14} /> <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

function AdminSidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 dark:border-white/[0.06] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#24638F]">
          <span className="text-lg font-bold text-white">G</span>
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">GLIDE PARCS</div>
          <div className="text-[9px] uppercase tracking-[2px] text-slate-400 dark:text-white/40">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                active
                  ? 'bg-[#24638F] text-white shadow-md'
                  : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={17} /> {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-white/[0.06] p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <ArrowLeft size={17} /> Back to Portal
        </Link>
      </div>
    </>
  );
}
