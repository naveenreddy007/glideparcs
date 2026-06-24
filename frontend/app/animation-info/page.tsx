'use client';

import { motion } from 'framer-motion';
import {
  DollarSign, Megaphone, BarChart3, Shield, CreditCard, Receipt, Banknote,
} from 'lucide-react';

const S = 0.5;
const nodeDelays = [0.16, 0.23, 0.30, 0.37, 0.44, 0.51];

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

export default function AnimationInfo() {
  return (
    <div className="min-h-[calc(100vh-72px)] w-full flex flex-col items-center justify-center overflow-hidden bg-[#24638F] relative p-4">
      {/* Subtle lighting overlay matching the login wall */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />

      {/* Scaled fixed-size diagram — same responsive pattern as /login */}
      <div className="relative w-[800px] h-[600px] scale-[0.45] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.9] xl:scale-100 origin-center">
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" fill="none">
          {/* Trunk: Logo → Dollar */}
          <AnimatedPath d="M 400 540 L 400 460" delay={0.1} />

          {/* Main horizontal bar */}
          <AnimatedPath d="M 80 460 L 720 460" delay={0.25} />

          {/* Left branches — risers get taller toward the edge */}
          <AnimatedPath d="M 320 460 L 320 380" delay={0.4} />
          <AnimatedPath d="M 200 460 L 200 300" delay={0.5} />
          <AnimatedPath d="M 80 460 L 80 200" delay={0.6} />

          {/* Right branches */}
          <AnimatedPath d="M 480 460 L 480 380" delay={0.4} />
          <AnimatedPath d="M 600 460 L 600 300" delay={0.5} />
          <AnimatedPath d="M 720 460 L 720 200" delay={0.6} />
        </svg>

        {/* Branch icon nodes */}
        {[
          { Icon: Receipt,    style: { left: '80px',  top: '200px' } },
          { Icon: Megaphone,  style: { left: '200px', top: '300px' } },
          { Icon: BarChart3,  style: { left: '320px', top: '380px' } },
          { Icon: Shield,     style: { left: '480px', top: '380px' } },
          { Icon: Banknote,   style: { left: '600px', top: '300px' } },
          { Icon: CreditCard, style: { left: '720px', top: '200px' } },
        ].map(({ Icon, style }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.4, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: S + 0.5 + nodeDelays[i],
              type: 'spring',
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

        {/* Root Dollar Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: S + 0.15, type: 'spring', stiffness: 130, damping: 14 }}
          className="absolute left-[400px] top-[460px] w-[72px] h-[72px] bg-white rounded-[20px] flex items-center justify-center text-[#24638F] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] border-2 border-white -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-transform cursor-default z-20"
        >
          <DollarSign size={34} strokeWidth={2.5} />
        </motion.div>

        {/* GLIDE PARCS Logo Lockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: S + 0.5 }}
          className="absolute left-[400px] top-[540px] -translate-x-1/2 -translate-y-1/2 bg-white px-7 py-3 rounded-2xl flex items-center gap-2 shadow-[0_15px-30px_-5px_rgba(0,0,0,0.2)]"
        >
          <span className="text-[#24638F] font-bold text-2xl tracking-tighter">GLIDE</span>
          <div className="w-8 h-8 bg-[#24638F] text-white rounded-[8px] flex items-center justify-center font-bold text-xl leading-none">
            G
          </div>
          <span className="text-[#24638F] font-light text-2xl tracking-[0.2em] ml-1">PARCS</span>
        </motion.div>
      </div>
    </div>
  );
}
