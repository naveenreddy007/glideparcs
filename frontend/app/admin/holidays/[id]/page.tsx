'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FormField, inputClass, FormButtons } from '../../_components/AdminComponents';
import { getHolidayById, updateHoliday, HolidayInput } from '../actions';

export default function EditHolidayPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [holiday, setHoliday] = useState<HolidayInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string> | null>(null);
  const set = (key: string, value: any) => setForm(f => f ? { ...f, [key]: value } : f);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const h = await getHolidayById(id);
      if (!cancelled) {
        if (h) {
          setHoliday(h);
          setForm({
            name: h.name, date: h.date, type: h.type, color: h.color,
            emoji: h.emoji, region: h.region || 'India', description: h.description || '',
          });
        } else {
          setHoliday(null);
          setForm(null);
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/holidays" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] mb-4"><ArrowLeft size={16} /> Back</Link>
      <p className="text-slate-400 dark:text-white/30">Loading…</p>
    </div>
  );

  if (!holiday || !form) return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/holidays" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] mb-4"><ArrowLeft size={16} /> Back</Link>
      <p className="text-slate-400 dark:text-white/30">Holiday not found.</p>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHoliday(id, { ...form, id } as HolidayInput);
      toast.success('Holiday updated!');
      router.push('/admin/holidays');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update holiday');
    }
  };
  const TYPES = ['Public', 'Restricted', 'Company', 'Regional'];
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/holidays" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] dark:hover:text-cyan-400 mb-4"><ArrowLeft size={16} /> Back to Holidays</Link>
      <h1 className="text-xl font-black text-slate-900 dark:text-white mb-6">Edit Holiday</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 space-y-5">
          <FormField label="Holiday Name *"><input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} /></FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Date *"><input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} /></FormField>
            <FormField label="Region"><input className={inputClass} value={form.region} onChange={e => set('region', e.target.value)} /></FormField>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <FormField label="Type"><select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)}>{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></FormField>
            <FormField label="Emoji"><input className={inputClass} value={form.emoji} onChange={e => set('emoji', e.target.value)} /></FormField>
            <FormField label="Color"><select className={inputClass} value={form.color} onChange={e => set('color', e.target.value)}>{COLORS.map(c => <option key={c} value={c}>{c}</option>)}</select></FormField>
          </div>
          <FormField label="Description"><textarea className={`${inputClass} h-28 resize-none`} value={form.description} onChange={e => set('description', e.target.value)} /></FormField>
        </div>
        <FormButtons onCancelHref="/admin/holidays" submitLabel="Save Changes" />
      </form>
    </div>
  );
}
