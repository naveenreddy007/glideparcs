import React from 'react';
import BlueprintAnimation from '../components/BlueprintAnimation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BlueprintPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Simple Top Header to go back */}
      <header className="absolute top-0 left-0 w-full p-6 z-50">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </header>

      {/* The full screen blueprint component */}
      <main className="pt-16 lg:pt-0 min-h-screen flex items-center justify-center">
        <BlueprintAnimation />
      </main>
    </div>
  );
}
