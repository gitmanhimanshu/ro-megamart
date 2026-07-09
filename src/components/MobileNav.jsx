import { Home, LayoutGrid, Heart, ShoppingCart } from 'lucide-react'

/**
 * MobileNav — app-style sticky bottom navigation (mobile only).
 * Home / Categories scroll the page; Wishlist & Cart open their modals
 * and surface live counts.
 */
export default function MobileNav({ wishlistCount = 0, cartCount = 0, onOpenCart, onOpenWishlist }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const items = [
    { label: 'Home', icon: Home, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'Categories', icon: LayoutGrid, onClick: () => scrollTo('categories-grid') },
    { label: 'Wishlist', icon: Heart, onClick: onOpenWishlist, count: wishlistCount },
    { label: 'Cart', icon: ShoppingCart, onClick: onOpenCart, count: cartCount },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-lg md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ label, icon: Icon, onClick, count }) => (
          <button
            key={label}
            onClick={onClick}
            className="relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-navy-700 transition-colors hover:text-aqua-700"
          >
            <span className="relative">
              <Icon className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[9px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
