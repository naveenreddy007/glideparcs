'use server';

import { promises as fs } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

const DATA_FILE = join(process.cwd(), 'app', 'data', 'json', 'settings.json');

export interface SettingsInput {
  stats: Record<string, string>;
  timeline: { year: string; title: string; description: string }[];
}

async function readSettings(): Promise<SettingsInput> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as SettingsInput;
}

async function writeSettings(settings: SettingsInput) {
  await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function getSettings(): Promise<SettingsInput> {
  return readSettings();
}

export async function updateSettings(settings: SettingsInput) {
  await writeSettings(settings);
  revalidatePath('/admin/settings');
  revalidatePath('/org-hierarchy');
}
