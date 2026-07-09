import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// Real Romegamart opening promo poster (the "RO KA WHOLESALE BAZAR" app-download ad).
const AD_IMAGE = 'https://images.romegamart.com/media/front_image/RO_KA_WHOLESALE_BAZAR_10.jpg'

/**
 * AdPopup — the promotional popup that greets you on the real Romegamart site.
 * Appears shortly after load; closes on X, backdrop click or Escape.
 * (State is in-memory only, so it re-shows on each fresh load — like the original.)
 */
export default function AdPopup() {
  const [open, setOpen] = useState(false)

  // Show ~700ms after load for a natural entrance.
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 700)
    return () => clearTimeout(t)
  }, [])

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-navy-900/70 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Romegamart promotional offer"
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-lift animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy-800 shadow-soft backdrop-blur transition-all hover:scale-110 hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Poster */}
        <img src={AD_IMAGE} alt="RO Ka Wholesale Bazar — Romegamart" className="w-full" />

        {/* App-download footer (the real popup is an app-download promo) */}
        <div className="flex flex-col items-center gap-3 px-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold text-navy-800">Download the Romegamart App</p>
            <p className="text-xs text-slate-500">Shop 1 Lakh+ RO products at wholesale prices.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.ro_mart.ro_mart"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <img src="/play_store-img.webp" alt="Get it on Google Play" className="h-10 w-auto rounded-md" />
            </a>
            <a
              href="https://apps.apple.com/us/app/romegamart/id6550910373"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <img src="/app_store-img.webp" alt="Download on the App Store" className="h-10 w-auto rounded-md" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
