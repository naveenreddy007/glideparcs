'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Map, AlertCircle, Goal, CircleDot } from 'lucide-react';

const steps = [
  {
    title: 'Street Signs',
    icon: MapPin,
    description: 'Street signs are crucial to advertise the location and creating a positive first impression for parkers.'
  },
  {
    title: 'Entry/Exit',
    icon: Navigation,
    description: "Entry and exit signs are designed to enhance the parker's experience and are specifically tailored to a parking facility."
  },
  {
    title: 'Distributed',
    icon: Map,
    description: 'Distributed Signs are meant to serve as a visual guide, ensuring that parkers are aware of all the necessary information.'
  },
  {
    title: 'Pedestrian Egress',
    icon: AlertCircle,
    description: 'Pedestrian egress signs will serve as a final reminder to parkers to pay accordingly before they leave.'
  },
  {
    title: 'Destination Sign',
    icon: Goal,
    description: "Destination Signs are often custom to our partner's properties as they provide directional or validation information."
  }
];

const ANIMATION_SPEED = 7000;

export default function BlueprintAnimation() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, ANIMATION_SPEED);
    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = steps[activeStep].icon;

  return (
    <div className="flex flex-col gap-10 w-full max-w-2xl mx-auto z-20">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white"
      >
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Blueprints for Your Parking Operations.</h2>
        <p className="text-white/70 text-lg md:text-xl">Discover the GLIDEPARCS step-by-step methodology.</p>
      </motion.div>

      {/* Main Diagram Area */}
      <div className="relative h-[250px] md:h-[300px] w-full bg-black/10 rounded-[32px] border border-white/10 overflow-hidden flex items-center justify-center backdrop-blur-md">
        
        {/* Animated Blueprint Background grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10 flex flex-col items-center text-center px-8"
          >
            <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-xl relative">
              <ActiveIcon size={40} className="text-white" strokeWidth={1.5} />
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{steps[activeStep].title}</h3>
            <p className="text-white/80 text-sm md:text-base max-w-md leading-relaxed">
              {steps[activeStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive Progress Bars */}
      <div className="grid grid-cols-5 gap-2 md:gap-4 w-full">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isPast = index < activeStep;
          
          return (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className="flex flex-col gap-2 group cursor-pointer text-left"
            >
              {/* Progress Line */}
              <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden relative">
                {/* Active Bar fills up */}
                {isActive && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: ANIMATION_SPEED / 1000, ease: 'linear' }}
                  />
                )}
                {/* Past Bar is completely full */}
                {isPast && (
                  <div className="absolute inset-y-0 left-0 bg-white rounded-full w-full" />
                )}
                {/* Hover indicator for inactive bars */}
                {!isActive && !isPast && (
                  <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full w-0 group-hover:w-full transition-all duration-300" />
                )}
              </div>
              
              {/* Step Label */}
              <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
              }`}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
