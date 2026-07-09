/**
 * PieChart — dependency-free SVG donut chart.
 * Uses the "circumference = 100" trick (r = 100 / 2π) so each slice's
 * stroke-dasharray maps directly to its percentage. Responsive: the chart
 * scales to its container and the legend stacks below on mobile / sits
 * beside it on larger screens.
 *
 * Props:
 *  - data: [{ label, value }]
 *  - colors: optional hex array (cycled)
 *  - centerLabel / centerSub: text shown in the donut hole
 */
const DEFAULT_COLORS = ['#0891b2', '#1e3a8a', '#84cc16', '#f59e0b', '#0ea5e9', '#7c3aed', '#ec4899', '#14b8a6']

export default function PieChart({ data, colors = DEFAULT_COLORS, centerLabel, centerSub }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) return null

  const R = 15.915 // 100 / (2π) → circumference ≈ 100
  const STROKE = 3.4
  // Small gap between adjacent slices for separation — skipped when there's
  // only one slice so it renders as a clean unbroken ring.
  const GAP = data.length > 1 ? 1.6 : 0
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      {/* Donut */}
      <div className="relative h-44 w-44 shrink-0 sm:h-40 sm:w-40">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle cx="18" cy="18" r={R} fill="none" stroke="#eef2f6" strokeWidth={STROKE} />
          {data.map((d, i) => {
            const pct = (d.value / total) * 100
            const dash = Math.max(0.001, pct - GAP)
            const circle = (
              <circle
                key={d.label}
                cx="18"
                cy="18"
                r={R}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${100 - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap={GAP ? 'round' : 'butt'}
              />
            )
            offset += pct
            return circle
          })}
        </svg>
        {(centerLabel != null || centerSub != null) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerLabel != null && <span className="text-3xl font-extrabold leading-none text-navy-900">{centerLabel}</span>}
            {centerSub != null && <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{centerSub}</span>}
          </div>
        )}
      </div>

      {/* Legend */}
      <ul className="grid w-full grid-cols-1 gap-1 min-[420px]:grid-cols-2 sm:grid-cols-1">
        {data.map((d, i) => {
          const pct = Math.round((d.value / total) * 100)
          return (
            <li
              key={d.label}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-slate-50"
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="min-w-0 flex-1 truncate font-medium text-slate-600">{d.label}</span>
              <span className="shrink-0 font-bold text-navy-800">{d.value}</span>
              <span className="w-10 shrink-0 rounded-full bg-slate-100 py-0.5 text-center text-[10px] font-semibold text-slate-500">
                {pct}%
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
