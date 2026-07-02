'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader, DataTable, Badge, ConfirmDialog } from '../_components/AdminComponents';
import { getHolidays, deleteHoliday, HolidayInput } from './actions';
import { toast } from 'sonner';

export default function HolidaysListPage() {
  const [holidays, setHolidays] = useState<HolidayInput[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<HolidayInput | null>(null);

  const load = async () => {
    const data = await getHolidays();
    setHolidays(data);
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { key: 'name', header: 'Holiday', sortable: true, render: (h: HolidayInput) => (
      <div className="flex items-center gap-2">
        <span className="text-base">{h.emoji}</span>
        <span className="font-bold text-slate-800 dark:text-white/80">{h.name}</span>
      </div>
    )},
    { key: 'type', header: 'Type', sortable: true, render: (h: HolidayInput) => <Badge color={h.color}>{h.type}</Badge> },
    { key: 'date', header: 'Date', sortable: true, render: (h: HolidayInput) => (
      <span className="text-xs">{new Date(h.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    )},
    { key: 'region', header: 'Region', sortable: true, render: (h: HolidayInput) => h.region || 'India' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Holidays" subtitle={`${holidays.length} holidays`} action={{ label: 'New Holiday', href: '/admin/holidays/new' }} />
      <DataTable
        columns={columns}
        data={holidays}
        searchKeys={['name', 'type', 'region']}
        getEditHref={(h) => `/admin/holidays/${h.id}`}
        onDelete={(h) => setDeleteTarget(h)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Holiday"
        message={`Delete "${deleteTarget?.name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteHoliday(deleteTarget.id);
            toast.success('Holiday deleted');
            setDeleteTarget(null);
            load();
          }
        }}
      />
    </div>
  );
}
