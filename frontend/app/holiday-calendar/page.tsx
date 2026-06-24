'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe2, Zap, Search, Download, Clock } from 'lucide-react';
import FloatingParticles from '../components/FloatingParticles';
import GlassCalendar, { Holiday } from '../components/GlassCalendar';

const allHolidays: Holiday[] = [
  { date: '2026-01-01', name: "New Year's Day", type: 'Global', color: 'from-blue-400 to-indigo-500' },
  { date: '2026-01-26', name: 'Republic Day', type: 'India', color: 'from-orange-400 to-green-500' },
  { date: '2026-05-25', name: 'Memorial Day', type: 'US', color: 'from-red-400 to-blue-500' },
  { date: '2026-07-04', name: 'Independence Day', type: 'US', color: 'from-red-500 to-blue-600' },
  { date: '2026-08-15', name: 'Independence Day', type: 'India', color: 'from-orange-500 to-green-600' },
  { date: '2026-11-08', name: 'Diwali', type: 'India', color: 'from-yellow-400 to-orange-500' },
  { date: '2026-11-26', name: 'Thanksgiving', type: 'US', color: 'from-orange-400 to-amber-600' },
  { date: '2026-12-25', name: 'Christmas', type: 'Global', color: 'from-green-400 to-red-500' }
];

export default function HolidayCalendarPage() {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  import('react').then((React) => {
    // using dynamic effect to avoid import changes
  });
  
  if (typeof window !== 'undefined' && !isMounted) {
     setTimeout(() => setIsMounted(true), 0);
  }

  const filteredHolidays = useMemo(() => {
    return allHolidays.filter(h => {
      const matchesRegion = activeRegion === 'All' || h.type === 'Global' || h.type === activeRegion;
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [activeRegion, searchQuery]);

  const nextHoliday = useMemo(() => {
    const today = new Date();
    const upcoming = filteredHolidays.filter(h => new Date(h.date) >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] || null;
  }, [filteredHolidays]);

  const daysUntilNext = useMemo(() => {
    if (!nextHoliday) return null;
    const today = new Date();
    const holidayDate = new Date(nextHoliday.date);
    const diffTime = holidayDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [nextHoliday]);

  const downloadICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Glideparcs//Holiday Calendar//EN\n";
    filteredHolidays.forEach(h => {
      const d = h.date.replace(/-/g, '');
      icsContent += `BEGIN:VEVENT\nDTSTART;VALUE=DATE:${d}\nDTEND;VALUE=DATE:${d}\nSUMMARY:${h.name} (${h.type})\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `glideparcs-holidays-${activeRegion.toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0F2032] text-white selection:bg-white/20 pb-20">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2032] via-[#1a4160] to-[#0F2032] opacity-80" />
        <div className="absolute left-0 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#24638F]/30 blur-[150px]"></div>
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-600/20 blur-[150px]"></div>
      </div>
      
      <FloatingParticles />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Portal
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link href="#" className="hover:text-white transition-colors">Company News</Link>
          <Link href="#" className="hover:text-white transition-colors">Upcoming Events</Link>
          <Link href="/holiday-calendar" className="text-cyan-300 font-bold hover:text-cyan-200 transition-colors">Holiday Calendar</Link>
          <Link href="#" className="hover:text-white transition-colors">Organization Hierarchy</Link>
        </nav>

        {/* Global Export Button */}
        <button 
          onClick={downloadICS}
          className="group flex items-center gap-2 rounded-full bg-cyan-500/20 px-5 py-2.5 text-sm font-bold text-cyan-300 border border-cyan-400/30 backdrop-blur-md transition-all hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          <Download size={16} className="transition-transform group-hover:scale-110" /> Add to Calendar
        </button>
      </header>

      <section className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 mt-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-cyan-300 backdrop-blur shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Zap size={15} className="fill-cyan-300" /> Enterprise Schedule
            </div>
            <h1 className="text-5xl font-black tracking-tighter md:text-7xl">
              Holiday Calendar <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/10">2026</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-white/60 font-medium">
              Sync your workflows with global operations. Plan ahead across all international Glideparcs offices.
            </p>
          </motion.div>

          {/* Quick Search */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-sm"
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search size={18} className="text-white/40" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search holidays..." 
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-white/40 backdrop-blur-xl transition-all focus:border-cyan-400/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-400/10"
            />
          </motion.div>
        </div>

        <div className="grid gap-10 xl:grid-cols-[1fr_400px]">
          {/* Main Calendar Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <GlassCalendar holidays={filteredHolidays} />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Sync Regions Filter */}
            <div className="rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-[30px] shadow-2xl">
              <h3 className="mb-4 text-xl font-bold tracking-tight">Sync Regions</h3>
              <div className="flex flex-wrap gap-3">
                {['All', 'US', 'India'].map(region => (
                  <button 
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                      activeRegion === region 
                        ? 'bg-white text-[#0F2032] shadow-lg scale-105' 
                        : 'border border-white/20 bg-white/5 text-white hover:bg-white/15 hover:border-white/40'
                    }`}
                  >
                    {region === 'All' ? 'Global Core' : region === 'US' ? 'US Markets' : 'India Hub'}
                  </button>
                ))}
              </div>
            </div>

            {/* Countdown Widget */}
            <AnimatePresence mode="popLayout">
              {isMounted && nextHoliday && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative rounded-[40px] border border-cyan-400/30 bg-cyan-900/20 p-8 backdrop-blur-[30px] shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-[40px]"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-300">
                          <Clock size={16} /> Next Up
                        </div>
                        <div className="text-2xl font-black text-white">{nextHoliday.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                          {daysUntilNext}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest text-cyan-300/70">Days Left</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vertical Timeline */}
            <div className="relative rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[600px]">
              <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-indigo-500/20 blur-[80px]"></div>
              
              <h3 className="mb-6 flex shrink-0 items-center gap-3 text-2xl font-bold tracking-tight">
                <Globe2 className="text-cyan-400" size={28} /> Upcoming Focus
              </h3>
              
              <div className="relative ml-4 flex flex-col gap-8 border-l-2 border-white/10 pb-4 pr-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
                <AnimatePresence>
                  {filteredHolidays.map((holiday, i) => (
                    <motion.div 
                      layout
                      key={holiday.name + holiday.date} 
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="relative pl-8 group"
                    >
                      {/* Glowing Node */}
                      <div className={`absolute -left-[11px] top-1.5 h-5 w-5 rounded-full bg-gradient-to-r ${holiday.color} border-[4px] border-[#1a2b4c] shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform group-hover:scale-125`}></div>
                      
                      <div className="rounded-3xl border border-white/5 bg-white/5 p-5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl">
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
                          {holiday.type}
                        </div>
                        <div className="text-xl font-bold text-white transition-colors group-hover:text-cyan-200">{holiday.name}</div>
                        <div className="mt-1 text-sm font-semibold text-white/50">
                          {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredHolidays.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-8 text-white/40 font-medium italic">
                      No holidays match your criteria.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
