import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * SEOBlogSection — reusable SEO content section for category, subcategory,
 * brand, and seller pages. Shows expandable blog content at the bottom
 * to help with Google ranking.
 */
export default function SEOBlogSection({ title, content }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  // Handle internal link clicks
  useEffect(() => {
    if (!expanded) return

    const handleClick = (e) => {
      const link = e.target.closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (href && href.startsWith('/')) {
        e.preventDefault()
        navigate(href)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [expanded, navigate])

  if (!title || !content) return null

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 pb-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50 sm:px-6"
        >
          <h2 className="text-base font-bold text-navy-800 sm:text-lg">{title}</h2>
          {expanded ? (
            <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
          )}
        </button>

        {/* Content */}
        {expanded && (
          <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
            <div
              className="prose prose-sm prose-slate max-w-none
                prose-headings:text-navy-800 prose-headings:font-bold
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-ul:text-slate-600 prose-li:leading-relaxed
                prose-strong:text-navy-700 prose-strong:font-semibold
                prose-a:text-aqua-600 prose-a:cursor-pointer prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
