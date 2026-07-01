'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, ExternalLink, Share2, ChevronUp,
  FileText, Download, ChevronDown, ChevronRight,
  Type, AlignJustify, X, Bookmark,
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import FloatingParticles from '../../components/FloatingParticles';
import { getArticle, articles } from '../../data/newsroom';

const FONT_SIZES = { s: 'text-[14px]', m: 'text-[16px]', l: 'text-[18px]' };

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = getArticle(slug);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [fontSize, setFontSize] = useState<'s' | 'm' | 'l'>('m');
  const [tocOpen, setTocOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');

  const readingTime = useMemo(() => Math.max(1, Math.ceil((article?.body?.split(/\s+/).length ?? 0) / 200)), [article]);

  const headings = useMemo(() => {
    if (!article) return [];
    const h: { id: string; text: string; level: number }[] = [];
    article.body.split('\n').forEach(line => {
      const h2 = line.match(/^## (.+)/);
      const h3 = line.match(/^### (.+)/);
      if (h2) h.push({ id: h2[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), text: h2[1], level: 2 });
      if (h3) h.push({ id: h3[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), text: h3[1], level: 3 });
    });
    return h;
  }, [article]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter(a => a.slug !== article.slug && a.category === article.category)
      .slice(0, 3);
  }, [article]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
      setShowBackTop(scrollTop > 600);

      const headingEls = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      let current = '';
      for (let i = headingEls.length - 1; i >= 0; i--) {
        const el = headingEls[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          current = (el as HTMLElement).id;
          break;
        }
      }
      setActiveHeading(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  if (!article) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a1929]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Article not found</h1>
          <Link href="/newsroom" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
            ← Back to Newsroom
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-[#0a1929] text-slate-900 dark:text-white selection:bg-cyan-400/20 pb-24 transition-colors duration-300">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-slate-200 dark:bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#0a1929] dark:via-[#0f2744] dark:to-[#0a1929] transition-colors duration-300" />
        <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-300/30 dark:bg-[#24638F]/20 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-400/20 dark:bg-cyan-600/10 blur-[120px]" />
      </div>
      <FloatingParticles />

      {/* Reading tools floating bar */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {showBackTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              aria-label="Back to top"
            >
              <ChevronUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>
        <button
          onClick={() => setFontSize(p => p === 's' ? 'm' : p === 'm' ? 'l' : 's')}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label={`Font size: ${fontSize}`}
          title={`Font size: ${fontSize.toUpperCase()}`}
        >
          <Type size={16} />
          <span className="ml-0.5 text-[9px] font-black">{fontSize.toUpperCase()}</span>
        </button>
        <button
          onClick={() => setTocOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 shadow-lg hover:shadow-xl transition-all hover:scale-105 lg:hidden"
          aria-label="Table of contents"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      {/* Mobile ToC drawer */}
      <AnimatePresence>
        {tocOpen && headings.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTocOpen(false)}
              className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[60] w-[80%] max-w-sm bg-white dark:bg-[#0f2744] border-l border-slate-200 dark:border-white/10 shadow-2xl p-6 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-600 dark:text-white/60 uppercase tracking-wide">Contents</h3>
                <button onClick={() => setTocOpen(false)} className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/50">
                  <X size={16} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto space-y-1">
                {headings.map(h => (
                  <button
                    key={h.id}
                    onClick={() => {
                      document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                      setTocOpen(false);
                    }}
                    className={`block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      h.level === 2 ? '' : 'pl-6'
                    } ${
                      activeHeading === h.id
                        ? 'bg-cyan-50 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-300'
                        : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {h.text}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Two-column layout */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">

          {/* Desktop ToC sidebar */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 pt-8">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[2px] mb-4">
                  On this page
                </h4>
                <nav className="space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/15">
                  {headings.map(h => (
                    <button
                      key={h.id}
                      onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })}
                      className={`block w-full text-left rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border-l-2 ${
                        h.level === 2 ? '' : 'pl-6'
                      } ${
                        activeHeading === h.id
                          ? 'border-cyan-500 text-cyan-700 dark:text-cyan-300 bg-cyan-50/50 dark:bg-cyan-400/5'
                          : 'border-transparent text-slate-500 dark:text-white/45 hover:text-slate-700 dark:hover:text-white/70 hover:border-slate-200 dark:hover:border-white/10'
                      }`}
                    >
                      {h.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main content */}
          <article className={headings.length === 0 ? 'lg:col-span-2 lg:max-w-3xl lg:mx-auto' : ''}>
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="pt-8 mb-8"
            >
              <Link
                href="/newsroom"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Newsroom
              </Link>
            </motion.div>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${article.color} px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider`}>
                {article.emoji} {article.category}
              </span>
              <span className="text-sm font-semibold text-slate-400 dark:text-white/40">
                {new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-sm text-slate-400 dark:text-white/40">·</span>
              <span className="text-sm font-semibold text-slate-400 dark:text-white/40">
                By {article.author}
              </span>
              <span className="text-sm text-slate-400 dark:text-white/40">·</span>
              <span className="inline-flex items-center gap-1 text-sm text-slate-400 dark:text-white/40">
                <Clock size={13} /> {readingTime} min read
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.15 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight mb-6"
            >
              {article.title}
            </motion.h1>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.18 }}
                className="flex flex-wrap gap-1.5 mb-6"
              >
                {article.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.06] px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider">
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.2 }}
              className="relative mb-10 rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/[0.06] shadow-xl dark:shadow-2xl"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full object-cover aspect-[2/1]"
              />
            </motion.div>

            {/* Pull Quote */}
            {article.pullQuote && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.25 }}
                className="relative mb-10 rounded-[24px] border border-cyan-200 dark:border-cyan-400/20 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/40 dark:to-[#0f2744] p-8 text-center"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-400/30">
                  <span className="text-cyan-600 dark:text-cyan-300 text-lg font-serif leading-none">"</span>
                </div>
                <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-white/90 leading-relaxed italic">
                  {article.pullQuote}
                </p>
              </motion.div>
            )}

            {/* Article body with react-markdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.3 }}
              className={`${FONT_SIZES[fontSize]} prose-custom`}
            >
              <ReactMarkdown
                components={{
                  h2: ({ children, ...props }) => {
                    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    return (
                      <h2 id={id} className="text-2xl font-extrabold text-slate-900 dark:text-white mt-12 mb-4 scroll-mt-24" {...props}>
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children, ...props }) => {
                    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    return (
                      <h3 id={id} className="text-lg font-extrabold text-slate-900 dark:text-white mt-8 mb-3 scroll-mt-24" {...props}>
                        {children}
                      </h3>
                    );
                  },
                  p: ({ children, ...props }) => (
                    <p className="mb-5 leading-relaxed text-slate-700 dark:text-white/70" {...props}>
                      {children}
                    </p>
                  ),
                  a: ({ href, children, ...props }) => {
                    const isExternal = href && (href.startsWith('http') || href.startsWith('www'));
                    return (
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="text-cyan-600 dark:text-cyan-400 font-semibold underline decoration-cyan-300/50 hover:decoration-cyan-500 underline-offset-2"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  strong: ({ children, ...props }) => (
                    <strong className="font-extrabold text-slate-900 dark:text-white" {...props}>
                      {children}
                    </strong>
                  ),
                  em: ({ children, ...props }) => (
                    <em className="italic text-slate-600 dark:text-white/60" {...props}>
                      {children}
                    </em>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc pl-5 mb-5 space-y-2 text-slate-700 dark:text-white/70" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal pl-5 mb-5 space-y-2 text-slate-700 dark:text-white/70" {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="leading-relaxed" {...props}>
                      {children}
                    </li>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="relative my-8 pl-6 border-l-4 border-cyan-400 dark:border-cyan-500/50" {...props}>
                      <div className="text-slate-600 dark:text-white/60 italic leading-relaxed">
                        {children}
                      </div>
                    </blockquote>
                  ),
                  img: ({ src, alt, ...props }) => (
                    <figure className="my-10">
                      <div className="rounded-[24px] overflow-hidden border border-slate-200 dark:border-white/[0.06] shadow-lg">
                        <img src={src} alt={alt || ''} className="w-full object-cover" loading="lazy" {...props} />
                      </div>
                      {alt && (
                        <figcaption className="mt-3 text-center text-xs font-medium text-slate-400 dark:text-white/35 italic">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  ),
                  hr: () => (
                    <hr className="my-10 border-slate-200 dark:border-white/[0.06]" />
                  ),
                }}
              >
                {article.body}
              </ReactMarkdown>
            </motion.div>

            {/* PDF Downloads */}
            {article.pdfs && article.pdfs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.35 }}
                className="mt-12 rounded-[24px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-[20px] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Download size={16} className="text-cyan-600 dark:text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-600 dark:text-white/60 uppercase tracking-wide">Downloads</h3>
                </div>
                <div className="space-y-2">
                  {article.pdfs.map((pdf, i) => (
                    <a
                      key={i}
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.03] p-4 transition-all hover:border-cyan-200 dark:hover:border-cyan-400/20 hover:bg-cyan-50 dark:hover:bg-cyan-400/5 group"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
                        <FileText size={20} className="text-red-500 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                          {pdf.name}
                        </div>
                        {pdf.size && (
                          <div className="text-[10px] font-semibold text-slate-400 dark:text-white/35 uppercase mt-0.5">
                            PDF {pdf.size ? `· ${pdf.size}` : ''}
                          </div>
                        )}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all shrink-0">
                        <Download size={14} />
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* External source + Share */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.4 }}
              className="mt-10 pt-8 border-t border-slate-200 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                {article.externalUrl && (
                  <a
                    href={article.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/15 px-4 py-2.5 text-sm font-bold text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-400/25 transition-all hover:bg-cyan-200 dark:hover:bg-cyan-500/25"
                  >
                    <ExternalLink size={16} /> Visit Source
                  </a>
                )}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-white/70 transition-all hover:bg-slate-50 dark:hover:bg-white/10"
                >
                  <Share2 size={16} /> {copied ? 'Link Copied!' : 'Share Article'}
                </button>
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-white/35 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <ChevronUp size={14} /> Back to top
              </button>
            </motion.div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.45 }}
                className="mt-16"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Bookmark size={18} className="text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-sm font-bold tracking-wide text-slate-600 dark:text-white/60 uppercase">Related Articles</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {relatedArticles.map(a => (
                    <Link key={a.slug} href={`/newsroom/${a.slug}`}>
                      <motion.div
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="group rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-[10px] overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-xl"
                      >
                        <div className="h-28 overflow-hidden">
                          <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        </div>
                        <div className="p-4">
                          <span className="text-[9px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">
                            {a.emoji} {a.category}
                          </span>
                          <h4 className="mt-1 text-sm font-bold text-slate-800 dark:text-white leading-snug line-clamp-2 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                            {a.title}
                          </h4>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}
