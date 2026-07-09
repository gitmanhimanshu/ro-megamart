import { Package, Users, MapPin } from 'lucide-react'
import { STATS } from '../data'
import { useCountUp } from '../hooks/useCountUp'

const ICONS = [Package, Users, MapPin]

/**
 * StatsBand — deep-navy band with animated count-up metrics
 * (Vendors / Sellers / Cities).
 */
export default function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16">
      {/* Decorative gradient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-aqua-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <Stat key={stat.label} {...stat} Icon={ICONS[i]} />
        ))}
      </div>
    </section>
  )
}

function Stat({ value, suffix, label, Icon }) {
  const [count, ref] = useCountUp(value)

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-aqua-400/25 to-aqua-600/25 ring-1 ring-white/10">
        <Icon className="h-6 w-6 text-aqua-300" />
      </span>
      <div className="font-display text-4xl font-bold text-white sm:text-5xl">
        {count.toLocaleString('en-IN')}
        <span className="text-accent-400">{suffix}</span>
      </div>
      <div className="mt-1 text-sm font-medium uppercase tracking-wider text-aqua-100/70">{label}</div>
    </div>
  )
}
