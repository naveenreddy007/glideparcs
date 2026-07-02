'use server';

import { promises as fs } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

const DATA_FILE = join(process.cwd(), 'app', 'data', 'json', 'team.json');

export interface TeamMemberInput {
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

async function readTeam(): Promise<TeamMemberInput[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as TeamMemberInput[];
}

async function writeTeam(team: TeamMemberInput[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(team, null, 2), 'utf-8');
}

export async function getTeam(): Promise<TeamMemberInput[]> {
  return readTeam();
}

export async function getTeamMemberById(id: string): Promise<TeamMemberInput | undefined> {
  const team = await readTeam();
  return team.find(m => m.id === id);
}

export async function createTeamMember(data: TeamMemberInput) {
  const team = await readTeam();
  if (team.some(m => m.id === data.id)) {
    throw new Error('A team member with this ID already exists.');
  }
  team.push(data);
  await writeTeam(team);
  revalidatePath('/admin/team');
  revalidatePath('/org-hierarchy');
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  const team = await readTeam();
  const idx = team.findIndex(m => m.id === id);
  if (idx === -1) throw new Error('Team member not found.');
  team[idx] = data;
  await writeTeam(team);
  revalidatePath('/admin/team');
  revalidatePath('/org-hierarchy');
}

export async function deleteTeamMember(id: string) {
  const team = await readTeam();
  const filtered = team.filter(m => m.id !== id);
  await writeTeam(filtered);
  revalidatePath('/admin/team');
  revalidatePath('/org-hierarchy');
}
