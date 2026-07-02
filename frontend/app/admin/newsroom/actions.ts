'use server';

import { promises as fs } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

const DATA_FILE = join(process.cwd(), 'app', 'data', 'json', 'articles.json');

export interface ArticleInput {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: 'Company' | 'Press' | 'Blog' | 'India GCC';
  excerpt: string;
  body: string;
  image: string;
  emoji: string;
  color: string;
  featured?: boolean;
  externalUrl?: string;
  pdfs?: { name: string; url: string; size?: string }[];
  tags?: string[];
  pullQuote?: string;
}

async function readArticles(): Promise<ArticleInput[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as ArticleInput[];
}

async function writeArticles(articles: ArticleInput[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2), 'utf-8');
}

export async function getArticles(): Promise<ArticleInput[]> {
  return readArticles();
}

export async function getArticleBySlug(slug: string): Promise<ArticleInput | undefined> {
  const articles = await readArticles();
  return articles.find(a => a.slug === slug);
}

export async function createArticle(data: ArticleInput) {
  const articles = await readArticles();
  if (articles.some(a => a.slug === data.slug)) {
    throw new Error('An article with this slug already exists.');
  }
  articles.push(data);
  await writeArticles(articles);
  revalidatePath('/admin/newsroom');
  revalidatePath('/newsroom');
}

export async function updateArticle(slug: string, data: ArticleInput) {
  const articles = await readArticles();
  const idx = articles.findIndex(a => a.slug === slug);
  if (idx === -1) throw new Error('Article not found.');
  articles[idx] = data;
  await writeArticles(articles);
  revalidatePath('/admin/newsroom');
  revalidatePath('/newsroom');
  revalidatePath(`/newsroom/${slug}`);
  revalidatePath(`/admin/newsroom/${slug}`);
}

export async function deleteArticle(slug: string) {
  const articles = await readArticles();
  const filtered = articles.filter(a => a.slug !== slug);
  await writeArticles(filtered);
  revalidatePath('/admin/newsroom');
  revalidatePath('/newsroom');
}
