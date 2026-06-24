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
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] p-5 md:p-7">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full bg-cyan-500/8 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-blue-600/10 blur-[100px]" />

      {/* Month header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${year}-${month}`}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-baseline gap-3"
          >
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{MONTH_NAMES[month]}</h2>
            <span className="text-xl font-light text-white/25 md:text-2xl">{year}</span>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1.5">
          <button onClick={handlePrev} className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/15 hover:border-white/20 active:scale-90">
            <ChevronLeft size={18} className="text-white/40 group-hover:text-white transition-colors" />
          </button>
          <button onClick={handleNext} className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/15 hover:border-white/20 active:scale-90">
            <ChevronRight size={18} className="text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Day name headers */}
      <div className="relative z-10 grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[10px] font-bold uppercase tracking-[2px] py-1 ${
              i === 0 || i === 6 ? 'text-white/20' : 'text-white/35'
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
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                  className={`relative group flex flex-col rounded-xl border transition-all duration-200 min-h-[72px] md:min-h-[82px] p-1.5 ${
                    !dayInfo.isCurrentMonth
                      ? 'border-transparent opacity-15'
                      : holiday
                        ? 'border-white/15 bg-white/[0.07] hover:bg-white/[0.14] hover:-translate-y-0.5 hover:shadow-lg cursor-pointer'
                        : isToday
                          ? 'border-cyan-400/30 bg-cyan-400/[0.06]'
                          : isWeekend
                            ? 'border-white/[0.03] bg-white/[0.015]'
                            : 'border-white/[0.04] bg-white/[0.025] hover:bg-white/[0.06] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Day number */}
                  <span
                    className={`text-sm font-semibold leading-none ${
                      isToday
                        ? 'text-cyan-300'
                        : dayInfo.isCurrentMonth
                          ? isWeekend ? 'text-white/30' : 'text-white/70'
                          : 'text-white/20'
                    }`}
                  >
                    {dayInfo.day}
                  </span>

                  {/* Today pulsing dot */}
                  {isToday && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] pulsing-ring" />
                  )}

                  {/* Holiday content inside cell */}
                  {holiday && dayInfo.isCurrentMonth && (
                    <div className="mt-auto flex flex-col gap-0.5 w-full overflow-hidden">
                      <div className={`h-[3px] w-full rounded-full bg-gradient-to-r ${holiday.color}`} />
                      <div className="flex items-center gap-0.5">
                        <span className="text-[11px] leading-none shrink-0">{holiday.emoji}</span>
                        <span className="text-[8px] md:text-[9px] font-bold text-white/50 truncate leading-tight">
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
                        transition={{ duration: 0.12 }}
                        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-white/15 bg-[#0a1929]/95 px-4 py-3 shadow-2xl backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{holiday.emoji}</span>
                          <div>
                            <div className="text-[13px] font-bold text-white">{holiday.name}</div>
                            <div className="text-[10px] font-semibold text-white/40 mt-0.5">
                              {holiday.type} •{' '}
                              {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/15 bg-[#0a1929]/95" />
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
