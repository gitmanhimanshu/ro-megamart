import { useState, useEffect } from 'react'
import { Home, Zap, BookOpen, Award, Users, LayoutGrid, Truck, Info, ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'

/**
 * CategoryNav - secondary nav strip below the navbar.
 * Uses a dropdown on mobile and a centered row on desktop.
 */
const LINKS = [
  { label: 'Home', icon: Home, target: 'top' },
  { label: 'Flash Sale', icon: Zap, target: 'promos' },
  { label: 'Blogs', icon: BookOpen, target: 'blogs' },
  { label: 'All Brands', icon: Award, target: 'all-brands' },
  { label: 'All Categories', icon: LayoutGrid, target: 'categories-grid' },
  { label: 'Track Order', icon: Truck, target: 'track' },
]

const ROUTE_MAP = {
  '/': 'top',
  '/blogs': 'blogs',
  '/brands': 'all-brands',
  '/sellers': 'sellers-page',
}

export default function CategoryNav({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const [activeTarget, setActiveTarget] = useState('top')
  const location = useLocation()

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const head = parts[0] || ''
    if (head === 'deals' && parts[1] === 'flash') setActiveTarget('promos')
    else if (head === 'category') setActiveTarget('categories-grid')
    else if (head === 'blogs') setActiveTarget('blogs')
    else if (head === 'brands') setActiveTarget('all-brands')
    else if (head === 'sellers') setActiveTarget('sellers-page')
    else setActiveTarget('top')
  }, [location.pathname])

  const itemCls = (target, mobile = false) => {
    const isActive = target === activeTarget
    return `group inline-flex min-w-0 items-center gap-2 text-sm font-medium transition-all duration-200 ${
      mobile
        ? 'w-full rounded-xl px-3 py-3'
        : 'rounded-full px-4 py-2.5'
    } ${
      isActive
        ? 'bg-gradient-to-r from-accent-500/15 to-aqua-500/10 text-accent-600 font-semibold shadow-sm ring-1 ring-accent-400/20'
        : 'text-navy-700 hover:bg-aqua-50 hover:text-aqua-700'
    }`
  }

  const renderItem = ({ label, icon: Icon, target }, mobile = false) => {
    const isActive = target === activeTarget
    return (
      <button
        key={label}
        onClick={() => {
          setActiveTarget(target)
          onNavigate?.(target)
          setOpen(false)
        }}
        className={itemCls(target, mobile)}
      >
        <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isActive && !mobile ? 'scale-110' : ''}`} />
        <span className="truncate">{label}</span>
      </button>
    )
  }

  return (
    <nav className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 py-1 md:px-4">
        <div className="md:hidden">
          <button
            onClick={() => setOpen((value) => !value)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-navy-800 shadow-soft"
            aria-expanded={open}
            aria-label="Toggle navigation options"
          >
            <span>{LINKS.find((l) => l.target === activeTarget)?.label || 'Menu'}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="mt-2 space-y-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lift">
              {LINKS.map((item) => renderItem(item, true))}
            </div>
          )}
        </div>

        <div className="hidden md:flex md:flex-wrap md:items-center md:justify-center md:gap-2">
          {LINKS.map((item) => renderItem(item))}
        </div>
      </div>
    </nav>
  )
}
