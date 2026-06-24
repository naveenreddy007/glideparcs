'use client';

import React from 'react';

function seededUnit(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

const particles = Array.from({ length: 18 }).map((_, i) => ({
  size: (4 + seededUnit(i, 1) * 18).toFixed(2),
  left: (seededUnit(i, 2) * 100).toFixed(2),
  top: (seededUnit(i, 3) * 100).toFixed(2),
  delay: (seededUnit(i, 4) * 8).toFixed(2),
  duration: (12 + seededUnit(i, 5) * 16).toFixed(2),
  opacity: (0.04 + seededUnit(i, 6) * 0.08).toFixed(4),
}));

export default function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map(({ size, left, top, delay, duration, opacity }, i) => {
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-float"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              opacity,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
