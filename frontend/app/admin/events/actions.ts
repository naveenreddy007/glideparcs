'use server';

import { promises as fs } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

const DATA_FILE = join(process.cwd(), 'app', 'data', 'json', 'events.json');

export interface EventInput {
  id: number;
  date: string;
  name: string;
  type: string;
  color: string;
  emoji: string;
  time?: string;
  description?: string;
  link?: string;
}

async function readEvents(): Promise<EventInput[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as EventInput[];
}

async function writeEvents(events: EventInput[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
}

export async function getEvents(): Promise<EventInput[]> {
  return readEvents();
}

export async function getEventById(id: number): Promise<EventInput | undefined> {
  const events = await readEvents();
  return events.find(e => e.id === id);
}

export async function createEvent(data: EventInput) {
  const events = await readEvents();
  const nextId = events.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  events.push({ ...data, id: nextId });
  await writeEvents(events);
  revalidatePath('/admin/events');
  revalidatePath('/event-calendar');
}

export async function updateEvent(id: number, data: EventInput) {
  const events = await readEvents();
  const idx = events.findIndex(e => e.id === id);
  if (idx === -1) throw new Error('Event not found.');
  events[idx] = data;
  await writeEvents(events);
  revalidatePath('/admin/events');
  revalidatePath('/event-calendar');
}

export async function deleteEvent(id: number) {
  const events = await readEvents();
  const filtered = events.filter(e => e.id !== id);
  await writeEvents(filtered);
  revalidatePath('/admin/events');
  revalidatePath('/event-calendar');
}
