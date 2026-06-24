'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Globe2, Zap, Search, Download, Clock,
  CalendarDays, TrendingUp, Palmtree,
} from 'lucide-react';
import FloatingParticles from '../components/FloatingParticles';
import GlassCalendar, { Holiday } from '../components/GlassCalendar';

/* ─────────────────── Holiday Data (25 entries) ─────────────────── */

const allHolidays: Holiday[] = [
  // ── Global ──
  { date: '2026-01-01', name: "New Year's Day",    type: 'Global', color: 'from-violet-400 to-blue-500',   emoji: '🎆' },
  { date: '2026-03-08', name: "Women's Day",       type: 'Global', color: 'from-pink-400 to-purple-500',   emoji: '💜' },
  { date: '2026-04-22', name: 'Earth Day',          type: 'Global', color: 'from-emerald-400 to-teal-500',  emoji: '🌍' },
  { date: '2026-12-25', name: 'Christmas',          type: 'Global', color: 'from-green-400 to-red-500',     emoji: '🎄' },

  // ── United States ──
  { date: '2026-01-19', name: 'MLK Day',            type: 'US', color: 'from-red-400 to-blue-500',    emoji: '✊' },
  { date: '2026-02-16', name: "Presidents' Day",    type: 'US', color: 'from-red-300 to-blue-400',    emoji: '🏛' },
  { date: '2026-05-25', name: 'Memorial Day',       type: 'US', color: 'from-red-500 to-blue-600',    emoji: '🎖' },
  { date: '2026-06-19', name: 'Juneteenth',         type: 'US', color: 'from-red-400 to-green-500',   emoji: '✊' },
  { date: '2026-07-04', name: 'Independence Day',   type: 'US', color: 'from-red-500 to-blue-600',    emoji: '🇺🇸' },
  { date: '2026-09-07', name: 'Labor Day',           type: 'US', color: 'from-blue-400 to-indigo-500', emoji: '💼' },
  { date: '2026-10-12', name: 'Columbus Day',       type: 'US', color: 'from-amber-400 to-blue-500',  emoji: '🧭' },
  { date: '2026-11-11', name: 'Veterans Day',       type: 'US', color: 'from-red-400 to-blue-500',    emoji: '🎖' },
  { date: '2026-11-26', name: 'Thanksgiving',       type: 'US', color: 'from-orange-400 to-amber-600',emoji: '🦃' },

  // ── India ──
  { date: '2026-01-26', name: 'Republic Day',       type: 'India', color: 'from-orange-400 to-green-500',  emoji: '🇮🇳' },
  { date: '2026-02-17', name: 'Maha Shivaratri',    type: 'India', color: 'from-indigo-400 to-purple-500', emoji: '🕉' },
  { date: '2026-03-17', name: 'Holi',               type: 'India', color: 'from-pink-400 to-yellow-400',   emoji: '🎨' },
  { date: '2026-04-06', name: 'Ram Navami',         type: 'India', color: 'from-orange-400 to-yellow-500', emoji: '🏹' },
  { date: '2026-08-15', name: 'Independence Day',   type: 'India', color: 'from-orange-500 to-green-600',  emoji: '🇮🇳' },
  { date: '2026-08-25', name: 'Janmashtami',        type: 'India', color: 'from-blue-400 to-indigo-500',   emoji: '🪈' },
  { date: '2026-10-02', name: 'Gandhi Jayanti',     type: 'India', color: 'from-amber-300 to-orange-400',  emoji: '🕊' },
  { date: '2026-10-21', name: 'Dussehra',           type: 'India', color: 'from-red-400 to-orange-500',    emoji: '🏹' },
  { date: '2026-11-08', name: 'Diwali',             type: 'India', color: 'from-yellow-400 to-orange-500', emoji: '🪔' },
  { date: '2026-11-15', name: 'Guru Nanak Jayanti', type: 'India', color: 'from-amber-400 to-yellow-500', emoji: '🙏' },
];

/* ─────────────────── Helpers ─────────────────── */

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmtDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/* ─────────────────── Mini‑Month (Year Overview) ─────────────────── */

function MiniMonth({
  monthIndex, year, holidays, isFocused, onClick,
}: {
  monthIndex: number; year: number; holidays: Holiday[]; isFocused: boolean; onClick: () => void;
}) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const holidayCount = holidays.filter(h => {
    const d = new Date(h.date);
    return d.getMonth() === monthIndex && d.getFullYear() === year;
  }).length;

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl border p-3 text-left transition-all duration-200 w-full ${
        isFocused
          ? 'border-cyan-400/40 bg-cyan-400/[0.08] shadow-[0_0_25px_rgba(34,211,238,0.12)]'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]'
      }`}
    >
      {/* Month label */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[11px] font-bold tracking-wide ${isFocused ? 'text-cyan-300' : 'text-white/45'}`}>
          {MONTH_SHORT[monthIndex]}
        </span>
        {holidayCount > 0 && (
          <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${
            isFocused ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/10 text-white/40'
          }`}>
            {holidayCount}
          </span>
        )}
      </div>

      {/* Dot grid */}
      <div className="grid grid-cols-7 gap-[2.5px]">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e-${i}`} className="w-[5px] h-[5px]" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = fmtDate(year, monthIndex, day);
          const holiday = holidays.find(h => h.date === dateStr);
          return (
            <div
              key={day}
              className={`w-[5px] h-[5px] rounded-full transition-colors ${
                holiday
                  ? `bg-gradient-to-r ${holiday.color} shadow-[0_0_3px_rgba(255,255,255,0.25)]`
                  : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>
    </motion.button>
  );
}

/* ─────────────────── Page Component ─────────────────── */

export default function HolidayCalendarPage() {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedMonth, setFocusedMonth] = useState(new Date().getMonth());
  const [focusedYear] = useState(2026);

  /* ── Filtered holidays ── */
  const filteredHolidays = useMemo(() => {
    return allHolidays.filter(h => {
      const matchesRegion = activeRegion === 'All' || h.type === 'Global' || h.type === activeRegion;
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [activeRegion, searchQuery]);

  /* ── Next upcoming holiday ── */
  const nextHoliday = useMemo(() => {
    const today = new Date();
    return filteredHolidays
      .filter(h => new Date(h.date + 'T00:00:00') >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
  }, [filteredHolidays]);

  const daysUntilNext = useMemo(() => {
    if (!nextHoliday) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(nextHoliday.date + 'T00:00:00');
    return Math.ceil((target.getTime() - today.getTime()) / 86400000);
  }, [nextHoliday]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total = filteredHolidays.length;
    const usCount = filteredHolidays.filter(h => h.type === 'US').length;
    const indiaCount = filteredHolidays.filter(h => h.type === 'India').length;
    const globalCount = filteredHolidays.filter(h => h.type === 'Global').length;

    // Find next long weekend (holiday on Mon or Fri)
    const today = new Date();
    const longWeekend = filteredHolidays.find(h => {
      const d = new Date(h.date + 'T00:00:00');
      if (d < today) return false;
      const dow = d.getDay();
      return dow === 1 || dow === 5; // Monday or Friday
    });

    return { total, usCount, indiaCount, globalCount, longWeekend };
  }, [filteredHolidays]);

  /* ── ICS export ── */
  const downloadICS = () => {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Glideparcs//Holiday Calendar//EN\n';
    filteredHolidays.forEach(h => {
      const d = h.date.replace(/-/g, '');
      ics += `BEGIN:VEVENT\nDTSTART;VALUE=DATE:${d}\nDTEND;VALUE=DATE:${d}\nSUMMARY:${h.emoji} ${h.name} (${h.type})\nEND:VEVENT\n`;
    });
    ics += 'END:VCALENDAR';
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `glideparcs-holidays-${activeRegion.toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /* ── Month navigation ── */
  const goToPrev = () => setFocusedMonth(p => (p === 0 ? 11 : p - 1));
  const goToNext = () => setFocusedMonth(p => (p === 11 ? 0 : p + 1));

  /* ── Upcoming holidays for timeline ── */
  const upcomingHolidays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return filteredHolidays
      .map(h => {
        const d = new Date(h.date + 'T00:00:00');
        const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
        return { ...h, daysAway: diff };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredHolidays]);

  const regions = [
    { key: 'All', label: '🌐 All Regions' },
    { key: 'US', label: '🇺🇸 United States' },
    { key: 'India', label: '🇮🇳 India' },
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a1929] text-white selection:bg-cyan-400/20 pb-24">
      {/* ── Background ── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1929] via-[#0f2744] to-[#0a1929]" />
        <div className="absolute left-0 top-0 h-[800px] w-[800px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[#24638F]/20 blur-[180px]" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>
      <FloatingParticles />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/20"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Portal
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/60">
          <Link href="#" className="hover:text-white transition-colors">Company News</Link>
          <Link href="#" className="hover:text-white transition-colors">Upcoming Events</Link>
          <Link href="/holiday-calendar" className="text-cyan-300 font-bold">Holiday Calendar</Link>
          <Link href="#" className="hover:text-white transition-colors">Organization</Link>
        </nav>

        <button
          onClick={downloadICS}
          className="group flex items-center gap-2 rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-bold text-cyan-300 border border-cyan-400/25 backdrop-blur-md transition-all hover:bg-cyan-500/25"
        >
          <Download size={15} /> Export .ics
        </button>
      </header>

      {/* ── Main Content ── */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-10">

        {/* Title + Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 mt-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[2px] text-cyan-300 backdrop-blur">
              <Zap size={12} className="fill-cyan-300" /> Enterprise Schedule
            </div>
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl">
              Holiday Calendar{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/30 to-white/10">2026</span>
            </h1>
          </motion.div>

          {/* Search + Region pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search holidays…"
                className="w-full sm:w-56 rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-white/30 backdrop-blur-xl transition-all focus:border-cyan-400/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            {/* Region pills */}
            <div className="flex gap-1.5 flex-wrap">
              {regions.map(r => (
                <button
                  key={r.key}
                  onClick={() => setActiveRegion(r.key)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    activeRegion === r.key
                      ? 'bg-white text-[#0a1929] shadow-lg scale-105'
                      : 'border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/25'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─────── BENTO GRID ─────── */}
        <div className="grid gap-5">

          {/* ROW 1: Year Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-[32px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-[30px] p-5 md:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold tracking-wide text-white/60 uppercase">Year at a Glance</h3>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <MiniMonth
                  key={i}
                  monthIndex={i}
                  year={focusedYear}
                  holidays={filteredHolidays}
                  isFocused={focusedMonth === i}
                  onClick={() => setFocusedMonth(i)}
                />
              ))}
            </div>
          </motion.div>

          {/* ROW 2: Calendar + Sidebar */}
          <div className="grid gap-5 xl:grid-cols-[1fr_380px]">

            {/* Main Calendar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCalendar
                holidays={filteredHolidays}
                month={focusedMonth}
                year={focusedYear}
                onPrev={goToPrev}
                onNext={goToNext}
              />
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col gap-5"
            >
              {/* Countdown Widget */}
              {nextHoliday && daysUntilNext !== null && (
                <div className="relative rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-cyan-900/20 to-transparent p-6 backdrop-blur-[30px] shadow-[0_0_30px_rgba(34,211,238,0.06)] overflow-hidden">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/15 blur-[30px]" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300/70 mb-1">
                        <Clock size={12} /> Next Holiday
                      </div>
                      <div className="text-lg font-extrabold text-white truncate">{nextHoliday.emoji} {nextHoliday.name}</div>
                      <div className="text-[11px] text-white/40 font-semibold mt-0.5">
                        {new Date(nextHoliday.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right pl-4">
                      <div className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] leading-none">
                        {daysUntilNext}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-cyan-300/50 mt-1">
                        {daysUntilNext === 1 ? 'Day' : 'Days'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Widget */}
              <div className="rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-[30px]">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-cyan-400" />
                  <h3 className="text-xs font-bold tracking-wide text-white/50 uppercase">Stats</h3>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Total', value: stats.total, color: 'text-white' },
                    { label: 'US', value: stats.usCount, color: 'text-blue-400' },
                    { label: 'India', value: stats.indiaCount, color: 'text-orange-400' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
                      <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                {stats.longWeekend && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-400/20 px-3 py-2.5">
                    <Palmtree size={14} className="text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-emerald-300/70 uppercase tracking-wider">Next Long Weekend</div>
                      <div className="text-xs font-bold text-white mt-0.5">{stats.longWeekend.emoji} {stats.longWeekend.name}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upcoming Timeline */}
              <div className="relative rounded-[28px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-[30px] overflow-hidden flex flex-col max-h-[520px]">
                <div className="p-5 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Globe2 size={18} className="text-cyan-400" />
                    <h3 className="text-sm font-bold tracking-wide text-white/60 uppercase">Upcoming</h3>
                    <span className="ml-auto text-[10px] font-bold rounded-full bg-white/10 px-2 py-0.5 text-white/40">
                      {upcomingHolidays.filter(h => h.daysAway >= 0).length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-transparent">
                  <AnimatePresence>
                    {upcomingHolidays.map(holiday => (
                      <motion.div
                        layout
                        key={holiday.date + holiday.name}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className={`group relative flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                          holiday.daysAway < 0
                            ? 'border-white/[0.03] bg-white/[0.01] opacity-40'
                            : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15'
                        }`}
                      >
                        {/* Color accent bar */}
                        <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${holiday.color} shrink-0`} />

                        {/* Emoji */}
                        <span className="text-xl shrink-0">{holiday.emoji}</span>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white truncate group-hover:text-cyan-200 transition-colors">
                            {holiday.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold rounded-full bg-white/10 px-1.5 py-0.5 text-white/40 uppercase tracking-wider">
                              {holiday.type}
                            </span>
                            <span className="text-[10px] font-semibold text-white/30">
                              {new Date(holiday.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        {/* Days away badge */}
                        {holiday.daysAway >= 0 && (
                          <div className="text-right shrink-0 pl-2">
                            <div className="text-sm font-black text-white/50">{holiday.daysAway}</div>
                            <div className="text-[8px] font-bold uppercase tracking-wider text-white/25">
                              {holiday.daysAway === 0 ? 'Today!' : holiday.daysAway === 1 ? 'day' : 'days'}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {upcomingHolidays.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/30 py-8 text-sm font-medium italic">
                        No holidays match your criteria.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
