'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function TopNav() {
  const pathname = usePathname();

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
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            pathname === '/dashboard'
              ? 'border-white/20 bg-white/20 text-white'
              : 'border-transparent text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
