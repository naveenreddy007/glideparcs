'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [showMiniLoader, setShowMiniLoader] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('glideparcs_splash_seen');

    if (!hasSeenSplash) {
      // First visit this session → show full cinematic splash
      const frame = requestAnimationFrame(() => {
        setShowMiniLoader(false);
        setShowSplash(true);
      });
      const timer = setTimeout(() => {
        setShowSplash(false);
        setReady(true);
        sessionStorage.setItem('glideparcs_splash_seen', '1');
      }, 2400);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
      };
    } else {
      // Already seen splash → show the premium Aurora loader
      const timer = setTimeout(() => {
        setShowMiniLoader(false);
        setReady(true);
      }, 1500); // 1.5s to let them enjoy the visual treat
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* FULL CINEMATIC SPLASH — first visit only */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#24638F]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />

            <div className="flex flex-col items-center gap-8 relative z-10">
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white font-bold text-4xl md:text-5xl tracking-tighter"
                >
                  GLIDE
                </motion.span>

                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 0.8, type: "spring", stiffness: 120, damping: 12 }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                >
                  <span className="text-[#24638F] font-bold text-3xl md:text-4xl leading-none">G</span>
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white font-light text-4xl md:text-5xl tracking-[0.2em]"
                >
                  PARCS
                </motion.span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-white/60 text-sm font-medium uppercase tracking-[4px]"
              >
                A Premium Parking Company
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mt-4"
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.3, duration: 1.0, ease: "easeInOut" }}
                  className="h-full bg-white/60 rounded-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AURORA GLASS LOADER — subsequent page loads */}
      <AnimatePresence>
        {!showSplash && showMiniLoader && (
          <motion.div
            key="aurora-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)", scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B1724] overflow-hidden"
          >
            {/* The Aurora Background Mesh */}
            <div className="absolute inset-0 z-0">
              {/* Deep blue base gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B1724] via-[#112435] to-[#0A121A]" />
              
              {/* Floating Aurora Orbs */}
              <motion.div
                animate={{ 
                  x: ['-20%', '20%', '-10%', '-20%'], 
                  y: ['-10%', '10%', '20%', '-10%'],
                  scale: [1, 1.2, 0.9, 1] 
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-1/4 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[#24638F]/30 rounded-full blur-[100px] mix-blend-screen"
              />
              
              <motion.div
                animate={{ 
                  x: ['20%', '-20%', '10%', '20%'], 
                  y: ['20%', '-10%', '10%', '20%'],
                  scale: [0.9, 1.1, 1.3, 0.9] 
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-[#3B82F6]/20 rounded-full blur-[90px] mix-blend-screen"
              />

              <motion.div
                animate={{ 
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"
              />
            </div>

            {/* Center: The Ripple */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                
                {/* Ripple rings — staggered, endlessly expanding and fading */}
                {[0, 0.8, 1.6, 2.4].map((delay, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [0.35, 1.4], 
                      opacity: [0.6, 0],
                    }}
                    transition={{ 
                      duration: 3.2, 
                      delay, 
                      repeat: Infinity, 
                      ease: "easeOut" 
                    }}
                    className="absolute inset-0 rounded-full border border-white/30"
                  />
                ))}

                {/* Soft static glow ring behind the orb */}
                <motion.div
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-36 h-36 rounded-full bg-[#24638F]/40 blur-2xl"
                />

                {/* Inner Frosted Glass Orb */}
                <div className="absolute w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.3)]">
                  <motion.span 
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white font-bold text-4xl leading-none select-none"
                  >
                    G
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
