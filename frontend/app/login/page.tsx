'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, Megaphone, BarChart3, Shield, CreditCard, DollarSign,
  ArrowRight, FileText, Settings, Users, AlertTriangle, Box
} from 'lucide-react';
import FloatingParticles from '../components/FloatingParticles';
import { ThemeToggle } from '../components/ThemeToggle';

// Splash screen runs for 2.4s — all page animations must wait for it
const S = 2.5;
const nodeDelays = [0.16, 0.23, 0.30, 0.37, 0.44, 0.51, 0.58];

// Selection of icons for the right wall pattern (matching Image 2)
const patternIcons = [
  Shield, CreditCard, Users, Settings, FileText, Users, AlertTriangle, Box, Megaphone, Cloud
];

// Animated SVG path that draws itself
function AnimatedPath({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <motion.path
      d={d}
      stroke="#ffffff"
      strokeWidth="2.5"
      strokeOpacity="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ 
        pathLength: { delay: S + delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        opacity: { delay: S + delay, duration: 0.15 },
      }}
    />
  );
}

export default function UnifiedLandingLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Temporary frontend-only login.
    // Later this will call the Go Fiber API.
    localStorage.setItem('glideparcs_user', JSON.stringify({
      id: 'demo-user',
      email,
      fullName: email.split('@')[0] || 'Glideparcs User',
      role: 'admin'
    }));

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden selection:bg-[#24638F]/20">
      
      {/* LEFT PANE: The Premium Blue Wall */}
      <div className="relative w-full md:w-[55%] lg:w-[60%] bg-[#24638F] flex flex-col justify-between p-8 md:p-12 lg:p-20 overflow-hidden text-white z-10 min-h-[50vh] md:min-h-screen">
        {/* Subtle lighting overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none z-0" />
        
        {/* Floating Bokeh Particles */}
        <FloatingParticles />
        
        {/* Top Header: The Wall Lockup */}
        <div className="relative z-10">
          <div className="inline-block">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: S, ease: "easeOut" }}
              className="font-yellowtail text-[56px] sm:text-[80px] lg:text-[110px] leading-[0.8] tracking-normal text-white drop-shadow-sm pr-4 -rotate-2 origin-left"
            >
              Great Places
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: S + 0.3 }}
              className="font-montserrat text-[14px] sm:text-[16px] lg:text-[20px] tracking-[0.2em] sm:tracking-[0.25em] text-white/90 mt-4 sm:mt-5 font-light uppercase pl-2"
            >
              PARTNER WITH <span className="font-black text-white ml-2 text-[18px] sm:text-[22px] lg:text-[28px] tracking-[0.05em]">PREMIUM</span>
            </motion.div>
          </div>
        </div>

        {/* Central Diagram: The Connected Icons Tree with Animated Line Drawing */}
        <div className="relative flex-1 flex items-center justify-center py-16 md:py-0 z-10">
          <div className="relative w-[480px] h-[340px] scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-center">
            {/* SVG Connection Lines — each draws itself stroke-by-stroke */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 480 340" fill="none">
              {/* Trunk draws first */}
              <AnimatedPath d="M 240 290 L 240 240" delay={0.1} />
              {/* Left branches draw outward */}
              <AnimatedPath d="M 240 240 L 170 240 L 170 200" delay={0.3} />
              <AnimatedPath d="M 170 240 L 100 240 L 100 150" delay={0.5} />
              <AnimatedPath d="M 100 240 L 40 240 L 40 80" delay={0.7} />
              {/* Right branches draw outward */}
              <AnimatedPath d="M 240 240 L 310 240 L 310 200" delay={0.3} />
              <AnimatedPath d="M 310 240 L 380 240 L 380 150" delay={0.5} />
              <AnimatedPath d="M 380 240 L 440 240 L 440 80" delay={0.7} />
            </svg>

            {/* Nodes pop in after their branch reaches them */}
            {[
              { Icon: Cloud,      style: { left: '40px',  top: '80px' } },
              { Icon: Megaphone,  style: { left: '100px', top: '150px' } },
              { Icon: BarChart3,  style: { left: '170px', top: '200px' } },
              { Icon: Shield,     style: { left: '310px', top: '200px' } },
              { Icon: Box,        style: { left: '380px', top: '150px' } },
              { Icon: CreditCard, style: { left: '440px', top: '80px' } },
            ].map(({ Icon, style }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.4, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: S + 0.5 + nodeDelays[i],
                  type: "spring",
                  stiffness: 110,
                  damping: 12,
                  mass: 0.8,
                }}
                className="absolute w-[64px] h-[64px] bg-white rounded-2xl flex items-center justify-center text-[#24638F] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] border border-white -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-default"
                style={style}
              >
                <Icon size={28} strokeWidth={2.2} />
              </motion.div>
            ))}

            {/* Bottom Root Node — appears after trunk draws */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: S + 0.15, type: "spring", stiffness: 130, damping: 14 }}
              className="absolute left-[240px] top-[290px] w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[#24638F] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] border-2 border-white -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-transform cursor-default z-20"
            >
              <DollarSign size={34} strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>

        {/* Bottom Logo Lockup */}
        <div className="relative z-10 flex justify-center mt-auto pb-4 md:pb-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: S + 0.5 }}
            className="bg-white px-7 py-3 rounded-2xl flex items-center gap-2 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)]"
          >
            <span className="text-[#24638F] font-bold text-2xl tracking-tighter">GLIDE</span>
            <div className="w-8 h-8 bg-[#24638F] text-white rounded-[8px] flex items-center justify-center font-bold text-xl leading-none">
              G
            </div>
            <span className="text-[#24638F] font-light text-2xl tracking-[0.2em] ml-1">PARCS</span>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANE: Login & Icon Wall */}
      <div className="relative w-full md:w-[45%] lg:w-[40%] flex items-center justify-center p-6 md:p-12 overflow-hidden min-h-[60vh] md:min-h-screen">
        
        {/* Theme Toggle in top right */}
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        
        {/* Repeating Icon Background Pattern */}
        <div className="absolute inset-0 opacity-[0.10] dark:opacity-[0.15] pointer-events-none grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 gap-y-12 gap-x-8 p-8 justify-items-center content-start">
           {Array.from({ length: 150 }).map((_, i) => {
             const Icon = patternIcons[i % patternIcons.length];
             return (
               <div key={i} className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                 <Icon size={26} strokeWidth={1.5} className="text-black dark:text-white" />
               </div>
             );
           })}
        </div>

        {/* Floating Login Card (Eye-safe Warm White) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: S + 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 w-full max-w-[400px] bg-[#FAFAF9] dark:bg-slate-800 border border-gray-200/60 dark:border-white/10 p-8 md:p-12 rounded-[36px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]"
        >
          <div className="mb-10 text-center">
            <h2 className="text-[28px] font-semibold text-gray-800 dark:text-white tracking-tight">Welcome</h2>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-2">Sign in to the staff portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2.5 px-1">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="name@premiumparking.com"
                className="w-full bg-white dark:bg-slate-900/50 border border-gray-200/80 dark:border-white/10 focus:border-[#24638F] dark:focus:border-[#55A6E2] focus:ring-2 focus:ring-[#24638F]/20 dark:focus:ring-[#55A6E2]/20 rounded-2xl px-5 h-[56px] text-[15px] text-gray-800 dark:text-white placeholder:text-gray-400 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2.5 px-1">
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[12px] font-medium text-[#24638F] dark:text-[#55A6E2] hover:text-[#184462] dark:hover:text-[#7ABDF0] transition-colors">Forgot?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••••••"
                className="w-full bg-white dark:bg-slate-900/50 border border-gray-200/80 dark:border-white/10 focus:border-[#24638F] dark:focus:border-[#55A6E2] focus:ring-2 focus:ring-[#24638F]/20 dark:focus:ring-[#55A6E2]/20 rounded-2xl px-5 h-[56px] text-[15px] text-gray-800 dark:text-white placeholder:text-gray-400 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[13px] text-red-600 bg-red-50/80 px-4 py-3 rounded-xl border border-red-100">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-[56px] mt-2 bg-[#24638F] hover:bg-[#184462] active:bg-[#113046] text-white disabled:opacity-70 disabled:cursor-not-allowed transition-all rounded-2xl font-semibold text-[16px] flex items-center justify-center gap-2.5 shadow-[0_10px_20px_-5px_rgba(36,99,143,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(36,99,143,0.4)] hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In to Glideparcs <ArrowRight size={18} /></>
              )}
            </button>
          </form>
          
          <div className="mt-10 text-center text-[11px] text-gray-400 dark:text-gray-500 font-medium tracking-wide uppercase">
            Internal Secure System • Access Monitored
          </div>
        </motion.div>
      </div>

    </div>
  );
}
