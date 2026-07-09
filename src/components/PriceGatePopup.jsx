import { useState, useEffect } from 'react'
import { X, Lock, Eye, LogIn } from 'lucide-react'

/**
 * PriceGatePopup — shows every 20-30 seconds to remind users
 * they need to login/signup to see prices.
 */
export default function PriceGatePopup({ onLogin }) {
  const [show, setShow] = useState(false)
  const [lastShown, setLastShown] = useState(0)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('rmg_user')
    if (user) return

    const interval = setInterval(() => {
      const now = Date.now()
      // Show only if 20-30 seconds passed since last show
      if (now - lastShown > 20000) {
        setShow(true)
        setLastShown(now)
      }
    }, 25000) // Check every 25 seconds

    // Show first time after 20 seconds
    const firstTimer = setTimeout(() => {
      setShow(true)
      setLastShown(Date.now())
    }, 20000)

    return () => {
      clearInterval(interval)
      clearTimeout(firstTimer)
    }
  }, [lastShown])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-aqua-500 via-navy-600 to-aqua-500" />

        {/* Close button */}
        <button
          onClick={() => setShow(false)}
          className="absolute right-3 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="px-6 pt-6 pb-5 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-aqua-50 to-aqua-100">
            <Lock className="h-7 w-7 text-aqua-600" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-navy-800">
            Login to See Prices
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Wholesale prices, bulk discounts and seller details are available for <strong className="text-navy-700">registered buyers only</strong>.
          </p>

          {/* Features */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-left text-xs text-slate-600">
              <Eye className="h-3.5 w-3.5 shrink-0 text-aqua-500" />
              <span>See wholesale prices on all products</span>
            </div>
            <div className="flex items-center gap-2 text-left text-xs text-slate-600">
              <Lock className="h-3.5 w-3.5 shrink-0 text-aqua-500" />
              <span>Get bulk discount rates</span>
            </div>
            <div className="flex items-center gap-2 text-left text-xs text-slate-600">
              <LogIn className="h-3.5 w-3.5 shrink-0 text-aqua-500" />
              <span>Connect directly with sellers</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setShow(false)
                onLogin?.()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua-500 to-navy-700 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <LogIn className="h-4 w-4" />
              Login / Sign Up
            </button>
            <button
              onClick={() => setShow(false)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
