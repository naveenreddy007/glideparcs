'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Holiday {
  date: string;
  name: string;
  type: string;
  color: string;
}

interface GlassCalendarProps {
  holidays: Holiday[];
}

export default function GlassCalendar({ holidays }: GlassCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [direction, setDirection] = useState(0);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  if (typeof window !== 'undefined' && !isMounted) {
     setTimeout(() => setIsMounted(true), 0);
  }

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date(); 
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const gridDays = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false, monthOffset: -1 });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    gridDays.push({ day: i, isCurrentMonth: true, monthOffset: 0 });
  }

  const remainingCells = 42 - gridDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridDays.push({ day: i, isCurrentMonth: false, monthOffset: 1 });
  }

  const getFormattedDate = (dayInfo: any) => {
    const d = new Date(year, month + dayInfo.monthOffset, dayInfo.day);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0, scale: 0.95 }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 40 : -40, opacity: 0, scale: 0.95 }),
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[40px] border border-white/20 bg-white/5 p-6 backdrop-blur-[40px] shadow-2xl ring-1 ring-white/10 md:p-8">
      {/* Background glowing orbs */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[100px] mix-blend-screen animate-pulse"></div>
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-blue-600/30 blur-[120px] mix-blend-screen" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>

      <div className="relative z-10 flex items-end justify-between mb-10 border-b border-white/10 pb-6">
        <div>
          <motion.div 
            key={month}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <h2 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 md:text-5xl">
              {monthNames[month]}
            </h2>
            <span className="text-3xl font-light text-white/40 md:text-4xl">{year}</span>
          </motion.div>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur transition-all hover:bg-white/20 hover:scale-105 hover:border-white/30 active:scale-95">
            <ChevronLeft size={22} className="transition-transform group-hover:-translate-x-1 text-white/70 group-hover:text-white" />
          </button>
          <button onClick={nextMonth} className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur transition-all hover:bg-white/20 hover:scale-105 hover:border-white/30 active:scale-95">
            <ChevronRight size={22} className="transition-transform group-hover:translate-x-1 text-white/70 group-hover:text-white" />
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-7 gap-2 mb-4 text-center text-sm font-bold uppercase tracking-[3px] text-white/40">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      <div className="relative z-10 min-h-[500px]">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 0.8 }}
            className="grid grid-cols-7 gap-3"
          >
            {gridDays.map((dayInfo, i) => {
              const formattedDate = getFormattedDate(dayInfo);
              const holiday = holidays.find(h => h.date === formattedDate);
              const isToday = isMounted && formattedDate === todayFormatted;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredDate(formattedDate)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`relative group flex h-24 flex-col items-center justify-center rounded-2xl border transition-all duration-300 ${
                    !dayInfo.isCurrentMonth 
                      ? 'border-transparent bg-transparent opacity-30 hover:opacity-60' 
                      : holiday
                        ? 'border-white/30 bg-white/15 shadow-[0_8px_32px_rgba(255,255,255,0.05)] backdrop-blur-xl hover:border-white/50 hover:bg-white/25 hover:-translate-y-1'
                        : isToday
                          ? 'border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                          : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1'
                  }`}
                >
                  <span className={`text-xl font-medium ${isToday ? 'text-cyan-300' : dayInfo.isCurrentMonth ? 'text-white' : 'text-white/50'}`}>
                    {dayInfo.day}
                  </span>
                  
                  {isToday && <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />}

                  {/* Fix: Animate presence on holiday marker itself so it pops out when filtered out */}
                  <AnimatePresence>
                    {holiday && (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        exit={{ scale: 0 }} 
                        className="absolute bottom-3"
                      >
                        <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${holiday.color} shadow-lg shadow-white/20`} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {holiday && hoveredDate === formattedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 w-48 rounded-2xl border border-white/20 bg-[#1a2b4c]/90 p-3 shadow-2xl backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${holiday.color}`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{holiday.type}</span>
                        </div>
                        <div className="text-sm font-semibold text-white leading-tight">{holiday.name}</div>
                        <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-white/20 bg-[#1a2b4c]/90"></div>
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
