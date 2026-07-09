import {
  ShieldCheck, IndianRupee, Truck, Lock, Tag, LineChart,
  Target, Eye, CheckCircle2,
} from 'lucide-react'
import { ABOUT, WHY_CHOOSE, WHO_WE_SERVE } from '../data'
import { useScrollReveal } from '../hooks/useScrollReveal'

// Icon per "why choose us" point, in data order.
const WHY_ICONS = [ShieldCheck, IndianRupee, Truck, Lock, Tag, LineChart]

/**
 * About — real Romegamart "About / Why Choose Us / Who We Serve" content,
 * sourced from romegamart.com/about-us.
 */
export default function About() {
  const ref = useScrollReveal()

  return (
    <section ref={ref} id="about" className="reveal scroll-mt-28 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Intro */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-aqua-600">About Romegamart</p>
          <h2 className="mt-2 text-2xl font-bold text-navy-800 sm:text-3xl">
            A complete B2B ecosystem for the RO &amp; water-treatment industry
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{ABOUT.intro}</p>
        </div>

        {/* Mission + Vision */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <InfoCard Icon={Target} title="Our Mission" body={ABOUT.mission} />
          <InfoCard Icon={Eye} title="Our Vision" body={ABOUT.vision} />
        </div>

        {/* Why businesses choose us */}
        <h3 className="mt-14 text-center text-xl font-bold text-navy-800 sm:text-2xl">
          Why businesses choose us
        </h3>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((item, i) => {
            const Icon = WHY_ICONS[i] ?? ShieldCheck
            return (
              <div
                key={item.title}
                className="group flex gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-aqua-200 hover:bg-white hover:shadow-lift"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-600 transition-colors group-hover:bg-navy-800 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-navy-800">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Who we serve */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-aqua-700 px-6 py-7 sm:px-10">
          <h3 className="text-center text-lg font-bold text-white sm:text-xl">Who we serve</h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-center">
            {WHO_WE_SERVE.map((who) => (
              <span
                key={who}
                className="inline-flex w-full items-center justify-start gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/25 sm:rounded-full lg:w-auto lg:justify-center lg:py-2"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-400" />
                <span>{who}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** InfoCard — mission / vision card. */
function InfoCard({ Icon, title, body }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-aqua-400 to-navy-800 text-white shadow-soft">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-navy-800">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  )
}
