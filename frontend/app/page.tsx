'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, LayoutDashboard, Sparkles, X, ExternalLink } from 'lucide-react';
import FloatingParticles from './components/FloatingParticles';
import { ThemeToggle } from './components/ThemeToggle';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#24638F] text-white selection:bg-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
      <FloatingParticles />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-[#24638F] shadow-inner">
            G
          </div>
          <div>
            <div className="text-lg font-bold tracking-[-0.5px]">GLIDE PARCS</div>
            <div className="text-[10px] uppercase tracking-[3px] text-white/70">Premium Parking</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link href="#" className="hover:text-white transition-colors">Company News</Link>
          <Link href="#" className="hover:text-white transition-colors">Upcoming Events</Link>
          <Link href="/holiday-calendar" className="hover:text-white transition-colors">Holiday Calendar</Link>
          <Link href="#" className="hover:text-white transition-colors">Organization Hierarchy</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-[#24638F] shadow-lg transition hover:scale-[1.02]"
          >
            Staff Login
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-white/80 backdrop-blur"
        >
          <Sparkles size={15} /> Internal Operations Portal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="max-w-5xl text-5xl font-semibold tracking-[-2px] md:text-7xl"
        >
          Great Places deserve a clean control center.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 max-w-2xl text-lg leading-8 text-white/75 md:text-xl"
        >
          Glideparcs staff portal for dashboard visibility, operational control, and internal team workflows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-[#24638F] shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:scale-[1.03]"
          >
            Enter Staff Portal <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/15"
          >
            Preview Dashboard <LayoutDashboard size={18} />
          </Link>
        </motion.div>

        <div className="mt-16 grid w-full max-w-3xl gap-4 md:grid-cols-3">
          {[
            { title: 'Secure Entry', icon: Shield },
            { title: 'Dashboard First', icon: LayoutDashboard },
            { title: 'Backend Ready', icon: Sparkles },
          ].map(({ title, icon: Icon }) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <Icon className="mx-auto mb-3 text-white" size={26} />
              <div className="font-semibold">{title}</div>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white text-slate-800 shadow-2xl ring-1 ring-white/10"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute right-6 top-6 z-10 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/40 hover:scale-105"
              >
                <X size={20} />
              </button>

              <div className="relative h-64 w-full bg-[#24638F] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#24638F] via-[#24638F]/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#24638F] to-transparent opacity-80"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md"
                  >
                    Message from Adam
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-extrabold tracking-tight md:text-5xl"
                  >
                    Welcome to Premium Parking India
                  </motion.h2>
                </div>
              </div>

              <div className="px-8 pb-10 pt-8">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 text-[1.1rem] leading-relaxed text-slate-600"
                >
                  The team in India will focus on advancing Premium Parking's technology, GLIDEPARCS®, from platform enhancements to performance and scalability, continuing to deliver seamless, gateless parking experiences at scale. They'll work in close partnership with our U.S. teams, accelerating how quickly we bring new capabilities to market and raising the bar on what our platform can do.
                </motion.p>

                <motion.a 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  href="https://newsroom.premiumparking.com/premium-parking-opens-international-office-in-top-tech-hub-hyderabad" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-[#24638F]/30 hover:bg-[#24638F]/5 hover:shadow-md"
                >
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-bold text-slate-800 transition-colors group-hover:text-[#24638F]">Premium Parking Opens International Office in Hyderabad</div>
                    <div className="mt-1 text-sm font-medium text-slate-500">newsroom.premiumparking.com</div>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-all group-hover:scale-110 group-hover:bg-[#24638F] group-hover:text-white group-hover:shadow-md">
                    <ExternalLink size={18} />
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
