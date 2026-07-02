import { Holiday } from '../components/GlassCalendar';
import holidaysData from './json/holidays.json';

export const HOLIDAY_REGIONS = ['All', 'Global', 'US', 'India'];

export const HOLIDAY_COLORS = [
  'from-violet-400 to-blue-500',
  'from-pink-400 to-purple-500',
  'from-emerald-400 to-teal-500',
  'from-green-400 to-red-500',
  'from-red-400 to-blue-500',
  'from-red-300 to-blue-400',
  'from-red-500 to-blue-600',
  'from-red-400 to-green-500',
  'from-blue-400 to-indigo-500',
  'from-amber-400 to-blue-500',
  'from-orange-400 to-amber-600',
  'from-orange-400 to-green-500',
  'from-indigo-400 to-purple-500',
  'from-pink-400 to-yellow-400',
  'from-orange-400 to-yellow-500',
  'from-orange-500 to-green-600',
  'from-amber-300 to-orange-400',
  'from-red-400 to-orange-500',
  'from-yellow-400 to-orange-500',
  'from-amber-400 to-yellow-500',
];

export const allHolidays: Holiday[] = holidaysData as Holiday[];
