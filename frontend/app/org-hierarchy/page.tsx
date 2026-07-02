'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Search, Network, ZoomIn, ZoomOut, Maximize2,
  Download, LayoutGrid, Users, MapPin, X, ChevronDown, Loader2,
  Mail, ExternalLink, Building2, Calendar,
} from 'lucide-react';
import { OrgChart } from 'd3-org-chart';
import * as d3 from 'd3';
import FloatingParticles from '../components/FloatingParticles';
import { orgData, DEPARTMENT_COLORS, DEPARTMENTS, LOCATIONS, getOrgStats, COMPANY_STATS, TIMELINE, OrgNode } from '../data/org-data';

function getInitials(name: string) {
  const parts = name.split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function OrgHierarchyPage() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDepts, setActiveDepts] = useState<Set<string>>(new Set(DEPARTMENTS));
  const [activeLocations, setActiveLocations] = useState<Set<string>>(new Set(LOCATIONS));
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical');
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);

  const stats = useMemo(() => getOrgStats(), []);

  const filteredData = useMemo(() => {
    return orgData.filter(n => {
      const deptMatch = activeDepts.size === 0 || activeDepts.has(n.department);
      const locMatch = activeLocations.size === 0 || activeLocations.has(n.location);
      return deptMatch && locMatch;
    });
  }, [activeDepts, activeLocations]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new OrgChart()
        .container(chartRef.current)
        .data(orgData)
        .nodeWidth((d: any) => 240)
        .nodeHeight((d: any) => 110)
        .childrenMargin((d: any) => 40)
        .compactMarginBetween((d: any) => 35)
        .compactMarginPair((d: any) => 30)
        .linkUpdate(function (this: any, d: any) {
          d3.select(this)
            .attr('stroke', (node: any) => {
              const data = node.data;
              if (data && data.department) {
                return DEPARTMENT_COLORS[data.department] || '#94a3b8';
              }
              return '#94a3b8';
            })
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.4);
        })
        .nodeContent((d: any) => {
          const node = d.data;
          if (!node) return '';
          const color = DEPARTMENT_COLORS[node.department] || '#3b82f6';
          const initials = getInitials(node.name);
          const hasChildren = d.children?.length > 0;
          const avatarHtml = node.photoUrl
            ? `<img src="${node.photoUrl}" alt="${node.name}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${color};box-shadow:0 2px 8px ${color}40;" onerror="this.style.display='none';this.nextSibling.style.display='flex';"/><div style="display:none;width:44px;height:44px;border-radius:50%;background:${color};align-items:center;justify-content:center;color:white;font-weight:800;font-size:15px;flex-shrink:0;">${initials}</div>`
            : `<div style="width:44px;height:44px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:15px;flex-shrink:0;box-shadow:0 2px 8px ${color}40;">${initials}</div>`;

          return `
            <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(255,255,255,0.85);backdrop-filter:blur(20px);border:1px solid rgba(200,200,200,0.3);border-radius:16px;width:${d.width}px;height:${d.height}px;box-sizing:border-box;box-shadow:0 4px 20px rgba(0,0,0,0.06);cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;">
              <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${color};"></div>
              ${avatarHtml}
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.name}</div>
                <div style="font-size:11px;color:#64748b;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.role}</div>
                <div style="display:flex;align-items:center;gap:4px;margin-top:4px;">
                  <span style="font-size:9px;font-weight:700;color:${color};background:${color}1a;padding:1px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;">${node.department}</span>
                </div>
              </div>
              ${hasChildren ? `<div style="position:absolute;bottom:6px;right:8px;font-size:9px;color:#94a3b8;">${d.children.length}</div>` : ''}
            </div>
          `;
        })
        .nodeUpdate(function (this: any, d: any) {
          d3.select(this)
            .on('click', (event: any) => {
              event.stopPropagation();
              const nodeData = d.data;
              if (nodeData) {
                setSelectedNode(nodeData);
              }
            })
            .style('cursor', 'pointer');
        })
        .duration(400)
        .initialZoom(0.75)
        .layout('left');

      chart.render();
      chartInstance.current = chart;
      setChartLoading(false);

    return () => {
      if (chartInstance.current && chartRef.current) {
        chartRef.current.innerHTML = '';
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;
    chartInstance.current.data(filteredData).render();
  }, [filteredData]);

  useEffect(() => {
    if (!chartInstance.current) return;
    chartInstance.current.layout(layout === 'horizontal' ? 'left' : 'top').render();
  }, [layout]);

  const handleSearch = () => {
    if (!chartInstance.current || !searchQuery.trim()) return;
    const found = orgData.find(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      chartInstance.current.setCentered(found.id).render();
      setSelectedNode(found);
    }
  };

  const toggleDept = (dept: string) => {
    setActiveDepts(prev => {
      const next = new Set(prev);
      if (next.has(dept)) next.delete(dept);
      else next.add(dept);
      return next;
    });
  };

  const toggleLocation = (loc: string) => {
    setActiveLocations(prev => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc);
      else next.add(loc);
      return next;
    });
  };

  const handleZoomIn = () => chartInstance.current?.zoom(1.2);
  const handleZoomOut = () => chartInstance.current?.zoom(0.8);
  const handleFit = () => chartInstance.current?.fit();
  const handleExport = () => chartInstance.current?.exportImg('glideparcs-org-chart');

  return (
    <main className={`relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-[#0a1929] text-slate-900 dark:text-white selection:bg-cyan-400/20 transition-colors duration-300 ${isFullscreen ? 'fixed inset-0 z-[100]' : ''}`}>
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#0a1929] dark:via-[#0f2744] dark:to-[#0a1929] transition-colors duration-300" />
        <div className="absolute left-0 top-0 h-[800px] w-[800px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-300/30 dark:bg-[#24638F]/20 blur-[180px]" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-400/20 dark:bg-cyan-600/10 blur-[150px]" />
      </div>
      <FloatingParticles />

      <section className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 mt-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.8, delay: 0.1 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 dark:border-cyan-400/25 bg-cyan-50 dark:bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[2px] text-cyan-700 dark:text-cyan-300 backdrop-blur"
            >
              <Network size={12} className="text-cyan-600 dark:text-cyan-300" /> Team Structure
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl text-slate-900 dark:text-white">
              Organization{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-200 dark:from-white/30 dark:to-white/10">Hierarchy</span>
            </h1>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.8, delay: 0.25 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search a person…"
                aria-label="Search people"
                className="w-full sm:w-64 rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 backdrop-blur-xl transition-all focus:border-cyan-400 dark:focus:border-cyan-400/40 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 dark:focus:ring-cyan-400/10"
              />
            </div>
          </motion.div>
        </div>

        {/* Company Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.28 }}
          className="mb-5 rounded-[32px] border border-slate-200 dark:border-white/[0.06] bg-gradient-to-br from-[#24638F] to-[#1C5075] p-6 md:p-8 overflow-hidden relative"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-[60px]" />
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-[50px]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-lg md:text-xl font-bold text-white/90 italic">"People Deserve Great Places."</p>
              <p className="text-sm text-white/60 mt-1">The intersection of parking management & technology.</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-semibold text-white/50">
                <span className="inline-flex items-center gap-1"><Building2 size={12} /> Founded {COMPANY_STATS.founded}</span>
                <span>·</span>
                <span>{COMPANY_STATS.hq}</span>
                <span>·</span>
                <span>{COMPANY_STATS.platform}</span>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6">
              {[
                { value: COMPANY_STATS.cities, label: 'Cities' },
                { value: COMPANY_STATS.locations, label: 'Locations' },
                { value: COMPANY_STATS.spaces, label: 'Spaces' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white">{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main grid: sidebar + canvas */}
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.3 }}
            className="flex flex-col gap-5"
          >
            {/* Stats */}
            <div className="rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 backdrop-blur-[30px]">
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-xs font-bold tracking-wide text-slate-500 dark:text-white/50 uppercase">Headcount</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] p-3 text-center">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mt-1">Total</div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] p-3 text-center">
                  <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{stats.byDept['Executive'] || 0}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mt-1">Leaders</div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {LOCATIONS.map(loc => (
                  <div key={loc} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 dark:text-white/50 truncate pr-2">{loc.split(',')[0]}</span>
                    <span className="font-bold text-slate-700 dark:text-white/70">{stats.byLocation[loc] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments filter */}
            <div className="rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 backdrop-blur-[30px]">
              <h2 className="text-xs font-bold tracking-wide text-slate-500 dark:text-white/50 uppercase mb-4">Departments</h2>
              <div className="space-y-2">
                {DEPARTMENTS.map(dept => {
                  const count = stats.byDept[dept] || 0;
                  const color = DEPARTMENT_COLORS[dept];
                  const isActive = activeDepts.has(dept);
                  return (
                    <button
                      key={dept}
                      onClick={() => toggleDept(dept)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-50 dark:bg-white/[0.05] text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10'
                          : 'text-slate-400 dark:text-white/30 border border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="flex-1 text-left">{dept}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-white/30">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Locations filter */}
            <div className="rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 backdrop-blur-[30px]">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={14} className="text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-xs font-bold tracking-wide text-slate-500 dark:text-white/50 uppercase">Locations</h2>
              </div>
              <div className="space-y-2">
                {LOCATIONS.map(loc => {
                  const isActive = activeLocations.has(loc);
                  return (
                    <button
                      key={loc}
                      onClick={() => toggleLocation(loc)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-50 dark:bg-white/[0.05] text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10'
                          : 'text-slate-400 dark:text-white/30 border border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <span className="flex-1 text-left truncate">{loc}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-white/30">{stats.byLocation[loc] || 0}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.35 }}
            className="relative rounded-[32px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-[20px] overflow-hidden shadow-sm dark:shadow-2xl"
          >
            {/* Canvas controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
              <button onClick={handleZoomIn} title="Zoom in" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 shadow-sm hover:bg-white dark:hover:bg-white/15 transition-all hover:scale-105">
                <ZoomIn size={16} />
              </button>
              <button onClick={handleZoomOut} title="Zoom out" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 shadow-sm hover:bg-white dark:hover:bg-white/15 transition-all hover:scale-105">
                <ZoomOut size={16} />
              </button>
              <button onClick={handleFit} title="Fit to screen" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 shadow-sm hover:bg-white dark:hover:bg-white/15 transition-all hover:scale-105">
                <Maximize2 size={16} />
              </button>
              <button onClick={() => setLayout(l => l === 'vertical' ? 'horizontal' : 'vertical')} title="Toggle layout" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 shadow-sm hover:bg-white dark:hover:bg-white/15 transition-all hover:scale-105">
                <LayoutGrid size={16} />
              </button>
              <button onClick={handleExport} title="Export as image" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 shadow-sm hover:bg-white dark:hover:bg-white/15 transition-all hover:scale-105">
                <Download size={16} />
              </button>
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 left-4 z-20 rounded-full bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-3 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-white/40 backdrop-blur-md">
              Scroll to zoom · Drag to pan · Click a card to see details
            </div>

            {/* The chart */}
            <div ref={chartRef} className="w-full h-[600px] lg:h-[680px]">
              {chartLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-cyan-500 dark:text-cyan-400" />
                    <span className="text-sm font-semibold text-slate-400 dark:text-white/40">Building org chart…</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Company Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.4 }}
          className="mt-8 rounded-[32px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-[30px] p-6 md:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={18} className="text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wide text-slate-600 dark:text-white/60 uppercase">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-[14px] h-[2px] bg-gradient-to-r from-violet-400 via-blue-500 to-cyan-400 hidden md:block" />
            <div className="grid gap-4 md:grid-cols-7 md:gap-2">
              {TIMELINE.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="relative"
                >
                  <div className="flex items-center gap-2 md:flex-col md:items-center md:text-center mb-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#24638F] to-[#1C5075] flex items-center justify-center shrink-0 shadow-md z-10 relative ring-2 ring-white dark:ring-[#0a1929]">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{milestone.year}</span>
                  </div>
                  <div className="md:text-center pl-9 md:pl-0">
                    <div className="text-xs font-bold text-slate-700 dark:text-white/80 leading-tight">{milestone.title}</div>
                    <div className="text-[11px] text-slate-400 dark:text-white/40 mt-1 leading-snug hidden md:block">{milestone.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Person detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[71] w-[90%] max-w-md bg-white dark:bg-[#0f2744] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
            >
              <div className="relative shrink-0 h-44 overflow-hidden" style={{ backgroundColor: DEPARTMENT_COLORS[selectedNode.department] }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors z-10">
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-6">
                  {selectedNode.photoUrl ? (
                    <img
                      src={selectedNode.photoUrl}
                      alt={selectedNode.name}
                      className="h-20 w-20 rounded-full object-cover shadow-lg"
                      style={{ border: '3px solid rgba(255,255,255,0.3)' }}
                    />
                  ) : (
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-white shadow-lg"
                      style={{ backgroundColor: DEPARTMENT_COLORS[selectedNode.department], border: '3px solid rgba(255,255,255,0.3)' }}
                    >
                      {getInitials(selectedNode.name)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedNode.name}</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-white/50 mt-1">{selectedNode.role}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: DEPARTMENT_COLORS[selectedNode.department] }}>
                    {selectedNode.department}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:text-white/60 uppercase tracking-wider">
                    <MapPin size={10} /> {selectedNode.location}
                  </span>
                </div>

                {selectedNode.bio && (
                  <div className="mt-6">
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-2">About</h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-white/60">{selectedNode.bio}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedNode.email && (
                    <a
                      href={`mailto:${selectedNode.email}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-500/15 px-3 py-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-400/25 transition-all hover:bg-cyan-200 dark:hover:bg-cyan-500/25"
                    >
                      <Mail size={13} /> Email
                    </a>
                  )}
                  {selectedNode.linkedin && (
                    <a
                      href={selectedNode.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-100 dark:bg-blue-500/15 px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/25 transition-all hover:bg-blue-200 dark:hover:bg-blue-500/25"
                    >
                      <ExternalLink size={13} /> LinkedIn
                    </a>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {selectedNode.email && (
                    <div className="rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] p-3">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Email</div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-white/70 mt-1 truncate">{selectedNode.email}</div>
                    </div>
                  )}
                  {selectedNode.startDate && (
                    <div className="rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] p-3">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Since</div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-white/70 mt-1">{selectedNode.startDate}</div>
                    </div>
                  )}
                </div>

                {/* Reports */}
                {(() => {
                  const reports = orgData.filter(n => n.parentId === selectedNode.id);
                  const manager = orgData.find(n => n.id === selectedNode.parentId);
                  if (reports.length === 0 && !manager) return null;
                  return (
                    <div className="mt-6">
                      <h3 className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-3">Connections</h3>
                      {manager && (
                        <button onClick={() => setSelectedNode(manager)} className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: DEPARTMENT_COLORS[manager.department] }}>
                            {getInitials(manager.name)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{manager.name}</div>
                            <div className="text-[10px] text-slate-400 dark:text-white/40">Reports to · {manager.role}</div>
                          </div>
                        </button>
                      )}
                      {reports.length > 0 && (
                        <div className="mt-2">
                          <div className="text-[10px] font-semibold text-slate-400 dark:text-white/40 mb-1">Direct reports ({reports.length})</div>
                          {reports.map(r => (
                            <button key={r.id} onClick={() => setSelectedNode(r)} className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: DEPARTMENT_COLORS[r.department] }}>
                                {getInitials(r.name)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{r.name}</div>
                                <div className="text-[10px] text-slate-400 dark:text-white/40">{r.role}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
