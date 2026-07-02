'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { FormField, inputClass, FormButtons } from '../../_components/AdminComponents';
import { categories } from '../../../data/newsroom';
import { getArticleBySlug, updateArticle, ArticleInput } from '../actions';
import { isValidImageUrl, isValidHttpUrl } from '../../_components/validation';
import ReactMarkdown from 'react-markdown';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [form, setForm] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ image?: string; externalUrl?: string }>({});

  useEffect(() => {
    getArticleBySlug(slug).then(article => {
      if (article) {
        setForm({
          ...article,
          tags: (article.tags || []).join(', '),
        });
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="text-sm text-slate-400">Loading article…</div>;

  if (!form) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/newsroom" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] mb-4">
          <ArrowLeft size={16} /> Back to Articles
        </Link>
        <p className="text-slate-400 dark:text-white/30">Article not found.</p>
      </div>
    );
  }

  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));
  const COLORS = ['from-cyan-400 to-blue-500','from-red-400 to-blue-500','from-emerald-400 to-teal-500','from-orange-400 to-green-500','from-purple-400 to-pink-500','from-blue-400 to-indigo-500','from-amber-400 to-orange-500','from-pink-400 to-purple-500'];

  const validate = () => {
    const next: { image?: string; externalUrl?: string } = {};
    if (form.image && !isValidImageUrl(form.image)) next.image = 'Enter a valid http(s) image URL';
    if (form.externalUrl && !isValidHttpUrl(form.externalUrl)) next.externalUrl = 'Enter a valid http(s) URL';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await updateArticle(slug, {
        ...form,
        category: form.category as ArticleInput['category'],
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      });
      toast.success('Article updated');
      router.push('/admin/newsroom');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update article');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/newsroom" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/40 hover:text-[#24638F] dark:hover:text-cyan-400 mb-4">
        <ArrowLeft size={16} /> Back to Articles
      </Link>
      <h1 className="text-xl font-black text-slate-900 dark:text-white mb-6">Edit Article</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 space-y-5">
          <FormField label="Title *">
            <input className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Slug">
              <input className={inputClass} value={form.slug} onChange={e => set('slug', e.target.value)} />
            </FormField>
            <FormField label="Category">
              <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
                {categories.filter(c => c.key !== 'All').map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Author">
              <input className={inputClass} value={form.author} onChange={e => set('author', e.target.value)} />
            </FormField>
            <FormField label="Date">
              <input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} />
            </FormField>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <FormField label="Image URL" hint={errors.image}>
              <input className={`${inputClass} ${errors.image ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}`} value={form.image} onChange={e => { set('image', e.target.value); if (errors.image) setErrors(err => ({ ...err, image: undefined })); }} />
            </FormField>
            <FormField label="Emoji">
              <input className={inputClass} value={form.emoji} onChange={e => set('emoji', e.target.value)} />
            </FormField>
            <FormField label="Color Gradient">
              <select className={inputClass} value={form.color} onChange={e => set('color', e.target.value)}>
                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>

          {form.image && isValidImageUrl(form.image) && (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 h-32">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <FormField label="Excerpt">
            <textarea className={`${inputClass} h-20 resize-none`} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
          </FormField>

          <FormField label="Tags (comma-separated)">
            <input className={inputClass} value={form.tags} onChange={e => set('tags', e.target.value)} />
          </FormField>

          <FormField label="Pull Quote">
            <input className={inputClass} value={form.pullQuote} onChange={e => set('pullQuote', e.target.value)} />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="External URL (optional)" hint={errors.externalUrl}>
              <input className={`${inputClass} ${errors.externalUrl ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10' : ''}`} value={form.externalUrl} onChange={e => { set('externalUrl', e.target.value); if (errors.externalUrl) setErrors(err => ({ ...err, externalUrl: undefined })); }} />
            </FormField>
            <FormField label="Featured">
              <label className="flex items-center gap-2 h-[42px]">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="h-5 w-5 rounded accent-[#24638F]" />
                <span className="text-sm text-slate-600 dark:text-white/60">Show as featured</span>
              </label>
            </FormField>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40">Body (Markdown) *</label>
            <div className="flex rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden">
              <button type="button" onClick={() => setShowPreview(false)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold ${!showPreview ? 'bg-[#24638F] text-white' : 'text-slate-500 dark:text-white/50'}`}>
                <Edit3 size={13} /> Write
              </button>
              <button type="button" onClick={() => setShowPreview(true)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold ${showPreview ? 'bg-[#24638F] text-white' : 'text-slate-500 dark:text-white/50'}`}>
                <Eye size={13} /> Preview
              </button>
            </div>
          </div>
          {showPreview ? (
            <div className="min-h-[300px] rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-4">
              <ReactMarkdown>{form.body || '*Empty*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea className={`${inputClass} h-[300px] resize-y font-mono text-[13px]`} value={form.body} onChange={e => set('body', e.target.value)} />
          )}
        </div>

        <FormButtons onCancelHref="/admin/newsroom" submitLabel="Save Changes" />
      </form>
    </div>
  );
}
