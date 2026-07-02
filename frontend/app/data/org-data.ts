import orgDataImport from './json/team.json';
import settingsImport from './json/settings.json';

export interface OrgNode {
  id: string;
  parentId: string | null;
  name: string;
  role: string;
  department: string;
  location: string;
  email?: string;
  bio?: string;
  startDate?: string;
  photoUrl?: string;
  linkedin?: string;
}

export const DEPARTMENT_COLORS: Record<string, string> = {
  Executive: '#8b5cf6',
  Operations: '#3b82f6',
  Platform: '#06b6d4',
  'AI/ML': '#06b6d4',
  Mobile: '#10b981',
  'QA/DevOps': '#f59e0b',
  Product: '#ec4899',
  Corporate: '#64748b',
};

export const DEPARTMENTS = ['Executive', 'Operations', 'Platform', 'AI/ML', 'Mobile', 'QA/DevOps', 'Product', 'Corporate'];

export const LOCATIONS = ['New Orleans, LA', 'Hyderabad, India', 'Seattle, WA'];

export const COMPANY_STATS = settingsImport.stats as Record<string, string>;

export const TIMELINE = settingsImport.timeline as { year: string; title: string; description: string }[];

export const orgData: OrgNode[] = orgDataImport as OrgNode[];

export function getOrgStats() {
  const total = orgData.length;
  const byDept: Record<string, number> = {};
  const byLocation: Record<string, number> = {};
  orgData.forEach(n => {
    byDept[n.department] = (byDept[n.department] || 0) + 1;
    byLocation[n.location] = (byLocation[n.location] || 0) + 1;
  });
  return { total, byDept, byLocation };
}
