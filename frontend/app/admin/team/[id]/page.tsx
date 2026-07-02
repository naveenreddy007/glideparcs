'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FormField, inputClass, FormButtons } from '../../_components/AdminComponents';
import { isValidImageUrl, isValidHttpUrl } from '../../_components/validation';
import { getTeamMemberById, updateTeamMember, getTeam, TeamMemberInput } from '../actions';

export default function EditTeamMemberPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [team, setTeam] = useState<TeamMemberInput[]>([]);
  const [member, setMember] = useState<TeamMemberInput | null>(null);
  const [form, setForm] = useState<Record<string, string> | null>(null);
  const [errors, setErrors] = useState<{ photoUrl?: string; linkedin?: string }>({});

  useEffect(() => {
    getTeam().then(setTeam).catch(() => toast.error('Failed to load team'));
    getTeamMemberById(id).then(m => {
      if (!m) return;
      setMember(m);
      setForm({
        name: m.name,
        role: m.role,
        department: m.department,
        location: m.location || 'India GCC',
        email: m.email || '',
        phone: '',
        photoUrl: m.photoUrl || '',
        linkedin: m.linkedin || '',
        bio: m.bio || '',
        parentId: m.parentId || '',
      });
    }).catch(() => toast.error('Failed to load member'));
  }, [id]);

  const set = (key: string, value: any) => setForm(f => f ? { ...f, [key]: value } : f);

  if (!member || !form) return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/team" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] mb-4"><ArrowLeft size={16} /> Back</Link>
      <p className="text-slate-400 dark:text-white/30">Member not found.</p>
    </div>
  );

  const validate = () => {
    const next: { photoUrl?: string; linkedin?: string } = {};
    if (form?.photoUrl && !isValidImageUrl(form.photoUrl)) next.photoUrl = 'Enter a valid http(s) image URL';
    if (form?.linkedin && !isValidHttpUrl(form.linkedin)) next.linkedin = 'Enter a valid http(s) URL';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.name || !form?.role) { toast.error('Name and role are required'); return; }
    if (!validate()) return;
    const data: TeamMemberInput = {
      id,
      parentId: form.parentId || null,
      name: form.name,
      role: form.role,
      department: form.department,
      location: form.location,
      email: form.email,
      bio: form.bio,
      photoUrl: form.photoUrl,
      linkedin: form.linkedin,
    };
    try {
      await updateTeamMember(id, data);
      toast.success('Team member updated!');
      router.push('/admin/team');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update team member');
    }
  };

  const DEPARTMENTS = ['Leadership', 'Engineering', 'Operations', 'Finance', 'HR', 'Product', 'Sales', 'Marketing', 'IT', 'Innovation'];
  const LOCATIONS = ['India GCC', 'Headquarters', 'Remote'];

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/team" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] dark:hover:text-cyan-400 mb-4"><ArrowLeft size={16} /> Back to Team</Link>
      <h1 className="text-xl font-black text-slate-900 dark:text-white mb-6">Edit Team Member</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 space-y-5">
          <FormField label="Full Name *"><input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} /></FormField>
          <FormField label="Role *"><input className={inputClass} value={form.role} onChange={e => set('role', e.target.value)} /></FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Department"><select className={inputClass} value={form.department} onChange={e => set('department', e.target.value)}>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></FormField>
            <FormField label="Location"><select className={inputClass} value={form.location} onChange={e => set('location', e.target.value)}>{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select></FormField>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Email"><input type="email" className={inputClass} value={form.email} onChange={e => set('email', e.target.value)} /></FormField>
            <FormField label="Phone"><input className={inputClass} value={form.phone} onChange={e => set('phone', e.target.value)} /></FormField>
          </div>
          <FormField label="Photo URL" hint={errors.photoUrl}><input className={`${inputClass} ${errors.photoUrl ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}`} value={form.photoUrl} onChange={e => { set('photoUrl', e.target.value); if (errors.photoUrl) setErrors(err => ({ ...err, photoUrl: undefined })); }} /></FormField>
          {form.photoUrl && isValidImageUrl(form.photoUrl) && <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 h-32"><img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" /></div>}
          <FormField label="LinkedIn URL" hint={errors.linkedin}><input className={`${inputClass} ${errors.linkedin ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}`} value={form.linkedin} onChange={e => { set('linkedin', e.target.value); if (errors.linkedin) setErrors(err => ({ ...err, linkedin: undefined })); }} /></FormField>
          <FormField label="Reports To"><select className={inputClass} value={form.parentId} onChange={e => set('parentId', e.target.value)}><option value="">Top-level</option>{team.filter(m => m.id !== id).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></FormField>
          <FormField label="Bio"><textarea className={`${inputClass} h-28 resize-none`} value={form.bio} onChange={e => set('bio', e.target.value)} /></FormField>
        </div>
        <FormButtons onCancelHref="/admin/team" submitLabel="Save Changes" />
      </form>
    </div>
  );
}
