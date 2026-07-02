'use client';

import { useState } from 'react';
import { loginAdmin } from '../actions';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginAdmin(password);
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a1929] p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0f2744] p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#24638F]">
            <span className="text-xl font-bold text-white">G</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Admin Login</h1>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">GLIDEPARCS Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-slate-800 dark:text-white/80 focus:outline-none focus:border-[#24638F] focus:ring-2 focus:ring-[#24638F]/10"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !password}
            className="w-full rounded-xl bg-[#24638F] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#1C5075] transition-all disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-slate-400 dark:text-white/30">
          Set <code className="rounded bg-slate-100 dark:bg-white/5 px-1 py-0.5">ADMIN_SECRET</code> in <code className="rounded bg-slate-100 dark:bg-white/5 px-1 py-0.5">.env.local</code> to change the default password.
        </p>
      </div>
    </div>
  );
}
