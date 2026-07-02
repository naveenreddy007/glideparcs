'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FormField, inputClass, FormButtons } from '../../_components/AdminComponents';
import { createEvent, EventInput } from '../actions';

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', date: new Date().toISOString().split('T')[0], type: 'Internal', color: '#3b82f6',
    emoji: '📅', time: '', link: '', description: '',
  });
  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date) { toast.error('Name and date are required'); return; }
    setIsSubmitting(true);
    try {
      const data: EventInput = { id: 0, ...form };
      await createEvent(data);
      toast.success('Event created');
      router.push('/admin/events');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const TYPES = ['Internal', 'External', 'Holiday', 'Social', 'Conference', 'Training'];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] dark:hover:text-cyan-400 mb-4">
        <ArrowLeft size={16} /> Back to Events
      </Link>
      <h1 className="text-xl font-black text-slate-900 dark:text-white mb-6">New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 space-y-5">
          <FormField label="Event Name *">
            <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. India GCC Hackathon" />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Date *">
              <input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} />
            </FormField>
            <FormField label="Time">
              <input className={inputClass} value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 2:00 PM IST" />
            </FormField>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <FormField label="Type">
              <select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Emoji">
              <input className={inputClass} value={form.emoji} onChange={e => set('emoji', e.target.value)} placeholder="📅" />
            </FormField>
            <FormField label="Color">
              <select className={inputClass} value={form.color} onChange={e => set('color', e.target.value)}>
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Link (optional)">
            <input className={inputClass} value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://…" />
          </FormField>

          <FormField label="Description">
            <textarea className={`${inputClass} h-28 resize-none`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description of the event…" />
          </FormField>
        </div>
        <FormButtons onCancelHref="/admin/events" submitLabel="Create Event" disabled={isSubmitting} />
      </form>
    </div>
  );
}
