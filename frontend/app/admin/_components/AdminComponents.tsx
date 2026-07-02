'use client';

import { useState, useMemo, ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, MoreVertical, Edit2, Trash2, Copy,
  ChevronLeft, ChevronRight, Inbox, X, AlertTriangle,
} from 'lucide-react';

/* ─── StatCard ─── */
export function StatCard({ icon: Icon, label, value, sublabel, color }: {
  icon: any; label: string; value: string | number; sublabel?: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 mt-1">{label}</div>
      {sublabel && <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{sublabel}</div>}
    </div>
  );
}

/* ─── PageHeader ─── */
export function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 dark:text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-2 rounded-xl bg-[#24638F] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#1C5075] hover:scale-[1.02]">
          <Plus size={16} /> {action.label}
        </Link>
      )}
    </div>
  );
}

/* ─── DataTable ─── */
export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}

export function DataTable<T extends { id?: string | number; slug?: string }>({
  columns, data, searchKeys, onEdit, onDelete, getEditHref, emptyMessage,
}: {
  columns: Column<T>[];
  data: T[];
  searchKeys: string[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  getEditHref?: (row: T) => string;
  emptyMessage?: string;
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [actionRow, setActionRow] = useState<T | null>(null);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(row =>
        searchKeys.some(key => String((row as any)[key] || '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = String((a as any)[sortKey] || '');
        const bv = String((b as any)[sortKey] || '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return result;
  }, [data, search, sortKey, sortDir, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] overflow-hidden">
      {/* Search bar */}
      <div className="border-b border-slate-200 dark:border-white/[0.06] p-4">
        <div className="relative max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search…"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-white/70 placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-[#24638F]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/[0.06]">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 ${col.sortable ? 'cursor-pointer hover:text-slate-600 dark:hover:text-white/60' : ''}`}
                >
                  {col.header} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              ))}
              <th className="px-4 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={row.id || row.slug || i} className="border-b border-slate-100 dark:border-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-slate-700 dark:text-white/70">
                    {col.render ? col.render(row) : String((row as any)[col.key] || '')}
                  </td>
                ))}
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() => setActionRow(actionRow === row ? null : row)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <MoreVertical size={15} />
                  </button>
                  {actionRow === row && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActionRow(null)} />
                      <div className="absolute right-8 top-0 z-20 w-40 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f2744] shadow-xl py-1">
                        {getEditHref && (
                          <Link href={getEditHref(row)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5">
                            <Edit2 size={13} /> Edit
                          </Link>
                        )}
                        {onEdit && (
                          <button onClick={() => { onEdit(row); setActionRow(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5">
                            <Edit2 size={13} /> Edit
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => { onDelete(row); setActionRow(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {paged.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox size={32} className="text-slate-300 dark:text-white/20 mb-2" />
          <p className="text-sm font-medium text-slate-400 dark:text-white/30">{emptyMessage || 'No items found.'}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/[0.06] px-4 py-3">
          <span className="text-xs font-semibold text-slate-400 dark:text-white/40">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-bold transition-all ${
                  page === i + 1
                    ? 'bg-[#24638F] text-white'
                    : 'border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── FormField ─── */
export function FormField({ label, children, hint }: {
  label: string; children: ReactNode; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 dark:text-white/30 mt-1">{hint}</p>}
    </div>
  );
}

export const inputClass = "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white/80 placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-[#24638F] focus:ring-2 focus:ring-[#24638F]/10 transition-all";

/* ─── ConfirmDialog ─── */
export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[81] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f2744] p-6 shadow-2xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
                <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1">{message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={onCancel} className="rounded-lg border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5">
                Cancel
              </button>
              <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── FormButtons ─── */
export function FormButtons({ onCancelHref, submitLabel = 'Save', disabled }: {
  onCancelHref: string; submitLabel?: string; disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/[0.06]">
      <Link href={onCancelHref} className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
        Cancel
      </Link>
      <button type="submit" disabled={disabled} className="rounded-xl bg-[#24638F] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#1C5075] hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
        {submitLabel}
      </button>
    </div>
  );
}

/* ─── Badge ─── */
export function Badge({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={color ? { backgroundColor: `${color}15`, color } : undefined}
    >
      {children}
    </span>
  );
}
