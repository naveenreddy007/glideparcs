'use server';

import { promises as fs } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

const DATA_FILE = join(process.cwd(), 'app', 'data', 'json', 'holidays.json');

export interface HolidayInput {
  id: number;
  date: string;
  name: string;
  type: string;
  color: string;
  emoji: string;
  region?: string;
  description?: string;
}

async function readHolidays(): Promise<HolidayInput[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as HolidayInput[];
}

async function writeHolidays(holidays: HolidayInput[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(holidays, null, 2), 'utf-8');
}

export async function getHolidays(): Promise<HolidayInput[]> {
  return readHolidays();
}

export async function getHolidayById(id: number): Promise<HolidayInput | undefined> {
  const holidays = await readHolidays();
  return holidays.find(h => h.id === id);
}

export async function createHoliday(data: HolidayInput) {
  const holidays = await readHolidays();
  const nextId = holidays.reduce((max, h) => Math.max(max, h.id || 0), 0) + 1;
  holidays.push({ ...data, id: nextId });
  await writeHolidays(holidays);
  revalidatePath('/admin/holidays');
  revalidatePath('/holiday-calendar');
}

export async function updateHoliday(id: number, data: HolidayInput) {
  const holidays = await readHolidays();
  const idx = holidays.findIndex(h => h.id === id);
  if (idx === -1) throw new Error('Holiday not found.');
  holidays[idx] = data;
  await writeHolidays(holidays);
  revalidatePath('/admin/holidays');
  revalidatePath('/holiday-calendar');
}

export async function deleteHoliday(id: number) {
  const holidays = await readHolidays();
  const filtered = holidays.filter(h => h.id !== id);
  await writeHolidays(filtered);
  revalidatePath('/admin/holidays');
  revalidatePath('/holiday-calendar');
}
