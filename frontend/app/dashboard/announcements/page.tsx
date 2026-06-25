'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, ArrowLeft, Eye, EyeOff, FileText, 
  Download, ChevronRight, Calendar, Tag, ChevronDown, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

// Types
type Role = 'admin' | 'it_admin' | 'manager' | 'staff' | 'viewer';

interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface Announcement {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  targetRoles: Role[];
  summary: string[];
  fullText: string;
  resources: Resource[];
}

// Mock Data
const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Glideparcs Operational Handbooks v2.4 Released',
    category: 'Operations',
    publishDate: '2026-06-25',
    targetRoles: ['manager', 'staff', 'admin'],
    summary: [
      'Updated emergency protocols for unattended locations.',
      'New streamlined checklist for daily site audits.',
      'Mandatory review required by all site managers by Friday.'
    ],
    fullText: 'We have thoroughly overhauled the operational handbooks to ensure compliance with the latest safety standards. All staff and managers must review the new protocols. The changes primarily focus on automated gating fallback procedures and standardizing the daily site walkthrough checklist to improve efficiency.',
    resources: [
      { id: 'res-1', name: 'Operational_Handbook_v2.4.pdf', type: 'PDF', size: '4.2 MB', url: '#' },
      { id: 'res-2', name: 'Audit_Checklist_Template.xlsx', type: 'Spreadsheet', size: '1.1 MB', url: '#' }
    ]
  },
  {
    id: 'ann-2',
    title: 'Upcoming System Maintenance: Gate Kiosks',
    category: 'System Update',
    publishDate: '2026-06-23',
    targetRoles: ['it_admin', 'admin', 'manager'],
    summary: [
      'System downtime scheduled for Sunday 2 AM - 4 AM EST.',
      'All location kiosks will operate in offline cache mode.',
      'No action required from on-site staff.'
    ],
    fullText: 'Our engineering team will be pushing a critical security patch to all gate kiosks this weekend. The kiosks are designed to handle this gracefully using offline cache mode, meaning vehicles can still enter and exit. Any transactions processed offline will automatically sync once the connection is restored.',
    resources: []
  },
  {
    id: 'ann-3',
    title: 'Welcome to the new Hyderabad Tech Hub!',
    category: 'Company News',
    publishDate: '2026-06-20',
    targetRoles: ['admin', 'it_admin', 'manager', 'staff', 'viewer'],
    summary: [
      'Premium Parking officially opens its new tech hub in India.',
      'Focusing on advancing the GLIDEPARCS® technology platform.',
      'Team will partner closely with US operations for faster rollouts.'
    ],
    fullText: 'We are incredibly excited to announce the expansion of our global team with a new office in Hyderabad. This team will focus on core platform capabilities, including the new backend scaling initiatives. We expect this will drastically improve our time-to-market for new features.',
    resources: [
      { id: 'res-3', name: 'Press_Release_Hyderabad.pdf', type: 'PDF', size: '2.5 MB', url: '#' }
    ]
  }
];

export default function AnnouncementsPage() {
  const [role, setRole] = useState<Role>('staff');
  const [showMetadata, setShowMetadata] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Attempt to load role from local storage if available
    const rawUser = localStorage.getItem('glideparcs_user');
    if (rawUser) {
      try {
        const data = JSON.parse(rawUser);
        if (data.role) setRole(data.role);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Adaptive Feed: filter by user role and sort
  const filteredAnnouncements = mockAnnouncements.filter(ann => ann.targetRoles.includes(role));

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand(id);
    }
  };

  if (!isClient) return null;

  return (
    <main className="min-h-screen bg-[#F5F5F4] dark:bg-[#0B1724] text-gray-900 dark:text-gray-100 selection:bg-[#24638F]/20 relative overflow-hidden pb-24 md:pb-12">
      <div className="relative z-10 max-w-[1000px] mx-auto px-6 py-12 md:py-16">
        
        {/* Navigation & Layer Toggle Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <div>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#24638F] dark:hover:text-[#55A6E2] mb-6 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F] rounded-md"
              aria-label="Go back to dashboard"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#24638F] dark:text-[#55A6E2] uppercase tracking-[3px] mb-2">
              <Megaphone size={14} aria-hidden="true" />
              <span>Newsroom</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-[-1.5px]">
              Announcements
            </h1>
          </div>

          {/* Layer Toggle Component */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 p-2 rounded-2xl shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 pl-2" id="layer-toggle-label">
              Details Layer
            </span>
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className={`relative flex items-center justify-between w-14 h-7 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#24638F] ${
                showMetadata ? 'bg-[#24638F]' : 'bg-gray-200 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={showMetadata}
              aria-labelledby="layer-toggle-label"
            >
              <motion.div
                layout
                className="w-5 h-5 bg-white rounded-full shadow-md mx-1 flex items-center justify-center"
                initial={false}
                animate={{
                  x: showMetadata ? 28 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {showMetadata ? (
                  <Eye size={12} className="text-[#24638F]" />
                ) : (
                  <EyeOff size={12} className="text-gray-400" />
                )}
              </motion.div>
            </button>
          </div>
        </header>

        {/* Adaptive Feed */}
        <section aria-label="Announcements Feed" className="flex flex-col gap-6">
          <AnimatePresence>
            {filteredAnnouncements.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20 text-gray-500"
              >
                No active announcements for your role.
              </motion.div>
            ) : (
              filteredAnnouncements.map((ann, i) => {
                const isExpanded = expandedId === ann.id;

                return (
                  <motion.article
                    layout
                    key={ann.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, layout: { duration: 0.3, type: 'spring', bounce: 0.2 } }}
                    className={`bg-white dark:bg-slate-800 border ${
                      isExpanded 
                        ? 'border-[#24638F]/30 dark:border-[#55A6E2]/30 shadow-[0_20px_40px_rgb(36,99,143,0.08)]' 
                        : 'border-gray-200/60 dark:border-white/10 shadow-sm hover:shadow-md'
                    } rounded-[28px] overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-[#24638F]`}
                  >
                    {/* Card Header / Summary Layer */}
                    <div 
                      className="p-6 md:p-8 cursor-pointer relative group"
                      onClick={() => toggleExpand(ann.id)}
                      onKeyDown={(e) => handleKeyDown(e, ann.id)}
                      tabIndex={0}
                      role="button"
                      aria-expanded={isExpanded}
                      aria-controls={`content-${ann.id}`}
                      aria-label={`Expand announcement: ${ann.title}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-[#24638F] dark:group-hover:text-[#55A6E2] transition-colors">
                            {ann.title}
                          </h2>
                          
                          {/* Zero-Click Summary (Hover & Active state) */}
                          <AnimatePresence>
                            {(!isExpanded && showMetadata) && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                aria-hidden={true}
                              >
                                <ul className="space-y-2">
                                  {ann.summary.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-[15px] text-gray-600 dark:text-gray-400">
                                      <CheckCircle2 size={16} className="text-[#24638F]/60 dark:text-[#55A6E2]/60 mt-0.5 flex-shrink-0" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Expand Icon */}
                        <motion.div 
                          animate={{ rotate: isExpanded ? 180 : 0 }} 
                          className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700/50 flex items-center justify-center text-gray-400 flex-shrink-0 group-hover:bg-[#24638F]/10 group-hover:text-[#24638F] transition-colors"
                          aria-hidden="true"
                        >
                          <ChevronDown size={20} />
                        </motion.div>
                      </div>

                      {/* Layer Toggle Metadata */}
                      <AnimatePresence>
                        {!showMetadata && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex items-center gap-4 mt-4 overflow-hidden"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                              <Tag size={12} /> {ann.category}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                              <Calendar size={12} /> {new Date(ann.publishDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Expanded Content & Resource Vault */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`content-${ann.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="border-t border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/50"
                        >
                          <div className="p-6 md:p-8">
                            
                            {/* Ensure summary is always visible in expanded mode */}
                            <div className="mb-6 pb-6 border-b border-gray-200/60 dark:border-slate-700/50">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Summary</h3>
                              <ul className="space-y-3">
                                {ann.summary.map((point, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-base text-gray-700 dark:text-gray-300">
                                    <CheckCircle2 size={18} className="text-[#24638F] dark:text-[#55A6E2] mt-0.5 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="text-gray-600 dark:text-gray-400">
                              <p className="leading-relaxed text-[15px]">{ann.fullText}</p>
                            </div>
                            
                            {/* Resource Vault */}
                            {ann.resources.length > 0 && (
                              <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-slate-700/50">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                  <FileText size={16} /> Resource Vault
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  {ann.resources.map(res => (
                                    <a
                                      key={res.id}
                                      href={res.url}
                                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-[#24638F]/40 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24638F]"
                                      aria-label={`Download ${res.name} (${res.size})`}
                                    >
                                      <div className="truncate pr-4">
                                        <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">{res.name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{res.type} • {res.size}</div>
                                      </div>
                                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 hover:text-[#24638F] hover:bg-[#24638F]/10 flex-shrink-0 transition-colors">
                                        <Download size={14} />
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.article>
                );
              })
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
