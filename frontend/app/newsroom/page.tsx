'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Search, ChevronDown, Newspaper, TrendingUp,
  Globe2, ArrowRight, ExternalLink, Clock, FileText,
} from 'lucide-react';
import FloatingParticles from '../components/FloatingParticles';
import { articles, categories, Article } from '../data/newsroom';

function ArticleCard({ article, featured }: { article: Article; featured?: boolean }) {
  return (
    <Link href={`/newsroom/${article.slug}`}>
      <motion.article
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-[20px] transition-all duration-300 hover:border-slate-300 dark:hover:border-white/15 hover:shadow-xl dark:hover:shadow-2xl h-full ${
          featured ? '' : ''
        }`}
      >
        <div className="relative shrink-0 h-44 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute top-3 left-3"
          >
            <span className={`inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md uppercase tracking-wider`}>
              {article.emoji} {article.category}
            </span>
          </motion.div>
        </div>

        <div className="flex flex-col flex-1 p-5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider mb-2">
            {new Date(article.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <h3 className={`font-extrabold text-slate-900 dark:text-white leading-tight transition-colors group-hover:text-cyan-700 dark:group-hover:text-cyan-300 ${featured ? 'text-xl' : 'text-base'}`}>
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-white/45 leading-relaxed line-clamp-2 flex-1">
            {article.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:gap-2 transition-all">
              Read more <ArrowRight size={14} />
            </div>
            {article.pdfs && article.pdfs.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-400/20 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                <FileText size={10} /> PDF
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default function NewsroomPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return filteredArticles.find(a => a.featured) || filteredArticles[0];
  }, [filteredArticles]);

  const regularArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    return filteredArticles.filter(a => a.slug !== featuredArticle.slug);
  }, [filteredArticles, featuredArticle]);

  const stats = useMemo(() => {
    return {
      total: articles.length,
      company: articles.filter(a => a.category === 'Company').length,
      press: articles.filter(a => a.category === 'Press').length,
      blog: articles.filter(a => a.category === 'Blog').length,
      india: articles.filter(a => a.category === 'India GCC').length,
    };
  }, []);

  const recentArticles = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-[#0a1929] text-slate-900 dark:text-white selection:bg-cyan-400/20 pb-24 transition-colors duration-300">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#0a1929] dark:via-[#0f2744] dark:to-[#0a1929] transition-colors duration-300" />
        <div className="absolute left-0 top-0 h-[800px] w-[800px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-300/30 dark:bg-[#24638F]/20 blur-[180px]" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-cyan-400/20 dark:bg-cyan-600/10 blur-[150px]" />
      </div>
      <FloatingParticles />

      <section className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 mt-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.8, delay: 0.1 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 dark:border-cyan-400/25 bg-cyan-50 dark:bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[2px] text-cyan-700 dark:text-cyan-300 backdrop-blur"
            >
              <Zap size={12} className="fill-cyan-600 dark:fill-cyan-300" /> Internal Newsroom
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl text-slate-900 dark:text-white">
              Newsroom{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-200 dark:from-white/30 dark:to-white/10">2026</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.8, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles…"
                aria-label="Search articles"
                className="w-full sm:w-56 rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 backdrop-blur-xl transition-all focus:border-cyan-400 dark:focus:border-cyan-400/40 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 dark:focus:ring-cyan-400/10"
              />
            </div>

            <div className="flex gap-1.5 flex-wrap items-center">
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setCategoryOpen(o => !o)}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-[#0a1929] shadow-md transition-all"
                >
                  {categories.find(c => c.key === activeCategory)?.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoryOpen && (
                  <div className="absolute top-full mt-1.5 left-0 z-50 min-w-[180px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f2744] shadow-lg overflow-hidden">
                    {categories.filter(c => c.key !== activeCategory).map(c => (
                      <button
                        key={c.key}
                        onClick={() => { setActiveCategory(c.key); setCategoryOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-5">

          {/* ROW 1: Hero + Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.3 }}
            className="grid gap-5 lg:grid-cols-[2fr_1fr]"
          >
            {featuredArticle && (
              <Link href={`/newsroom/${featuredArticle.slug}`}>
                <motion.article
                  whileHover={{ y: -2 }}
                  className="group relative flex flex-col lg:flex-row overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-[30px] transition-all duration-300 hover:border-slate-300 dark:hover:border-white/15 hover:shadow-2xl dark:hover:shadow-2xl h-full cursor-pointer"
                >
                  <div className="relative lg:w-1/2 shrink-0 h-56 lg:h-auto overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:via-transparent lg:to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/25 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md uppercase tracking-wider">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-6 lg:p-8 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${featuredArticle.color} px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider`}>
                        {featuredArticle.emoji} {featuredArticle.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">
                        {new Date(featuredArticle.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight transition-colors group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                      {featuredArticle.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-white/45 leading-relaxed line-clamp-2">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:gap-2 transition-all">
                      Read story <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.article>
              </Link>
            )}

            {/* Stats & Quick Links Sidebar */}
            <div className="flex flex-col gap-5">
              <div className="rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 backdrop-blur-[30px] flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-xs font-bold tracking-wide text-slate-500 dark:text-white/50 uppercase">Article Stats</h2>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Total', value: stats.total, color: 'text-slate-900 dark:text-white' },
                    { label: 'Press', value: stats.press, color: 'text-red-600 dark:text-red-400' },
                    { label: 'Blog', value: stats.blog, color: 'text-blue-600 dark:text-blue-400' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] p-3 text-center">
                      <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Company', value: stats.company, color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'India GCC', value: stats.india, color: 'text-orange-600 dark:text-orange-400' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] p-3 text-center">
                      <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent sidebar */}
              <div className="rounded-[28px] border border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 backdrop-blur-[30px]">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-xs font-bold tracking-wide text-slate-500 dark:text-white/50 uppercase">Most Recent</h2>
                </div>
                <div className="space-y-3">
                  {recentArticles.map(a => (
                    <Link key={a.slug} href={`/newsroom/${a.slug}`} className="block group">
                      <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors -mx-2">
                        <span className="text-lg shrink-0">{a.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                            {a.title}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-400 dark:text-white/35 mt-0.5">
                            {new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {' · '}{a.category}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ROW 2: Article Grid */}
          {regularArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe2 size={18} className="text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-sm font-bold tracking-wide text-slate-600 dark:text-white/60 uppercase">
                    {activeCategory === 'All' ? 'All Articles' : activeCategory}
                  </h2>
                </div>
                <span className="text-[10px] font-bold rounded-full bg-slate-200 dark:bg-white/10 px-2 py-0.5 text-slate-500 dark:text-white/40">
                  {regularArticles.length} article{regularArticles.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {regularArticles.map((article, i) => (
                    <motion.div
                      key={article.slug}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22, mass: 0.8, delay: i * 0.05 }}
                    >
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {regularArticles.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-400 dark:text-white/30 py-16 text-sm font-medium italic">
                  No articles match your criteria.
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
