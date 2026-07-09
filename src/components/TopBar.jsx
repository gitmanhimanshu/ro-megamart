import { Store, LogIn, PhoneCall, Smartphone } from 'lucide-react'

/**
 * TopBar — slim utility bar above the navbar.
 * Seller links on the left, helpline + app download on the right.
 */
export default function TopBar({ onSeller }) {
  return (
    <div className="hidden bg-navy-900 text-aqua-100/90 md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
        <div className="flex items-center gap-5">
          <button onClick={onSeller} className="group inline-flex items-center gap-1.5 transition-colors hover:text-white">
            <Store className="h-3.5 w-3.5 text-accent-400" />
            <span>Become a Seller</span>
          </button>
          <span className="h-3 w-px bg-white/15" />
          <button onClick={onSeller} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            <LogIn className="h-3.5 w-3.5" />
            <span>Seller Login</span>
          </button>
        </div>

        <div className="flex items-center gap-5">
          <a href="tel:18008898529" className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-white">
            <PhoneCall className="h-3.5 w-3.5 text-accent-400" />
            <span>Helpline 1800-889-8529</span>
          </a>
          <span className="h-3 w-px bg-white/15" />
          <a
            href="https://play.google.com/store/apps/details?id=com.ro_mart.ro_mart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Download App</span>
          </a>
        </div>
      </div>
    </div>
  )
}
