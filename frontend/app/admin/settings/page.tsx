'use client';

import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from './actions';
import { FormField, inputClass } from '../_components/AdminComponents';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
  const [stats, setStats] = useState<Record<string, string>>({});
  const [timeline, setTimeline] = useState<{ year: string; title: string; description: string }[]>([]);

  useEffect(() => {
    getSettings()
      .then(settings => {
        setStats(settings.stats);
        setTimeline(settings.timeline);
      })
      .catch(error => {
        toast.error(error instanceof Error ? error.message : 'Failed to load settings');
      });
  }, []);

  const handleSave = async () => {
    try {
      await updateSettings({ stats, timeline });
      toast.success('Settings saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-white/40 mt-1">Company stats and milestone timeline.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-600 dark:text-white/60 uppercase tracking-wide">Company Stats</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <FormField key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}>
              <input className={inputClass} value={value} onChange={e => setStats(s => ({ ...s, [key]: e.target.value }))} />
            </FormField>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-600 dark:text-white/60 uppercase tracking-wide">Timeline Milestones</h2>
        <div className="space-y-3">
          {timeline.map((item, idx) => (
            <div key={idx} className="grid sm:grid-cols-[110px_1fr] gap-3 items-start p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03]">
              <input className={inputClass} value={item.year} onChange={e => {
                const next = [...timeline]; next[idx].year = e.target.value; setTimeline(next);
              }} />
              <input className={inputClass} value={item.title} onChange={e => {
                const next = [...timeline]; next[idx].title = e.target.value; setTimeline(next);
              }} />
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#24638F] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-[#1e5277] transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
