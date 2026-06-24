'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Holiday {
  date: string;
  name: string;
  type: string;
  color: string;
  emoji: string;
}

interface GlassCalendarProps {
  holidays: Holiday[];
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function GlassCalendar({ holidays, month, year, onPrev, onNext }: GlassCalendarProps) {
  const [direction, setDirection] = useState(0);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const handlePrev = () => { setDirection(-1); onPrev(); };
  const handleNext = () => { setDirection(1); onNext(); };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  }, []);

  const gridDays = useMemo(() => {
    const days: { day: number; isCurrentMonth: boolean; monthOffset: number }[] = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, monthOffset: -1 });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, monthOffset: 0 });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, monthOffset: 1 });
    }
    return days;
  }, [year, month, daysInMonth, firstDayOfMonth, daysInPrevMonth]);

  const getDateStr = (dayInfo: { day: number; monthOffset: number }) => {
    const d = new Date(year, month + dayInfo.monthOffset, dayInfo.day);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0, scale: 0.96 }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 40 : -40, opacity: 0, scale: 0.96 }),
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] backdrop-blur-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.3)] p-5 md:p-7 transition-colors duration-300">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full bg-cyan-400/20 dark:bg-cyan-500/8 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[100px]" />

      {/* Month header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${year}-${month}`}
            initial={{ y: -15, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.8 }}
            className="flex items-baseline gap-3"
          >
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl">{MONTH_NAMES[month]}</h2>
            <span className="text-xl font-medium text-slate-500 dark:text-white/40 md:text-2xl">{year}</span>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1.5">
          <button 
            onClick={handlePrev} 
            aria-label="Previous month"
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all hover:bg-slate-200 dark:hover:bg-white/15 dark:hover:border-white/20 active:scale-90"
          >
            <ChevronLeft size={18} className="text-slate-600 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          </button>
          <button 
            onClick={handleNext} 
            aria-label="Next month"
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all hover:bg-slate-200 dark:hover:bg-white/15 dark:hover:border-white/20 active:scale-90"
          >
            <ChevronRight size={18} className="text-slate-600 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Day name headers */}
      <div className="relative z-10 grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[10px] font-bold uppercase tracking-[2px] py-1 ${
              i === 0 || i === 6 ? 'text-slate-400 dark:text-white/30' : 'text-slate-500 dark:text-white/50'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="relative z-10">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 220, damping: 25, mass: 0.8 }}
            className="grid grid-cols-7 gap-1"
          >
            {gridDays.map((dayInfo, i) => {
              const dateStr = getDateStr(dayInfo);
              const holiday = holidays.find(h => h.date === dateStr);
              const isToday = dateStr === todayStr;
              const isWeekend = i % 7 === 0 || i % 7 === 6;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredDate(dateStr)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`relative group flex flex-col rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] min-h-[72px] md:min-h-[82px] p-1.5 ${
                    !dayInfo.isCurrentMonth
                      ? 'border-transparent opacity-30 dark:opacity-15'
                      : holiday
                        ? 'border-slate-200 dark:border-white/15 bg-white dark:bg-white/[0.07] hover:bg-slate-50 dark:hover:bg-white/[0.14] hover:-translate-y-0.5 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-lg cursor-pointer'
                        : isToday
                          ? 'border-cyan-400/50 dark:border-cyan-400/30 bg-cyan-50 dark:bg-cyan-400/[0.06]'
                          : isWeekend
                            ? 'border-slate-100 dark:border-white/[0.03] bg-slate-50/50 dark:bg-white/[0.015]'
                            : 'border-slate-200 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.025] hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Day number */}
                  <span
                    className={`text-sm font-semibold leading-none ${
                      isToday
                        ? 'text-cyan-600 dark:text-cyan-300'
                        : dayInfo.isCurrentMonth
                          ? isWeekend ? 'text-slate-500 dark:text-white/40' : 'text-slate-800 dark:text-white/80'
                          : 'text-slate-400 dark:text-white/30'
                    }`}
                  >
                    {dayInfo.day}
                  </span>

                  {/* Today pulsing dot */}
                  {isToday && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] pulsing-ring" />
                  )}

                  {/* Holiday content inside cell */}
                  {holiday && dayInfo.isCurrentMonth && (
                    <div className="mt-auto flex flex-col gap-0.5 w-full overflow-hidden">
                      <div className={`h-[3px] w-full rounded-full bg-gradient-to-r ${holiday.color}`} />
                      <div className="flex items-center gap-0.5">
                        <span className="text-[11px] leading-none shrink-0">{holiday.emoji}</span>
                        <span className="text-[8px] md:text-[9px] font-bold text-slate-600 dark:text-white/70 truncate leading-tight">
                          {holiday.name.length > 12 ? holiday.name.split(' ')[0] : holiday.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {holiday && hoveredDate === dateStr && dayInfo.isCurrentMonth && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.5 }}
                        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-[#0a1929]/95 px-4 py-3 shadow-xl dark:shadow-2xl backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{holiday.emoji}</span>
                          <div>
                            <div className="text-[13px] font-bold text-slate-900 dark:text-white">{holiday.name}</div>
                            <div className="text-[10px] font-semibold text-slate-500 dark:text-white/60 mt-0.5">
                              {holiday.type} •{' '}
                              {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 dark:border-white/15 bg-white/95 dark:bg-[#0a1929]/95" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
