'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

// Data for the 5 Steps
const steps = [
  {
    id: 'street',
    title: 'Street',
    headline: 'Street Signs',
    description: 'Street signs are Premium Parking location identifiers that provide clear calls to action and concise information. They are strategically placed outside the parking facility, near vehicle entry points to drive traffic in. Often times, street signs can carry promotions messages, such as Early Bird Rates.',
    markers: [
      { id: 'm1', label: 'STREET BLADE', x: 20, y: 70 },
    ],
  },
  {
    id: 'entry',
    title: 'Entry/Exit',
    headline: 'Entry/Exit Signs',
    description: "Entry and exit signs are designed to enhance the parker's experience and are specifically tailored to a parking facility.",
    markers: [
      { id: 'm2', label: 'ENTRY PYLON', x: 30, y: 55 },
    ],
  },
  {
    id: 'distributed',
    title: 'Distributed',
    headline: 'Distributed Signs',
    description: 'Distributed Signs are meant to serve as a visual guide, ensuring that parkers are aware of all the necessary information necessary to park. This can range from payment instructions to compliance warnings. These signs are placed strategically throughout locations in order to maximize their effectiveness.',
    markers: [
      { id: 'm3', label: 'TEXT TO PAY SIGN', x: 60, y: 75 },
    ],
  },
  {
    id: 'pedestrian',
    title: 'Pedestrian Egress',
    headline: 'Pedestrian Egress',
    description: 'If a parker has missed the previous Distributed Signage, Pedestrian egress signs will serve as a final reminder to parkers to pay accordingly. Their main goal is to ensure that the parker acknowledges any outstanding transactions or instructions that need to be followed before they leave the parking facility or reach their final destination.',
    markers: [
      { id: 'm4', label: 'ELEVATOR WRAP', x: 75, y: 35 },
    ],
  },
  {
    id: 'destination',
    title: 'Destination Sign',
    headline: 'Destination Sign',
    description: "Destination Signs are often custom to our partner's properties as they provide directional information or validation information for specific destinations. These are found inside partnering businesses.",
    markers: [
      { id: 'm5', label: 'INSTRUCTIONAL REMINDERS', x: 65, y: 15 },
      { id: 'm6', label: 'PARKING INFORMATION CARD', x: 85, y: 25 },
      { id: 'm7', label: 'VALIDATION INFORMATION', x: 60, y: 40 },
      { id: 'm8', label: 'VISITOR KIOSK', x: 85, y: 65 },
    ],
  },
];

const AUTO_PLAY_DURATION = 7000; // 7 seconds per step

export default function BlueprintAnimation() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  const activeStep = steps[activeStepIndex];

  // Auto-advance logic and smooth progress bar update
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(0);
      return;
    }

    startTimeRef.current = Date.now();
    
    // Update progress bar smoothly
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= AUTO_PLAY_DURATION) {
        // Advance to next step
        setActiveStepIndex((prev) => (prev + 1) % steps.length);
        startTimeRef.current = Date.now();
        setProgress(0);
      } else {
        setProgress((elapsed / AUTO_PLAY_DURATION) * 100);
      }
    }, 16); // ~60fps

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStepIndex, isPaused]);

  // Handlers for manual navigation
  const handleNext = () => {
    setActiveStepIndex((prev) => (prev + 1) % steps.length);
    startTimeRef.current = Date.now();
    setProgress(0);
    setIsPaused(true); // Pause if user takes manual control
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10s of inactivity
  };

  const handlePrev = () => {
    setActiveStepIndex((prev) => (prev - 1 + steps.length) % steps.length);
    startTimeRef.current = Date.now();
    setProgress(0);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const jumpToStep = (index: number) => {
    setActiveStepIndex(index);
    startTimeRef.current = Date.now();
    setProgress(0);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <div className="relative w-full min-h-[800px] bg-[#121212] text-white overflow-hidden py-16 px-6 md:px-16 font-sans">
      
      {/* ── Section Title ── */}
      <div className="max-w-[1440px] mx-auto mb-16 relative z-10">
        <h3 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6 border-b border-gray-800 pb-2 inline-block">
          How It Works
        </h3>
        <div>
          <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-[#0047BA] text-white px-2 py-1 leading-snug inline-block">
            Blueprints for Your Parking Operations.
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* ── Progress Bars Navigation ── */}
        <div className="flex w-full gap-2 md:gap-4 mb-16 overflow-x-auto no-scrollbar pb-2">
          {steps.map((step, index) => {
            const isActive = index === activeStepIndex;
            const isPast = index < activeStepIndex;
            
            return (
              <button
                key={step.id}
                onClick={() => jumpToStep(index)}
                className="flex-1 min-w-[120px] flex flex-col items-start gap-3 group"
              >
                <div className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors text-left w-full truncate">
                  {step.title}
                </div>
                {/* Track */}
                <div className="h-[2px] w-full bg-gray-800 relative overflow-hidden rounded-full">
                  {/* Fill */}
                  <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-white"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isActive ? `${progress}%` : isPast ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0 }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start relative min-h-[500px]">
          
          {/* ── Left Content Area ── */}
          <div className="lg:col-span-5 relative z-20 flex flex-col justify-between h-full pt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">
                  {activeStep.headline}
                </h2>
                <p className="text-gray-400 text-[15px] leading-relaxed max-w-md font-medium">
                  {activeStep.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-24">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all hover:bg-white/5 active:scale-95"
                aria-label="Previous step"
              >
                <ArrowLeft size={20} strokeWidth={1.5} />
              </button>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all hover:bg-white/5 active:scale-95"
                aria-label="Next step"
              >
                <ArrowRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* ── Right Isometric Illustration Area ── */}
          <div className="lg:col-span-7 relative h-[400px] sm:h-[500px] lg:h-[600px] w-full flex items-center justify-center lg:justify-end">
            
            {/* The Isometric Drawing (SVG) */}
            <div className="relative w-full max-w-[800px] h-full opacity-80 mix-blend-screen scale-110 lg:scale-125 origin-right">
              <svg viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                
                <g stroke="#ffffff" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round">
                  {/* Street Line */}
                  <path d="M 0 500 L 400 700 L 1000 400" strokeDasharray="8 8" />
                  
                  {/* Parking Spot Lines */}
                  <path d="M 200 400 L 350 475 L 500 400 L 350 325 Z" />
                  <path d="M 380 490 L 530 565 L 680 490 L 530 415 Z" />
                  <path d="M 560 580 L 710 655 L 860 580 L 710 505 Z" />
                  
                  {/* Handicap Symbol (simplified) */}
                  <path d="M 340 380 C 330 380 320 390 320 400 C 320 410 330 420 340 420 M 340 400 L 360 400 L 370 420 M 340 370 A 5 5 0 1 1 340.1 370" />
                  
                  {/* Building Base */}
                  <path d="M 600 350 L 600 150 L 900 0 L 900 200 Z" fill="#121212" />
                  <path d="M 600 350 L 900 500 L 900 200 L 600 150 Z" fill="#1A1A1A" />
                  
                  {/* Door & Windows */}
                  <path d="M 700 350 L 700 250 L 750 275 L 750 375 Z" />
                  <path d="M 620 250 L 620 180 L 660 200 L 660 270 Z" />
                  
                  {/* Kiosk / Pay Station */}
                  <path d="M 800 480 L 800 420 L 820 430 L 820 490 Z" />
                  <path d="M 785 410 L 800 420 L 820 430 L 805 420 Z" />
                  <path d="M 840 500 L 840 450 L 860 460 L 860 510 Z" />
                  
                  {/* ADA Entry Path */}
                  <path d="M 500 400 L 700 350" strokeDasharray="4 4" />
                </g>

                {/* The Red Car */}
                <g transform="translate(450, 480)">
                  {/* Body shadow/base */}
                  <path d="M -80 0 L 0 40 L 80 0 L 0 -40 Z" fill="#b91c1c" opacity="0.8" />
                  {/* Car Top */}
                  <path d="M -40 -10 L -10 -40 L 30 -20 L 0 10 Z" fill="#991b1b" />
                  {/* Windows */}
                  <path d="M -30 -10 L -10 -30 L 20 -15 L 0 5 Z" fill="#1f2937" />
                  {/* Rear */}
                  <path d="M -80 0 L -80 -15 L -40 -30 L -40 -15 Z" fill="#7f1d1d" />
                  {/* Front/Hood */}
                  <path d="M 30 -20 L 80 5 L 80 20 L 30 -5 Z" fill="#ef4444" />
                  {/* Wheels */}
                  <ellipse cx="-40" cy="15" rx="10" ry="15" fill="#111" transform="rotate(-30 -40 15)" />
                  <ellipse cx="30" cy="25" rx="10" ry="15" fill="#111" transform="rotate(-30 30 25)" />
                </g>
              </svg>

              {/* ── Overlay Tooltips ── */}
              <AnimatePresence>
                {activeStep.markers.map((marker) => (
                  <motion.div
                    key={marker.id}
                    initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1 }}
                    className="absolute flex items-center gap-3 z-30 drop-shadow-2xl"
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  >
                    {/* The yellow plus button */}
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-[#FFD100] flex items-center justify-center text-black shrink-0 relative cursor-pointer group hover:scale-110 transition-transform"
                      animate={{ boxShadow: ["0 0 0 0 rgba(255, 209, 0, 0.4)", "0 0 0 15px rgba(255, 209, 0, 0)"] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                    >
                      <Plus size={18} strokeWidth={3} className="transition-transform group-hover:rotate-90" />
                    </motion.div>
                    
                    {/* The label capsule */}
                    <div className="bg-white rounded-full px-4 py-2 text-[11px] font-bold tracking-widest text-black uppercase shadow-lg whitespace-nowrap">
                      {marker.label}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
