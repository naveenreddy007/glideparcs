'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader, DataTable, Badge, ConfirmDialog } from '../_components/AdminComponents';
import { getEvents, deleteEvent } from './actions';
import { toast } from 'sonner';

export default function EventsListPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEvent(deleteTarget.id);
      toast.success('Event deleted');
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete event');
    }
  };

  const columns = [
    { key: 'name', header: 'Event', sortable: true, render: (e: any) => (
      <div className="flex items-center gap-2">
        <span className="text-base">{e.emoji}</span>
        <span className="font-bold text-slate-800 dark:text-white/80">{e.name}</span>
      </div>
    )},
    { key: 'type', header: 'Type', sortable: true, render: (e: any) => <Badge color={e.color}>{e.type}</Badge> },
    { key: 'date', header: 'Date', sortable: true, render: (e: any) => (
      <span className="text-xs">{new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    )},
    { key: 'time', header: 'Time', sortable: true },
  ];

  if (loading) return <div className="text-sm text-slate-400">Loading events…</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Events" subtitle={`${events.length} upcoming events`} action={{ label: 'New Event', href: '/admin/events/new' }} />
      <DataTable
        columns={columns}
        data={events}
        searchKeys={['name', 'type', 'time']}
        getEditHref={(e) => `/admin/events/${e.id}`}
        onDelete={(e) => setDeleteTarget(e)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Event"
        message={`Delete "${deleteTarget?.name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
