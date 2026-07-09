import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutGrid, Package, Upload, Store, Star, Images, BarChart3,
  ShoppingCart, Settings, Wallet, LifeBuoy, ChevronDown, Menu, X,
  Search, ShieldCheck, Bell, Home, LogOut, FileText, CreditCard,
} from 'lucide-react'

const NAV = [
  { id: 'dashboard', to: '/seller/dashboard', label: 'Dashboard', icon: LayoutGrid },
  {
    id: 'products', to: '/seller/products', label: 'Products', icon: Package,
    children: [
      { id: 'products', to: '/seller/products', label: 'All Products' },
      { id: 'bulk-upload', to: '/seller/products/bulk-upload', label: 'Bulk Upload' },
      { id: 'wholesale', to: '/seller/products/wholesale', label: 'Wholesale Pricing' },
      { id: 'reviews', to: '/seller/products/reviews', label: 'Reviews' },
      { id: 'images', to: '/seller/products/images', label: 'Images' },
    ],
  },
  {
    id: 'reports', to: '/seller/reports', label: 'Reports', icon: BarChart3,
    children: [
      { id: 'reports', to: '/seller/reports', label: 'Sales Report' },
      { id: 'inventory-report', to: '/seller/reports/inventory', label: 'Inventory' },
      { id: 'orders-report', to: '/seller/reports/orders', label: 'Orders' },
      { id: 'payments-report', to: '/seller/reports/payments', label: 'Payments' },
    ],
  },
  { id: 'orders', to: '/seller/orders', label: 'Orders', icon: FileText },
  { id: 'settings', to: '/seller/settings', label: 'Shop Settings', icon: Settings },
  { id: 'commission', to: '/seller/commission', label: 'Commission', icon: CreditCard },
  { id: 'support', to: '/seller/support', label: 'Support', icon: LifeBuoy },
]

const NOTIFICATIONS = [
  { id: 1, text: 'New order received — #ROM48213', time: '12 min ago', unread: true },
  { id: 2, text: 'Your KYC has been verified', time: '2 hours ago', unread: true },
  { id: 3, text: 'Low stock alert: RO Membrane 80 GPD', time: '1 day ago', unread: true },
]

export default function SellerLayout({ user, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState({})
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  const submitSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate('/seller/products')
    setSearchQuery('')
  }

  const initials = (user?.name || 'S').trim().slice(0, 2).toUpperCase()

  // Auto-close mobile drawer and profile on route change
  useEffect(() => { setMobileOpen(false); setProfileOpen(false) }, [path])

  // Auto-open group if child route is active
  useEffect(() => {
    NAV.forEach((item) => {
      if (item.children && isActiveGroup(item)) {
        setOpenGroups((prev) => prev[item.id] === undefined ? { ...prev, [item.id]: true } : prev)
      }
    })
  }, [path])

  const isActiveGroup = (item) => {
    if (item.children) return item.children.some((c) => path === c.to || path.startsWith(c.to + '/'))
    return path === item.to || path.startsWith(item.to + '/')
  }

  const isGroupOpen = (item) => {
    if (!item.children) return false
    // If explicitly toggled, use that; otherwise auto-open if child route active
    if (openGroups[item.id] !== undefined) return openGroups[item.id]
    return isActiveGroup(item)
  }

  const toggleGroup = (itemId) => {
    setOpenGroups((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <img src="/romegamart-logo.webp" alt="Romegamart" className="h-9 w-9 rounded-full ring-2 ring-white/20" />
        <div>
          <span className="font-display text-base font-bold tracking-tight text-white">
            ROME<span className="text-aqua-400">GAMART</span>
          </span>
          <p className="text-[10px] font-medium text-aqua-200/50">Seller Panel</p>
        </div>
      </div>

      <nav className="mt-4 space-y-1 px-3 pb-6">
        {NAV.map((item) => {
          const Icon = item.icon
          const isGroup = !!item.children
          const active = isActiveGroup(item)
          const open = isGroupOpen(item)
          return (
            <div key={item.id}>
              <NavLink
                to={item.to}
                onClick={(e) => { if (isGroup) { e.preventDefault(); toggleGroup(item.id) } }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-aqua-500/20 to-transparent text-white shadow-lg shadow-aqua-500/10'
                    : 'text-aqua-100/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${
                  active ? 'bg-aqua-500/20 text-aqua-400' : 'bg-white/5 text-aqua-100/40 group-hover:bg-white/10 group-hover:text-white'
                }`}>
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {isGroup && (
                  <ChevronDown className={`h-3 w-3 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                )}
              </NavLink>
              {isGroup && open && (
                <div className="ml-6 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                  {item.children.map((c) => (
                    <NavLink
                      key={c.id}
                      to={c.to}
                      className={({ isActive: match }) => `block w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                        match
                          ? 'bg-aqua-500/15 text-aqua-300'
                          : 'text-aqua-100/50 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 px-3 pb-5 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-aqua-100/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Home className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} /> Back to Store
        </button>
      </div>
    </>
  )

  return (
    <div className="flex bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto bg-gradient-to-b from-navy-900 via-navy-900 to-navy-800 lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-gradient-to-b from-navy-900 to-navy-800 shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="min-w-0 flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg px-3 py-3 sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg text-navy-700 hover:bg-slate-100 lg:hidden">
            <Menu className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <form onSubmit={submitSearch} className="relative hidden flex-1 max-w-sm sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" strokeWidth={1.5} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, orders…"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm transition-colors focus:border-aqua-400 focus:bg-white focus:ring-2 focus:ring-aqua-100"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => { localStorage.removeItem('rmg_user'); window.location.href = '/login' }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-navy-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} /> <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setNotifOpen((p) => !p) }}
                className="relative grid h-9 w-9 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-800"
              >
                <Bell className="h-4 w-4" strokeWidth={1.5} />
                {NOTIFICATIONS.some((n) => n.unread) && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {NOTIFICATIONS.filter((n) => n.unread).length}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-bold text-navy-800">Notifications</p>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {NOTIFICATIONS.map((n) => (
                        <div key={n.id} className="flex items-start gap-2.5 border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50">
                          {n.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-500" />}
                          <div className={n.unread ? '' : 'pl-3.5'}>
                            <p className="text-xs font-medium text-navy-800">{n.text}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative hidden sm:block">
              <button
                onClick={(e) => { e.stopPropagation(); setProfileOpen((p) => !p) }}
                className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100"
              >
                <span className="text-right">
                  <span className="block text-xs font-semibold text-navy-800">{user?.name || 'Seller'}</span>
                  <span className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                    Seller
                    {user?.kyc?.status === 'verified' && <ShieldCheck className="h-3 w-3 text-accent-500" strokeWidth={1.5} />}
                  </span>
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-aqua-400 to-navy-800 text-xs font-bold text-white ring-2 ring-white">
                  {initials}
                </span>
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-bold text-navy-800">{user?.name || 'Seller'}</p>
                      <p className="text-xs text-slate-400">+91 {user?.contact || '—'}</p>
                    </div>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/seller/settings') }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4" strokeWidth={1.5} /> Shop Settings
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/seller/commission') }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <CreditCard className="h-4 w-4" strokeWidth={1.5} /> Commission
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => { setProfileOpen(false); localStorage.removeItem('rmg_user'); window.location.href = '/login' }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
