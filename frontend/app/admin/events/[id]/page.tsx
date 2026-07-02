'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FormField, inputClass, FormButtons } from '../../_components/AdminComponents';
import { getEventById, updateEvent, EventInput } from '../actions';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [event, setEvent] = useState<EventInput | null | undefined>(undefined);
  const [form, setForm] = useState<Partial<EventInput>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getEventById(id);
        if (!cancelled) {
          setEvent(data);
          if (data) {
            setForm({
              name: data.name, date: data.date, type: data.type, color: data.color,
              emoji: data.emoji, time: data.time || '', link: data.link || '', description: data.description || '',
            });
          }
        }
      } catch (err: any) {
        if (!cancelled) toast.error(err?.message || 'Failed to load event');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (isLoading) return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] mb-4"><ArrowLeft size={16} /> Back</Link>
      <p className="text-slate-400 dark:text-white/30">Loading event…</p>
    </div>
  );

  if (!event) return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] mb-4"><ArrowLeft size={16} /> Back</Link>
      <p className="text-slate-400 dark:text-white/30">Event not found.</p>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date) { toast.error('Name and date are required'); return; }
    setIsSubmitting(true);
    try {
      const data: EventInput = { ...event, ...form } as EventInput;
      await updateEvent(id, data);
      toast.success('Event updated');
      router.push('/admin/events');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };
  const TYPES = ['Internal', 'External', 'Holiday', 'Social', 'Conference', 'Training'];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] dark:hover:text-cyan-400 mb-4"><ArrowLeft size={16} /> Back to Events</Link>
      <h1 className="text-xl font-black text-slate-900 dark:text-white mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 space-y-5">
          <FormField label="Event Name *"><input className={inputClass} value={form.name || ''} onChange={e => set('name', e.target.value)} /></FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Date *"><input type="date" className={inputClass} value={form.date || ''} onChange={e => set('date', e.target.value)} /></FormField>
            <FormField label="Time"><input className={inputClass} value={form.time || ''} onChange={e => set('time', e.target.value)} /></FormField>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <FormField label="Type"><select className={inputClass} value={form.type || ''} onChange={e => set('type', e.target.value)}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></FormField>
            <FormField label="Emoji"><input className={inputClass} value={form.emoji || ''} onChange={e => set('emoji', e.target.value)} /></FormField>
            <FormField label="Color"><select className={inputClass} value={form.color || ''} onChange={e => set('color', e.target.value)}>{COLORS.map(c => <option key={c} value={c}>{c}</option>)}</select></FormField>
          </div>
          <FormField label="Link (optional)"><input className={inputClass} value={form.link || ''} onChange={e => set('link', e.target.value)} /></FormField>
          <FormField label="Description"><textarea className={`${inputClass} h-28 resize-none`} value={form.description || ''} onChange={e => set('description', e.target.value)} /></FormField>
        </div>
        <FormButtons onCancelHref="/admin/events" submitLabel="Save Changes" disabled={isSubmitting} />
      </form>
    </div>
  );
}
