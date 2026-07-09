import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingCart, User, LogOut, Menu, X, LayoutGrid, Store, LayoutDashboard, ShieldCheck, Package } from 'lucide-react'
import { CATEGORIES, PRODUCT_INDEX } from '../data'

const ALL = Object.values(PRODUCT_INDEX)

/**
 * Navbar — sticky primary header.
 * Logo, search bar (with live product/category suggestions), wishlist + cart
 * counters, and buyer auth. All counts + handlers are lifted into App.
 */
export default function Navbar({
  wishlistCount = 0,
  cartCount = 0,
  user = null,
  searchQuery = '',
  onSearchChange,
  onPickProduct,
  onPickCategory,
  onLogin,
  onLogout,
  onOpenCart,
  onOpenWishlist,
  onOpenDashboard,
  onOpenProfile,
  onOpenOrders,
}) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const listRef = useRef(null)
  const submitSearch = (e) => e.preventDefault()

  const q = searchQuery.trim().toLowerCase()
  // Live suggestions: matching categories + top product matches.
  const suggestions = useMemo(() => {
    if (q.length < 2) return { cats: [], products: [] }
    const cats = CATEGORIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3)
    const products = ALL.filter((p) => `${p.name} ${p.seller}`.toLowerCase().includes(q)).slice(0, 5)
    return { cats, products }
  }, [q])

  // Flat list for keyboard navigation
  const flatItems = useMemo(() => {
    const items = []
    suggestions.cats.forEach((c) => items.push({ type: 'cat', id: c.id, name: c.name }))
    suggestions.products.forEach((p) => items.push({ type: 'product', key: p.key, product: p }))
    return items
  }, [suggestions])

  const showSuggest = focused && q.length >= 2 && flatItems.length > 0

  // Reset active index when suggestions change
  useEffect(() => { setActiveIdx(-1) }, [q])

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx]
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  const pickItem = useCallback((item) => {
    if (item.type === 'cat') onPickCategory?.(item.id)
    else onPickProduct?.(item.product)
    setFocused(false)
    setActiveIdx(-1)
  }, [onPickCategory, onPickProduct])

  const handleKeyDown = useCallback((e) => {
    if (!showSuggest) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % flatItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i <= 0 ? flatItems.length - 1 : i - 1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      pickItem(flatItems[activeIdx])
    } else if (e.key === 'Escape') {
      setFocused(false)
      setActiveIdx(-1)
    }
  }, [showSuggest, flatItems, activeIdx, pickItem])

  // Shared dropdown so both desktop & mobile search can reuse it.
  const SuggestList = () => (
    <div ref={listRef} className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lift">
      {suggestions.cats.map((c, i) => (
        <button
          key={c.id}
          onMouseDown={(e) => { e.preventDefault(); pickItem(flatItems[i]) }}
          onMouseEnter={() => setActiveIdx(i)}
          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
            activeIdx === i ? 'bg-aqua-50 text-aqua-700' : 'hover:bg-aqua-50'
          }`}
        >
          <LayoutGrid className="h-4 w-4 text-aqua-600" />
          <span className="font-medium text-navy-800">{c.name}</span>
          <span className="ml-auto text-xs text-slate-400">Category</span>
        </button>
      ))}
      {suggestions.products.map((p, pi) => {
        const idx = suggestions.cats.length + pi
        return (
          <button
            key={p.key}
            onMouseDown={(e) => { e.preventDefault(); pickItem(flatItems[idx]) }}
            onMouseEnter={() => setActiveIdx(idx)}
            className={`flex w-full items-center gap-3 border-t border-slate-50 px-4 py-2.5 text-left transition-colors ${
              activeIdx === idx ? 'bg-aqua-50' : 'hover:bg-aqua-50'
            }`}
          >
            <img src={p.image} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-navy-800">{p.name}</span>
              <span className="block truncate text-xs text-slate-400"><Store className="mr-1 inline h-3 w-3" />{p.seller}</span>
            </span>
          </button>
        )
      })}
      <div className="flex items-center justify-center gap-3 border-t border-slate-100 bg-slate-50 px-4 py-1.5 text-[10px] text-slate-400">
        <span>&#8593;&#8595; navigate</span>
        <span>&#9166; select</span>
        <span>esc close</span>
      </div>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2">
        {/* Logo — real Romegamart brand mark */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Romegamart home"
        >
          <img
            src="/romegamart-logo.webp"
            alt="Romegamart"
            className="h-10 w-10 rounded-full shadow-soft"
          />
          <span className="hidden font-display text-xl font-bold tracking-tight text-navy-800 sm:inline">
            ROME<span className="text-aqua-600">GAMART</span>
          </span>
        </button>

        {/* Search bar */}
        <form onSubmit={submitSearch} className="relative ml-2 hidden flex-1 md:block">
          <label htmlFor="site-search" className="sr-only">
            Search products, brands and categories
          </label>
          <input
            id="site-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder="Search membranes, pumps, RO plants, brands…"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-10 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-aqua-400 focus:bg-white search-cancel-hidden"
          />
          <button type="submit" aria-label="Search" className="absolute left-1 top-1/2 grid h-8 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition-colors hover:text-aqua-600">
            <Search className="h-4 w-4" />
          </button>
          {searchQuery && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onSearchChange('') }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-navy-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {showSuggest && <SuggestList />}
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <IconButton label="Wishlist" count={wishlistCount} onClick={onOpenWishlist}>
            <Heart className="h-5 w-5" />
          </IconButton>

          {user && user.role === 'buyer' && (
            <IconButton label="My Orders" onClick={onOpenOrders}>
              <Package className="h-5 w-5" />
            </IconButton>
          )}

          {/* Cart with item count */}
          <button
            onClick={onOpenCart}
            className="group flex items-center gap-2 rounded-full px-3 py-2 text-left transition-colors hover:bg-aqua-50"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <span className="relative">
              <ShoppingCart className="h-5 w-5 text-navy-700" />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </span>
            <span className="hidden leading-tight lg:block">
              <span className="block text-[11px] text-slate-400">Cart</span>
              <span className="block text-xs font-semibold text-navy-800">{cartCount} items</span>
            </span>
          </button>

          {/* Auth — toggles between Login/Register and Logout. Name/badge
              opens the Profile (KYC); sellers also get a Dashboard shortcut. */}
          {user ? (
            <div className="ml-1 hidden items-center gap-2 sm:flex">
              <button
                onClick={onOpenProfile}
                className="hidden items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-navy-800 transition-colors hover:bg-aqua-50 lg:inline-flex"
              >
                Hi, {user.name}
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  user.role === 'seller' ? 'bg-navy-800 text-white' : 'bg-aqua-50 text-aqua-700'
                }`}>
                  {user.role}
                </span>
                {user.kyc?.status === 'verified' && (
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-500" aria-label="KYC verified" />
                )}
              </button>
              {user.role === 'seller' && (
                <button
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy-800 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-navy-700"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </button>
              )}
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-navy-700 transition-colors hover:border-accent-400 hover:text-accent-600"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="ml-1 hidden items-center gap-1.5 rounded-full bg-navy-800 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-navy-700 sm:inline-flex"
            >
              <User className="h-4 w-4" />
              Login / Register
            </button>
          )}

          {/* Mobile login — visible in the top bar so it isn't hidden behind
              the hamburger menu. Both buyers & sellers log in here. */}
          {!user && (
            <button
              onClick={onLogin}
              className="inline-flex items-center gap-1 rounded-full bg-navy-800 px-3 py-1.5 text-xs font-bold text-white shadow-soft transition-colors hover:bg-navy-700 sm:hidden"
            >
              <User className="h-3.5 w-3.5" /> Login
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="ml-1 grid h-10 w-10 place-items-center rounded-full text-navy-800 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search + auth */}
      {mobileOpen && (
        <div className="space-y-3 border-t border-slate-100 px-4 py-4 md:hidden">
          <form
            onSubmit={(e) => { submitSearch(e); setMobileOpen(false) }}
            className="relative"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder="Search products & brands…"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-10 text-sm focus:border-aqua-400 focus:bg-white search-cancel-hidden"
            />
            <button type="submit" aria-label="Search" className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-4 w-4" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-navy-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
          {user ? (
            <div className="space-y-2">
              <button
                onClick={() => { onOpenProfile(); setMobileOpen(false) }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy-700"
              >
                <User className="h-4 w-4" /> My Profile {user.kyc?.status === 'verified' && <ShieldCheck className="h-4 w-4 text-accent-500" />}
              </button>
              {user.role === 'buyer' && (
                <button
                  onClick={() => { onOpenOrders(); setMobileOpen(false) }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy-700"
                >
                  <Package className="h-4 w-4" /> My Orders
                </button>
              )}
              {user.role === 'seller' && (
                <button
                  onClick={() => { onOpenDashboard(); setMobileOpen(false) }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <LayoutDashboard className="h-4 w-4" /> Seller Dashboard
                </button>
              )}
              <button
                onClick={() => { onLogout(); setMobileOpen(false) }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy-700"
              >
                <LogOut className="h-4 w-4" /> Logout ({user.name} · {user.role})
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onLogin(); setMobileOpen(false) }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <User className="h-4 w-4" /> Login / Register
            </button>
          )}
        </div>
      )}
    </header>
  )
}

/* Small round icon button with an optional count badge. */
function IconButton({ children, label, count = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative grid h-10 w-10 place-items-center rounded-full text-navy-700 transition-colors hover:bg-aqua-50"
      aria-label={count > 0 ? `${label}, ${count} items` : label}
    >
      {children}
      {count > 0 && <Badge>{count}</Badge>}
    </button>
  )
}

function Badge({ children }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
      {children}
    </span>
  )
}
