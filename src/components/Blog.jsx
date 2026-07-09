import { useState } from 'react'
import { ArrowRight, ArrowLeft, BookOpen, ExternalLink, ChevronDown, ChevronUp, Tag, Layers3, Store } from 'lucide-react'
import SmartImage from './SmartImage'
import { useScrollReveal } from '../hooks/useScrollReveal'
import BLOGS from '../blogs.json'
import { CATEGORIES, SELLERS } from '../data'
import { Helmet } from 'react-helmet-async'

/* Single blog card — opens the real Romegamart article in a new tab. */
function BlogCard({ post }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-aqua-200 hover:shadow-lift"
    >
      <SmartImage
        src={post.image}
        alt={post.title}
        className="aspect-[4/3] w-full max-h-[140px] object-cover"
        imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <h3 className="clamp-2 text-[11px] font-bold leading-snug text-navy-800 transition-colors group-hover:text-aqua-700 sm:text-xs">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">{post.excerpt}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-aqua-700 sm:text-[11px]">
          Read article <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </a>
  )
}

/* Sidebar section — collapsible list of related items. */
function SidebarSection({ icon: Icon, title, items, onNavigate, color }) {
  const [expanded, setExpanded] = useState(true)

  if (!items || items.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-soft overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${color}`}>
          <Icon className="h-3.5 w-3.5" />
          {title}
        </span>
        {expanded ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
      </button>
      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-3 pt-2 space-y-1.5">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(item)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-600 transition-all hover:bg-aqua-50 hover:text-aqua-700"
            >
              {item.image && (
                <img src={item.image} alt="" className="h-5 w-5 rounded-sm object-contain shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
              <ArrowRight className="ml-auto h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-slate-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * BlogSection — homepage teaser showing the latest few articles.
 */
export function BlogSection({ onViewAll }) {
  const ref = useScrollReveal()
  const featured = BLOGS.slice(0, 6)

  return (
    <section ref={ref} id="blogs" className="reveal mx-auto max-w-7xl scroll-mt-28 px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-aqua-600">From the Blog</p>
          <h2 className="text-2xl font-bold text-navy-800 sm:text-3xl">RO industry insights & guides</h2>
        </div>
        <button
          onClick={onViewAll}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-navy-700"
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {featured.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

/**
 * BlogView — full blog listing with smaller hero and right sidebar
 * showing related categories, brands, and sellers.
 */
export function BlogView({ onClose, onNavigate }) {
  const [selectedBlog, setSelectedBlog] = useState(null)

  const handleNavigate = (item) => {
    if (onNavigate) {
      onNavigate(item.target)
    }
  }

  // Get related items for the selected blog or show all
  const activeBlog = selectedBlog || BLOGS[0]

  // Build sidebar items from blog data
  const relatedCategories = (activeBlog.categories || [])
    .map(catId => CATEGORIES.find(c => c.id === catId))
    .filter(Boolean)
    .map(c => ({ label: c.name, target: `/category/${c.id}`, image: c.image }))

  const relatedBrands = (activeBlog.brands || [])
    .map(brand => ({ label: brand, target: `/brand/${encodeURIComponent(brand)}` }))

  const relatedSellers = (activeBlog.sellers || [])
    .map(sellerName => {
      const seller = SELLERS.find(s => s.name === sellerName)
      return { label: sellerName, target: `/store/${encodeURIComponent(sellerName)}`, image: seller?.image }
    })

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-6">
      <Helmet>
        <title>Blog — RO Industry News, Guides & Tips | Romegamart</title>
        <meta name="description" content="Read the latest articles on RO water purifiers, industrial water treatment, maintenance tips &amp; wholesale buying guides from India's #1 B2B marketplace." />
        <meta property="og:title" content="Romegamart Blog — RO Industry News & Guides" />
        <meta property="og:description" content="Expert insights on RO spares, water treatment &amp; B2B wholesale for the RO industry." />
        <link rel="canonical" href="https://romegamart.com/blogs" />
      </Helmet>

      <button onClick={onClose} className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-aqua-700 hover:text-aqua-800">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </button>

      <h1 className="flex items-center gap-2 text-2xl font-bold text-navy-800 sm:text-3xl">
        <BookOpen className="h-6 w-6 text-aqua-500" /> Romegamart Blog
      </h1>
      <p className="mt-1 text-sm text-slate-500">{BLOGS.length} articles on the RO & water-purification industry</p>

      {/* Hero — smaller featured image */}
      {activeBlog && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
          <div className="aspect-[3/1] sm:aspect-[4/1] w-full max-h-[160px] overflow-hidden">
            <SmartImage
              src={activeBlog.image}
              alt={activeBlog.title}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
          <div className="p-4 sm:p-5">
            <h2 className="text-lg font-bold text-navy-800 sm:text-xl">{activeBlog.title}</h2>
            <p className="mt-2 text-sm text-slate-500 line-clamp-2">{activeBlog.excerpt}</p>
            <a
              href={activeBlog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-700 hover:text-aqua-800"
            >
              Read full article <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* Main content + Sidebar */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Blog cards grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {BLOGS.map((post) => (
            <div
              key={post.id}
              className={`cursor-pointer transition-all ${selectedBlog?.id === post.id ? 'ring-2 ring-aqua-400 rounded-2xl' : ''}`}
              onClick={() => setSelectedBlog(post)}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <SidebarSection
            icon={Tag}
            title="Related Categories"
            items={relatedCategories}
            onNavigate={handleNavigate}
            color="text-aqua-600"
          />
          <SidebarSection
            icon={Layers3}
            title="Related Brands"
            items={relatedBrands}
            onNavigate={handleNavigate}
            color="text-purple-600"
          />
          <SidebarSection
            icon={Store}
            title="Related Sellers"
            items={relatedSellers}
            onNavigate={handleNavigate}
            color="text-orange-600"
          />
        </aside>
      </div>
    </section>
  )
}
