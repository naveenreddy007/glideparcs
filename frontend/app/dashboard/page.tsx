'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Users, Shield, CreditCard, BarChart3, Megaphone, Cloud, Settings, 
  FileText, LogOut, AlertTriangle, Box, ChevronRight,
  Home, Ticket, Cpu, UserCircle, MapPin, Building2
} from 'lucide-react';
import TiltCard from '../components/TiltCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { ThemeToggle } from '../components/ThemeToggle';
import Link from 'next/link';

const roles = ["admin", "it_admin", "manager", "staff", "viewer"] as const;
type Role = typeof roles[number];

const roleLabels: Record<Role, string> = {
  admin: "Administrator",
  it_admin: "IT Administrator",
  manager: "Manager",
  staff: "Staff Member",
  viewer: "Viewer / Guest",
};

const patternIcons = [
  Shield, CreditCard, Users, Settings, FileText, Users, AlertTriangle, Box, Megaphone, Cloud
];

interface InventorySummary {
  totalAssets: number;
  readyAssets: number;
  missingDataAssets: number;
  repairAssets: number;
}

interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export default function Dashboard() {
  const [role, setRole] = useState<Role>('staff');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('glideparcs_user');

    if (!rawUser) {
      window.location.href = '/login';
      return;
    }

    try {
      const data = JSON.parse(rawUser) as UserInfo;
      setUser(data);
      setRole((data.role as Role) || 'staff');
    } catch {
      localStorage.removeItem('glideparcs_user');
      window.location.href = '/login';
    }
  }, []);

  // Welcome or unauthorized toast on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const unauthorized = params.get('unauthorized');

    if (unauthorized === 'true') {
      toast.error('Access Denied', {
        description: 'You do not have permission to access that section.',
        duration: 4000,
      });
      window.history.replaceState({}, '', '/dashboard');
    } else if (!hasShownWelcome && user) {
      const timer = setTimeout(() => {
        toast('📢 Message from Admin: Welcome to Glideparcs!', {
          description: `Signed in as ${user.fullName} (${roleLabels[role]})`,
          duration: 5000,
          style: {
            background: '#24638F',
            color: '#ffffff',
            border: '1px solid #1C5075',
          }
        });
        setHasShownWelcome(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [hasShownWelcome, user, role]);

  useEffect(() => {
    // Temporary frontend-only dashboard numbers.
    // Later these will come from Go Fiber: GET /api/v1/dashboard/summary
    setInventorySummary({
      totalAssets: 10,
      readyAssets: 7,
      missingDataAssets: 2,
      repairAssets: 1,
    });
  }, []);

  const changeRole = (newRole: Role) => {
    if (user?.role !== 'admin') return;
    setRole(newRole);
    window.history.replaceState({}, '', `/dashboard?role=${newRole}`);
    toast(`Switched to ${roleLabels[newRole]}`, {
      description: 'Dashboard updated to match your role.',
      duration: 2500,
    });
  };

  return (
    <div className="min-h-screen selection:bg-[#24638F]/20 relative overflow-hidden pb-24 md:pb-0">
      
      {/* Repeating Icon Background Pattern */}
      <div className="fixed inset-0 opacity-[0.10] dark:opacity-[0.15] pointer-events-none grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-y-12 gap-x-8 p-8 justify-items-center content-start z-0">
          {Array.from({ length: 300 }).map((_, i) => {
            const Icon = patternIcons[i % patternIcons.length];
            return (
              <div key={i} className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <Icon size={24} strokeWidth={1.5} className="text-black dark:text-white" />
              </div>
            );
          })}
      </div>



      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[12px] font-bold text-[#24638F] uppercase tracking-[3px] mb-2"
            >
              Control Center
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-semibold tracking-[-1.5px] text-gray-900 dark:text-white"
            >
              Welcome back
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 mt-2 text-lg"
            >
              Here is what&apos;s happening across the Glideparcs network today.
            </motion.p>
          </div>

          {/* Mobile role switcher */}
          {user?.role === 'admin' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex sm:hidden items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 p-3 rounded-2xl shadow-sm"
            >
              <span className="text-gray-500 dark:text-gray-400 text-[11px] font-semibold uppercase tracking-wider">Role</span>
              <select 
                value={role} 
                onChange={(e) => changeRole(e.target.value as Role)}
                className="bg-gray-50 dark:bg-slate-700/50 border-none rounded-lg px-2 py-1 text-sm text-gray-900 dark:text-white outline-none cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
            </motion.div>
          )}
        </div>



        {/* ── ROLE-BASED FEATURE CARDS WITH 3D TILT ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Always visible for everyone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link href="/dashboard/announcements" className="block h-full">
              <TiltCard className="h-full bg-[#FAFAF9] dark:bg-slate-800 border border-gray-200/60 dark:border-white/10 hover:border-[#24638F]/30 dark:hover:border-[#24638F]/50 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(36,99,143,0.08)] transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#24638F]/10 dark:bg-[#24638F]/20 rounded-2xl flex items-center justify-center mb-6 text-[#24638F] dark:text-[#55A6E2]">
                  <Megaphone size={24} strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-2xl tracking-tight text-gray-900 dark:text-white mb-3">Announcements</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed mb-6">Latest company updates, policy changes, and important notices from leadership.</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 text-[12px] font-semibold rounded-full border border-amber-200 dark:border-amber-800/50">
                    3 new this week
                  </div>
                  <div className="text-[#24638F] dark:text-[#55A6E2] font-semibold text-sm hover:underline flex items-center gap-1">Read <ChevronRight size={16}/></div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* Temporarily hidden */}
          {false && ['admin', 'it_admin', 'manager', 'staff'].includes(role) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <TiltCard className="h-full bg-[#FAFAF9] dark:bg-slate-800 border border-gray-200/60 dark:border-white/10 hover:border-[#24638F]/30 dark:hover:border-[#24638F]/50 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(36,99,143,0.08)] transition-shadow duration-300 flex flex-col">
                <div className="w-12 h-12 bg-[#24638F]/10 dark:bg-[#24638F]/20 rounded-2xl flex items-center justify-center mb-6 text-[#24638F] dark:text-[#55A6E2]">
                  <FileText size={24} strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-2xl tracking-tight text-gray-900 dark:text-white mb-3">My Requests</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed mb-8 flex-1">Submit and track support tickets, equipment requests, and managerial approvals.</p>
                <button className="w-full bg-gray-50 dark:bg-slate-700/50 hover:bg-[#24638F] hover:text-white text-gray-900 dark:text-white font-semibold py-3.5 rounded-2xl border border-gray-200 dark:border-slate-600 hover:border-[#24638F] dark:hover:border-[#24638F] transition-all flex items-center justify-center gap-2">
                  View Tickets <ChevronRight size={18} />
                </button>
              </TiltCard>
            </motion.div>
          )}

          {/* Temporarily hidden */}
          {false && ['admin', 'it_admin', 'manager'].includes(role) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <TiltCard className="h-full bg-[#FAFAF9] dark:bg-slate-800 border border-gray-200/60 dark:border-white/10 hover:border-[#24638F]/30 dark:hover:border-[#24638F]/50 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(36,99,143,0.08)] transition-shadow duration-300 flex flex-col">
                <div className="w-12 h-12 bg-[#24638F]/10 dark:bg-[#24638F]/20 rounded-2xl flex items-center justify-center mb-6 text-[#24638F] dark:text-[#55A6E2]">
                  <Settings size={24} strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-2xl tracking-tight text-gray-900 dark:text-white mb-3">Assets &amp; Devices</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed mb-6">Onboard new hardware, manage inventory, and view asset status across locations.</p>
                <div className="mt-auto inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  {inventorySummary?.totalAssets ?? 0} assets tracked
                </div>
                <button className="mt-5 w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-50 py-3.5 font-semibold text-gray-400 dark:border-slate-600 dark:bg-slate-700/50 dark:text-gray-500" disabled>
                  Inventory module coming later
                </button>
              </TiltCard>
            </motion.div>
          )}

          {/* Temporarily hidden */}
          {false && ['admin', 'manager'].includes(role) && (
            <motion.div className="defer-render" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <TiltCard className="h-full bg-[#FAFAF9] dark:bg-slate-800 border border-gray-200/60 dark:border-white/10 hover:border-[#24638F]/30 dark:hover:border-[#24638F]/50 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(36,99,143,0.08)] transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#24638F]/10 dark:bg-[#24638F]/20 rounded-2xl flex items-center justify-center mb-6 text-[#24638F] dark:text-[#55A6E2]">
                  <Users size={24} strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-2xl tracking-tight text-gray-900 dark:text-white mb-3">Onboarding &amp; Checklists</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed mb-6">Employee onboarding workflows, new hire checklists, and compliance tasks.</p>
              </TiltCard>
            </motion.div>
          )}

          {/* Temporarily hidden */}
          {false && ['admin', 'it_admin', 'manager', 'viewer'].includes(role) && (
            <motion.div className="defer-render" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <TiltCard className="h-full bg-[#FAFAF9] dark:bg-slate-800 border border-gray-200/60 dark:border-white/10 hover:border-[#24638F]/30 dark:hover:border-[#24638F]/50 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(36,99,143,0.08)] transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#24638F]/10 dark:bg-[#24638F]/20 rounded-2xl flex items-center justify-center mb-6 text-[#24638F] dark:text-[#55A6E2]">
                  <BarChart3 size={24} strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-2xl tracking-tight text-gray-900 dark:text-white mb-3">Location Status</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed mb-6">Real-time view of site performance, occupancy, and open requests.</p>
                <div className="mt-auto flex items-center gap-3">
                  <div className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700/50 px-3 py-1 rounded-lg">12 active</div>
                  <div className="text-[13px] font-semibold text-amber-700 dark:amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-800/50">4 need attention</div>
                </div>
              </TiltCard>
            </motion.div>
          )}

          {/* Temporarily hidden */}
          {false && ['admin'].includes(role) && (
            <motion.div className="defer-render" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <TiltCard className="h-full bg-[#24638F] border border-[#1C5075] dark:border-[#1C5075]/50 rounded-[32px] p-8 shadow-[0_20px_40px_rgb(36,99,143,0.2)] dark:shadow-none flex flex-col text-white">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white">
                  <Shield size={24} strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-2xl tracking-tight mb-3">Executive Summary</h3>
                <p className="text-white/80 text-[15px] leading-relaxed mb-8 flex-1">High-level KPIs, revenue trends, and operational health across the entire portfolio.</p>
                <button className="w-full bg-white hover:bg-gray-50 text-[#24638F] font-bold py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
                  Open Full Report <ChevronRight size={18} />
                </button>
              </TiltCard>
            </motion.div>
          )}
        </div>

        <div className="mt-20 text-center text-[11px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest border-t border-gray-200 dark:border-white/5 pt-8">
          Glideparcs — People Deserve Great Places • Partner with Premium
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#F5F5F4]/90 dark:bg-[#0B1724]/90 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10 px-4 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { icon: Home,       label: 'Home',     active: true, show: true },
            { icon: Ticket,     label: 'Requests', active: false, show: ['admin', 'it_admin', 'manager', 'staff'].includes(role) },
            { icon: Cpu,        label: 'Assets',   active: false, show: ['admin', 'it_admin', 'manager'].includes(role) },
            { icon: UserCircle, label: 'Profile',  active: false, show: true },
          ].filter(tab => tab.show).map((tab) => (
            <button
              key={tab.label}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all ${
                tab.active 
                  ? 'text-[#24638F] dark:text-[#55A6E2] bg-[#24638F]/10 dark:bg-[#55A6E2]/10' 
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon size={22} strokeWidth={tab.active ? 2.2 : 1.8} />
              <span className={`text-[10px] font-semibold tracking-wider ${tab.active ? '' : 'font-medium'}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
