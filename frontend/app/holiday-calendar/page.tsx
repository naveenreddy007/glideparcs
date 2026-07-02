'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Globe2, Zap, Search, Download, Clock,
  CalendarDays, TrendingUp, Palmtree, ChevronDown,
} from 'lucide-react';
import FloatingParticles from '../components/FloatingParticles';
import GlassCalendar, { Holiday } from '../components/GlassCalendar';
import { allHolidays, HOLIDAY_REGIONS } from '../data/holidays';

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
      aria-label={`View ${MONTH_SHORT[monthIndex]} ${year}`}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl border p-3 text-left transition-all duration-200 w-full ${
        isFocused
          ? 'border-cyan-400/60 dark:border-cyan-400/40 bg-cyan-50 dark:bg-cyan-400/[0.08] shadow-[0_0_15px_rgba(34,211,238,0.2)] dark:shadow-[0_0_25px_rgba(34,211,238,0.12)]'
          : 'border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-50 dark:hover:bg-white/[0.05]'
      }`}
    >
      {/* Month label */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[11px] font-bold tracking-wide ${isFocused ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-500 dark:text-white/45'}`}>
          {MONTH_SHORT[monthIndex]}
        </span>
        {holidayCount > 0 && (
          <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${
            isFocused ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/20 dark:text-cyan-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white/40'
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
                  ? `bg-gradient-to-r ${holiday.color} shadow-[0_0_3px_rgba(255,255,255,0.4)] dark:shadow-[0_0_3px_rgba(255,255,255,0.25)]`
                  : 'bg-slate-200 dark:bg-white/10'
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
  const [activeRegion, setActiveRegion] = useState<string>('India');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedMonth, setFocusedMonth] = useState(new Date().getMonth());
  const [focusedYear] = useState(2026);
  const [regionOpen, setRegionOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Filtered holidays ── */
  const filteredHolidays = useMemo(() => {
    return allHolidays.filter(h => {
      const matchesRegion = h.type === 'Global' || h.type === activeRegion;
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
    { key: 'India', label: '🇮🇳 India' },
    { key: 'US', label: '🇺🇸 United States' },
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-[#0a1929] text-slate-900 dark:text-white selection:bg-cyan-400/20 pb-24 transition-colors duration-300">
      {/* ── Background ── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#0a1929] dark:via-[#0f2744] dark:to-[#0a1929] transition-colors duration-300" />
        <div className="absolute left-0 top-0 h-[800px] w-[800px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-300/30 dark:bg-[#24638F]/20 blur-[180px]" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-400/20 dark:bg-cyan-600/10 blur-[150px]" />
      </div>
      <FloatingParticles />



      {/* ── Main Content ── */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-10">

        {/* Title + Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 mt-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.8, delay: 0.1 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 dark:border-cyan-400/25 bg-cyan-50 dark:bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[2px] text-cyan-700 dark:text-cyan-300 backdrop-blur"
            >
              <Zap size={12} className="fill-cyan-600 dark:fill-cyan-300" /> Enterprise Schedule
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl text-slate-900 dark:text-white">
              Holiday Calendar{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-200 dark:from-white/30 dark:to-white/10">2026</span>
            </h1>
          </motion.div>

          {/* Search + Region pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.8, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search holidays…"
                aria-label="Search holidays"
                className="w-full sm:w-56 rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 backdrop-blur-xl transition-all focus:border-cyan-400 dark:focus:border-cyan-400/40 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 dark:focus:ring-cyan-400/10"
              />
            </div>

            {/* Region dropdown + Export */}
            <div className="flex gap-1.5 flex-wrap items-center">
              <div className="relative" ref={regionRef}>
                <button
                  onClick={() => setRegionOpen(o => !o)}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-[#0a1929] shadow-md transition-all"
                >
                  {regions.find(r => r.key === activeRegion)?.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${regionOpen ? 'rotate-180' : ''}`} />
                </button>
                {regionOpen && (
                  <div className="absolute top-full mt-1.5 left-0 z-50 min-w-[180px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f2744] shadow-lg overflow-hidden">
                    {regions.filter(r => r.key !== activeRegion).map(r => (
                      <button
                        key={r.key}
                        onClick={() => { setActiveRegion(r.key); setRegionOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Export ICS Button */}
              <button
                onClick={downloadICS}
                className="hidden sm:flex group items-center gap-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/15 px-3.5 py-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-400/25 transition-all hover:bg-cyan-200 dark:hover:bg-cyan-500/25"
                title="Export .ics Calendar File"
              >
                <Download size={14} /> Export
              </button>
            </div>
          </motion.div>
        </div>

        {/* ─────── BENTO GRID ─────── */}
        <div className="grid gap-5">

          {/* ROW 1: Year Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.3 }}
            className="rounded-[32px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-[30px] p-5 md:p-6 shadow-sm dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={18} className="text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-sm font-bold tracking-wide text-slate-600 dark:text-white/60 uppercase">Year at a Glance</h2>
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
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.4 }}
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
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 0.9, delay: 0.5 }}
              className="flex flex-col gap-5"
            >
              {/* Countdown Widget */}
              {nextHoliday && daysUntilNext !== null && (
                <div className="relative rounded-[28px] border border-cyan-200 dark:border-cyan-400/20 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-900/20 dark:to-transparent p-6 backdrop-blur-[30px] shadow-sm dark:shadow-[0_0_30px_rgba(34,211,238,0.06)] overflow-hidden">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-200 dark:bg-cyan-400/15 blur-[30px]" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-300/70 mb-1">
                        <Clock size={12} /> Next Holiday
                      </div>
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white truncate">{nextHoliday.emoji} {nextHoliday.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-white/40 font-semibold mt-0.5">
                        {new Date(nextHoliday.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right pl-4">
                      <div className="text-4xl font-black text-cyan-600 dark:text-cyan-400 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] leading-none">
                        {daysUntilNext}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-cyan-700/50 dark:text-cyan-300/50 mt-1">
                        {daysUntilNext === 1 ? 'Day' : 'Days'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Widget */}
              <div className="rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 backdrop-blur-[30px]">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-xs font-bold tracking-wide text-slate-500 dark:text-white/50 uppercase">Stats</h2>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Total', value: stats.total, color: 'text-slate-900 dark:text-white' },
                    { label: 'US', value: stats.usCount, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'India', value: stats.indiaCount, color: 'text-orange-600 dark:text-orange-400' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] p-3 text-center">
                      <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                {stats.longWeekend && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-400/20 px-3 py-2.5">
                    <Palmtree size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-emerald-700/80 dark:text-emerald-300/70 uppercase tracking-wider">Next Long Weekend</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{stats.longWeekend.emoji} {stats.longWeekend.name}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Upcoming Timeline */}
              <div className="relative rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-[30px] overflow-hidden flex flex-col max-h-[520px]">
                <div className="p-5 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Globe2 size={18} className="text-cyan-600 dark:text-cyan-400" />
                    <h2 className="text-sm font-bold tracking-wide text-slate-600 dark:text-white/60 uppercase">Upcoming</h2>
                    <span className="ml-auto text-[10px] font-bold rounded-full bg-slate-200 dark:bg-white/10 px-2 py-0.5 text-slate-500 dark:text-white/40">
                      {upcomingHolidays.filter(h => h.daysAway >= 0).length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-transparent">
                  <AnimatePresence>
                    {upcomingHolidays.map(holiday => (
                      <motion.div
                        layout
                        key={holiday.date + holiday.name}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 22, mass: 0.7 }}
                        className={`group relative flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-lg ${
                          holiday.daysAway < 0
                            ? 'border-slate-100 dark:border-white/[0.03] bg-slate-50/50 dark:bg-white/[0.01] opacity-60 dark:opacity-40'
                            : 'border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.07] hover:border-slate-300 dark:hover:border-white/15'
                        }`}
                      >
                        {/* Color accent bar */}
                        <div className={`w-1 self-stretch rounded-full bg-gradient-to-b ${holiday.color} shrink-0`} />

                        {/* Emoji */}
                        <span className="text-xl shrink-0">{holiday.emoji}</span>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors">
                            {holiday.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold rounded-full bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 text-slate-500 dark:text-white/40 uppercase tracking-wider">
                              {holiday.type}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-white/30">
                              {new Date(holiday.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        {/* Days away badge */}
                        {holiday.daysAway >= 0 && (
                          <div className="text-right shrink-0 pl-2">
                            <div className="text-sm font-black text-slate-500 dark:text-white/50">{holiday.daysAway}</div>
                            <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/25">
                              {holiday.daysAway === 0 ? 'Today!' : holiday.daysAway === 1 ? 'day' : 'days'}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {upcomingHolidays.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-400 dark:text-white/30 py-8 text-sm font-medium italic">
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
