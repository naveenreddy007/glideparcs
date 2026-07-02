'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader, DataTable, Badge, ConfirmDialog } from '../_components/AdminComponents';
import { getArticles, deleteArticle } from './actions';
import { toast } from 'sonner';

export default function NewsroomListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getArticles();
    setArticles(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteArticle(deleteTarget.slug);
      toast.success('Article deleted');
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete article');
    }
  };

  const columns = [
    { key: 'title', header: 'Title', sortable: true, render: (a: any) => (
      <div className="flex items-center gap-2">
        <span className="text-base">{a.emoji}</span>
        <div>
          <div className="font-bold text-slate-800 dark:text-white/80">{a.title}</div>
          {a.featured && <span className="text-[10px] font-bold text-amber-600">★ Featured</span>}
        </div>
      </div>
    )},
    { key: 'category', header: 'Category', sortable: true, render: (a: any) => (
      <Badge color="#3b82f6">{a.category}</Badge>
    )},
    { key: 'date', header: 'Date', sortable: true, render: (a: any) => (
      <span className="text-xs">{new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    )},
    { key: 'author', header: 'Author', sortable: true },
  ];

  if (loading) return <div className="text-sm text-slate-400">Loading articles…</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Newsroom"
        subtitle={`${articles.length} articles published`}
        action={{ label: 'New Article', href: '/admin/newsroom/new' }}
      />
      <DataTable
        columns={columns}
        data={articles}
        searchKeys={['title', 'author', 'category']}
        getEditHref={(a) => `/admin/newsroom/${a.slug}`}
        onDelete={(a) => setDeleteTarget(a)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
