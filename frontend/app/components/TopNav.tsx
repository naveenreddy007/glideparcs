'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, CalendarDays, Sparkles, Newspaper, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('glideparcs_user');
    window.location.href = '/login';
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#1C5075] bg-[#24638F] px-6 py-4 shadow-md">
      <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white shadow-inner">
          <span className="text-lg font-bold tracking-[-1px] text-[#24638F]">G</span>
        </div>
        <span className="hidden text-xl font-semibold tracking-[-0.5px] text-white sm:block">
          GLIDE PARCS
        </span>
      </Link>

      <nav className="hidden items-center gap-2 md:flex">
        <Link
          href="/dashboard"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            pathname === '/dashboard'
              ? 'bg-white/20 text-white shadow-inner'
              : 'text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link
          href="/newsroom"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            pathname === '/newsroom' || pathname.startsWith('/newsroom/')
              ? 'bg-white/20 text-white shadow-inner'
              : 'text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Newspaper size={16} /> Newsroom
        </Link>
        <Link
          href="/event-calendar"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            pathname === '/event-calendar'
              ? 'bg-white/20 text-white shadow-inner'
              : 'text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sparkles size={16} /> Events
        </Link>
        <Link
          href="/holiday-calendar"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            pathname === '/holiday-calendar'
              ? 'bg-white/20 text-white shadow-inner'
              : 'text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          <CalendarDays size={16} /> Calendar
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} /> <span>Sign out</span>
        </button>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center p-2 rounded-xl bg-white/10 text-white border border-white/20"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[80%] max-w-sm bg-[#1C5075] border-l border-white/10 shadow-2xl p-6 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="text-lg font-bold tracking-tight text-white">Menu</div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-white/10 text-white"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex flex-col gap-4 text-base font-semibold text-white/90">
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/dashboard' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link 
                  href="/newsroom" 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/newsroom' || pathname.startsWith('/newsroom/') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Newspaper size={20} /> Newsroom
                </Link>
                <Link 
                  href="/event-calendar" 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/event-calendar' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sparkles size={20} /> Event Calendar
                </Link>
                <Link 
                  href="/holiday-calendar" 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/holiday-calendar' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CalendarDays size={20} /> Holiday Calendar
                </Link>
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-sm font-semibold text-white">Theme</span>
                  <ThemeToggle />
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
