import articlesData from './json/articles.json';

export interface Article {
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

export const articles: Article[] = articlesData as Article[];

export const categories = [
  { key: 'All', label: '📰 All News' },
  { key: 'Company', label: '🏢 Company' },
  { key: 'Press', label: '📰 Press' },
  { key: 'Blog', label: '📝 Blog' },
  { key: 'India GCC', label: '🇮🇳 India GCC' },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}
