import { Holiday } from '../components/GlassCalendar';
import eventsData from './json/events.json';

export interface Event extends Holiday {
  id: number;
  time?: string;
  description?: string;
  link?: string;
}

export const EVENT_CATEGORIES = ['All', 'Company', 'Team', 'Birthday', 'Training', 'Social'];

export const EVENT_COLORS = [
  'from-violet-400 to-blue-500',
  'from-blue-400 to-cyan-500',
  'from-pink-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-red-400 to-pink-500',
  'from-emerald-400 to-teal-500',
  'from-indigo-400 to-blue-500',
  'from-orange-400 to-red-500',
  'from-purple-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-green-400 to-teal-500',
  'from-red-400 to-yellow-500',
];

export const allEvents: Event[] = eventsData as Event[];
