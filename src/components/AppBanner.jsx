import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { PLAY_STORE_URL, APP_STORE_URL } from '../utils/storeLinks'
import { isDismissed, dismissFor } from '../utils/dismissible'

const DISMISS_KEY = 'rm_app_banner_dismissed'

/**
 * AppBanner — persistent "Get the App" strip pinned above the navbar on
 * every screen size. The promo popup (AdPopup) only appears once per load
 * and auto-closes, so it was the only place shoppers ever learned a mobile
 * app exists. This stays put (until dismissed) with both store badges side
 * by side. Dismissing it hides it for 24 hours, then it comes back.
 */
export default function AppBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isDismissed(DISMISS_KEY)) setOpen(true)
  }, [])

  if (!open) return null

  const dismiss = () => {
    dismissFor(DISMISS_KEY)
    setOpen(false)
  }

  return (
    <div className="bg-navy-900 px-2.5 py-2 text-white sm:px-3">
      <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-3">
        <img src="/romegamart-logo.webp" alt="" className="h-8 w-8 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold sm:text-sm">Romegamart App is here</p>
          <p className="hidden truncate text-[11px] text-aqua-100/70 sm:block">Wholesale RO deals, faster on the app</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
            <img src="/play_store-img.webp" alt="Get it on Google Play" className="h-7 w-auto rounded-md transition-transform hover:-translate-y-0.5 sm:h-8" />
          </a>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
            <img src="/app_store-img.webp" alt="Download on the App Store" className="h-7 w-auto rounded-md transition-transform hover:-translate-y-0.5 sm:h-8" />
          </a>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss app banner"
          className="shrink-0 rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
