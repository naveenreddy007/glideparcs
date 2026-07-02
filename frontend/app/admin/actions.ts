'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';

export async function loginAdmin(password: string) {
  if (password !== ADMIN_SECRET) {
    throw new Error('Invalid admin password');
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'authenticated';
}
