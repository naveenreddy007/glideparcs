'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader, DataTable, Badge, ConfirmDialog } from '../_components/AdminComponents';
import { getTeam, deleteTeamMember, TeamMemberInput } from './actions';
import { toast } from 'sonner';

export default function TeamListPage() {
  const [team, setTeam] = useState<TeamMemberInput[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<TeamMemberInput | null>(null);

  useEffect(() => {
    getTeam().then(setTeam).catch(() => toast.error('Failed to load team'));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTeamMember(deleteTarget.id);
      toast.success('Member removed');
      setDeleteTarget(null);
      setTeam(await getTeam());
    } catch (e) {
      toast.error('Failed to delete member');
    }
  };

  const columns = [
    { key: 'name', header: 'Name', sortable: true, render: (m: TeamMemberInput) => (
      <div className="flex items-center gap-3">
        {m.photoUrl ? (
          <img src={m.photoUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/10" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#24638F]/10 flex items-center justify-center text-xs font-black text-[#24638F]">{m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
        )}
        <div>
          <div className="font-bold text-slate-800 dark:text-white/80">{m.name}</div>
          {m.location && <div className="text-[10px] text-slate-400">{m.location}</div>}
        </div>
      </div>
    )},
    { key: 'role', header: 'Role', sortable: true },
    { key: 'department', header: 'Department', sortable: true, render: (m: TeamMemberInput) => <Badge color="#8b5cf6">{m.department}</Badge> },
    { key: 'parentId', header: 'Reports To', sortable: true, render: (m: TeamMemberInput) => {
      const parent = team.find(p => p.id === m.parentId);
      return <span className="text-xs">{parent?.name || '—'}</span>;
    }},
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Team" subtitle={`${team.length} members`} action={{ label: 'New Member', href: '/admin/team/new' }} />
      <DataTable
        columns={columns}
        data={team}
        searchKeys={['name', 'role', 'department', 'email']}
        getEditHref={(m) => `/admin/team/${m.id}`}
        onDelete={(m) => setDeleteTarget(m)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Team Member"
        message={`Remove "${deleteTarget?.name}" from the org chart?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
