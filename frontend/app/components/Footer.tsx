import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#0B1724] border-t border-gray-200 dark:border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="mb-6 relative h-12 w-48">
              {/* Note: We use a standard img tag here instead of next/image to avoid config issues with local unoptimized images for now */}
              <img 
                src="/footer-logo.png" 
                alt="Company Logo" 
                className="h-full w-full object-contain object-left"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
              GLIDEPARCS — PEOPLE DESERVE GREAT PLACES • PARTNER WITH PREMIUM
            </p>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} Premium Parking. All rights reserved.
            </div>
          </div>

          {/* Support & Resources */}
          <div className="md:col-span-4 flex flex-col space-y-4 md:pl-12">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
              Support & Resources
            </h3>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#24638F] dark:hover:text-[#55A6E2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md inline-block w-fit">
              Help Center
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#24638F] dark:hover:text-[#55A6E2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md inline-block w-fit">
              Documentation
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#24638F] dark:hover:text-[#55A6E2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md inline-block w-fit">
              System Status
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#24638F] dark:hover:text-[#55A6E2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md inline-block w-fit">
              Contact Support
            </Link>
          </div>

          {/* Legal & Compliance */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
              Legal
            </h3>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#24638F] dark:hover:text-[#55A6E2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md inline-block w-fit">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#24638F] dark:hover:text-[#55A6E2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md inline-block w-fit">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#24638F] dark:hover:text-[#55A6E2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md inline-block w-fit">
              Cookie Settings
            </Link>
            <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#24638F] dark:hover:text-[#55A6E2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md inline-block w-fit">
              Compliance
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
