'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Newspaper, CalendarDays, Palmtree, Users,
  ArrowRight, TrendingUp, FileText,
} from 'lucide-react';
import { StatCard } from './_components/AdminComponents';
import { articles } from '../data/newsroom';
import { allEvents } from '../data/events';
import { allHolidays } from '../data/holidays';
import { orgData } from '../data/org-data';

export default function AdminDashboard() {
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-white/40 mt-1">Manage all content across the GLIDEPARCS portal.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { icon: Newspaper, label: 'Articles', value: articles.length, color: '#3b82f6', href: '/admin/newsroom' },
          { icon: CalendarDays, label: 'Events', value: allEvents.length, color: '#10b981', href: '/admin/events' },
          { icon: Palmtree, label: 'Holidays', value: allHolidays.length, color: '#f59e0b', href: '/admin/holidays' },
          { icon: Users, label: 'Team Members', value: orgData.length, color: '#8b5cf6', href: '/admin/team' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={stat.href} className="block group">
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-5 transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                  <ArrowRight size={16} className="text-slate-300 dark:text-white/20 group-hover:text-slate-500 dark:group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 mt-1">{stat.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 lg:grid-cols-2 mb-8">
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-5">
          <h2 className="text-sm font-bold text-slate-600 dark:text-white/60 uppercase tracking-wide mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Article', href: '/admin/newsroom/new', icon: Newspaper },
              { label: 'New Event', href: '/admin/events/new', icon: CalendarDays },
              { label: 'New Holiday', href: '/admin/holidays/new', icon: Palmtree },
              { label: 'New Member', href: '/admin/team/new', icon: Users },
            ].map(action => (
              <Link key={action.label} href={action.href} className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-3 text-xs font-bold text-slate-600 dark:text-white/60 hover:border-[#24638F]/30 hover:bg-[#24638F]/5 transition-all">
                <action.icon size={15} /> {action.label}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-600 dark:text-white/60 uppercase tracking-wide">Latest Articles</h2>
          </div>
          <div className="space-y-2">
            {recentArticles.map(article => (
              <Link key={article.slug} href={`/admin/newsroom/${article.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                <span className="text-lg shrink-0">{article.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-700 dark:text-white/70 truncate group-hover:text-[#24638F] transition-colors">{article.title}</div>
                  <div className="text-[11px] text-slate-400 dark:text-white/30">{article.category} · {new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
