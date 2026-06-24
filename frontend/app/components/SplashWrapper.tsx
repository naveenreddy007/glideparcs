'use client';

import React, { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <SplashScreen>
      {children}
      {mounted && (
        <Toaster
          position="top-right"
          theme={currentTheme as 'light' | 'dark' | 'system'}
          toastOptions={{
            classNames: {
              toast: "bg-white dark:bg-[#1E293B] border border-gray-200/80 dark:border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] rounded-2xl px-5 py-4",
              title: "text-gray-900 dark:text-white font-semibold text-[14px]",
              description: "text-gray-500 dark:text-gray-400 font-medium text-[13px]",
            }
          }}
        />
      )}
    </SplashScreen>
  );
}
