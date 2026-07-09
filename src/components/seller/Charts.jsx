import { useMemo, useState } from 'react'

// ── Color palette — derived from the brand (royal blue / sky blue / lime),
//    so multi-series charts stay cohesive with the rest of the storefront
//    instead of a generic rainbow. Amber/red are kept for warning/danger.
const COLORS = [
  '#14a4e0', // aqua-500
  '#031273', // navy-800
  '#8cc63f', // accent-500
  '#f59e0b', // amber-500 (warning)
  '#38baec', // aqua-400
  '#6fa82c', // accent-600
  '#1c2bb0', // navy-600
  '#ef4444', // red-500 (danger)
]

// Format numbers: 10000 → 10K, 1000000 → 10L, 10000000 → 10M
function compactNumber(n) {
  if (typeof n === 'string') {
    const num = parseInt(n.replace(/[₹,%]/g, ''), 10)
    if (isNaN(num)) return n
    n = num
  }
  if (n >= 10000000) return `${(n / 10000000).toFixed(n >= 100000000 ? 0 : 1).replace(/\.0$/, '')}M`
  if (n >= 100000) return `${(n / 100000).toFixed(n >= 1000000 ? 0 : 1).replace(/\.0$/, '')}L`
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`
  return String(n)
}

function getFullValue(value) {
  if (typeof value === 'number') return value.toLocaleString('en-IN')
  return String(value)
}

// ── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, trend, trendLabel, color = 'aqua', sparkData }) {
  const colorMap = {
    aqua: { bg: 'bg-aqua-500', light: 'bg-aqua-50 text-aqua-600' },
    navy: { bg: 'bg-navy-800', light: 'bg-navy-50 text-navy-700' },
    accent: { bg: 'bg-accent-500', light: 'bg-accent-50 text-accent-600' },
    green: { bg: 'bg-accent-500', light: 'bg-accent-50 text-accent-600' },
    red: { bg: 'bg-red-500', light: 'bg-red-50 text-red-500' },
    amber: { bg: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
    purple: { bg: 'bg-navy-700', light: 'bg-navy-50 text-navy-600' },
  }
  const c = colorMap[color] || colorMap.aqua
  const raw = typeof value === 'string' ? value.replace(/[₹,%]/g, '').trim() : value
  const numVal = parseInt(raw, 10)
  const isNumeric = !isNaN(numVal)
  const prefix = typeof value === 'string' && value.startsWith('₹') ? '₹' : ''
  const suffix = typeof value === 'string' && value.endsWith('%') ? '%' : ''
  const displayVal = isNumeric ? `${prefix}${compactNumber(numVal)}${suffix}` : value
  const fullVal = isNumeric ? `${prefix}${numVal.toLocaleString('en-IN')}${suffix}` : value

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl" title={fullVal}>{displayVal}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            {trend !== undefined && (
              <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${trend >= 0 ? 'text-accent-600' : 'text-red-500'}`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
            <span className="text-[11px] text-slate-400">{sub || trendLabel}</span>
          </div>
        </div>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${c.bg} text-white/90 transition-transform group-hover:scale-105 sm:h-9 sm:w-9`}>
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.5} />
        </span>
      </div>
      {sparkData && sparkData.length > 0 && (
        <div className="mt-3 -mb-1">
          <CardSparkline data={sparkData} color={c.bg.replace('bg-', '')} />
        </div>
      )}
    </div>
  )
}

// ── MiniSparkline (tiny line for stat cards) ────────────────────────────────
function CardSparkline({ data, color = '#14a4e0', height = 32 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 200
  const h = height
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 4) - 2,
  }))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`

  const colorValues = {
    'aqua-500': '#14a4e0', 'navy-800': '#031273', 'navy-700': '#0a1789', 'accent-500': '#8cc63f',
    'red-500': '#ef4444', 'amber-500': '#f59e0b',
  }
  const stroke = colorValues[color] || color

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#spark-${color})`} />
      <path d={pathD} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── BarChart (vertical) with Y-axis gridlines ──────────────────────────────────
export function BarChart({ data, height = 200, showValues = true, title, className = '' }) {
  const max = Math.max(...data.map((d) => d.value))
  const niceMax = Math.ceil(max / 4) * 4 || 4
  const gridLines = 4
  const barAreaHeight = height - 32
  const gridLabels = Array.from({ length: gridLines + 1 }, (_, i) => Math.round((niceMax / gridLines) * i))

  return (
    <div className={`min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5 ${className}`}>
      {title && <h3 className="mb-3 text-sm font-bold text-navy-800 sm:mb-4">{title}</h3>}
      <div className="flex" style={{ height: barAreaHeight }}>
        {/* Y-axis labels — hidden on mobile, compact on desktop */}
        <div className="hidden shrink-0 flex-col justify-between pr-1.5 text-right sm:flex" style={{ width: 28 }}>
          {gridLabels.reverse().map((v, i) => (
            <span key={i} className="text-[8px] leading-none text-slate-400">{v >= 1000 ? `${v / 1000}k` : v}</span>
          ))}
        </div>
        {/* Chart area with gridlines */}
        <div className="relative min-w-0 flex-1 border-l border-slate-200">
          {/* Horizontal gridlines */}
          {gridLabels.map((v, i) => (
            <div
              key={i}
              className="absolute left-0 w-full border-t border-dashed border-slate-100"
              style={{ top: `${(v / niceMax) * 100}%` }}
            />
          ))}
          {/* Bars */}
          <div className="flex h-full items-end justify-between gap-1 sm:gap-1.5">
            {data.map((d, i) => {
              const barH = niceMax ? Math.max((d.value / niceMax) * barAreaHeight, 4) : 0
              return (
                <div key={i} className="flex flex-1 flex-col items-center justify-end gap-0.5">
                  {showValues && (
                    <span className="text-[9px] font-bold leading-none text-navy-700 sm:text-[10px]">
                      {d.value >= 1000 ? `${(d.value / 1000).toFixed(d.value >= 10000 ? 0 : 1)}k` : d.value}
                    </span>
                  )}
                  <div
                    className="w-full rounded-t-sm transition-all duration-500 sm:rounded-t-md"
                    style={{
                      height: barH,
                      background: d.color || `linear-gradient(to top, #14a4e0, #6bcef3)`,
                    }}
                    title={`${d.label}: ${d.value}`}
                  />
                  <span className="w-full truncate text-center text-[8px] leading-tight text-slate-400 sm:text-[10px]">{d.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── HorizontalBarChart ──────────────────────────────────────────────────────
export function HorizontalBarChart({ data, title, className = '', showPercent = false }) {
  // data: [{ label, value, color? }]
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className={`min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5 ${className}`}>
      {title && <h3 className="mb-3 text-sm font-bold text-navy-800 sm:mb-4">{title}</h3>}
      <div className="space-y-2.5 sm:space-y-3">
        {data.map((d, i) => {
          const pct = max ? (d.value / max) * 100 : 0
          return (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between">
                <span className="truncate text-[11px] font-medium text-slate-600 sm:text-xs">{d.label}</span>
                <span className="ml-2 shrink-0 text-[11px] font-bold text-navy-800 sm:text-xs">{d.value}{showPercent ? '%' : ''}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 sm:h-2.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: d.color || COLORS[i % COLORS.length],
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── DonutChart (CSS conic-gradient) ─────────────────────────────────────────
export function DonutChart({ data, size = 160, title, className = '', centerLabel, centerValue }) {
  // data: [{ label, value, color? }]
  const total = data.reduce((s, d) => s + d.value, 0)
  const conic = useMemo(() => {
    let acc = 0
    const stops = data.map((d, i) => {
      const start = (acc / total) * 360
      acc += d.value
      const end = (acc / total) * 360
      const color = d.color || COLORS[i % COLORS.length]
      return `${color} ${start}deg ${end}deg`
    })
    return `conic-gradient(${stops.join(', ')})`
  }, [data, total])

  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5 ${className}`}>
      {title && <h3 className="mb-3 text-sm font-bold text-navy-800 sm:mb-4">{title}</h3>}
      <div className="flex flex-col items-center gap-4">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <div
            className="h-full w-full rounded-full"
            style={{ background: conic }}
          />
          <div
            className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center rounded-full bg-white"
            style={{ width: size * 0.55, height: size * 0.55, transform: 'translate(-50%, -50%)' }}
          >
            {centerValue !== undefined && (
              <span className="text-base font-extrabold text-navy-900 sm:text-lg">{centerValue}</span>
            )}
            {centerLabel && (
              <span className="text-[9px] font-medium text-slate-400 sm:text-[10px]">{centerLabel}</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {data.map((d, i) => {
            const pct = total ? Math.round((d.value / total) * 100) : 0
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color || COLORS[i % COLORS.length] }} />
                <span className="whitespace-nowrap text-[11px] text-slate-600 sm:text-xs">{d.label}</span>
                <span className="text-[11px] font-bold text-navy-800 sm:text-xs">{d.value}</span>
                <span className="text-[10px] text-slate-400">({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── LineChart (SVG) with hover tooltips ──────────────────────────────────────
// Axis labels are rendered as an HTML overlay (not inside the <svg>) so their
// font-size is real CSS pixels — on a narrow phone the SVG itself scales down
// with the viewBox (text inside it would shrink to ~5px and become illegible),
// but an HTML <span> positioned by percentage stays a crisp, fixed size.
export function LineChart({ data, height = 200, title, className = '', color = '#14a4e0', showArea = true, showDots = true }) {
  const [hoverIdx, setHoverIdx] = useState(null)
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))
  const range = max - min || 1
  const padding = { top: 20, right: 10, bottom: 8, left: 10 }
  const w = 500
  const h = height

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * (w - padding.left - padding.right),
    y: padding.top + (1 - (d.value - min) / range) * (h - padding.top - padding.bottom),
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - padding.bottom} L ${points[0].x} ${h - padding.bottom} Z`

  const hoverPoint = hoverIdx !== null ? points[hoverIdx] : null
  const hoverData = hoverIdx !== null ? data[hoverIdx] : null

  return (
    <div className={`min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5 ${className}`}>
      {title && <h3 className="mb-3 text-sm font-bold text-navy-800 sm:mb-4">{title}</h3>}
      <div className="relative" style={{ paddingBottom: 18 }}>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + pct * (h - padding.top - padding.bottom)
            return <line key={pct} x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          })}
          {/* Area fill */}
          {showArea && <path d={areaD} fill={color} opacity="0.1" />}
          {/* Line */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {showDots && points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />
          ))}
          {/* Hover tooltip */}
          {hoverPoint && hoverData && (
            <g>
              <line x1={hoverPoint.x} y1={padding.top} x2={hoverPoint.x} y2={h - padding.bottom} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <circle cx={hoverPoint.x} cy={hoverPoint.y} r="6" fill="white" stroke={color} strokeWidth="3" />
              <rect x={Math.min(Math.max(hoverPoint.x - 35, 2), w - 72)} y={Math.max(hoverPoint.y - 32, 2)} width="70" height="24" rx="6" fill="#031273" />
              <text x={Math.min(Math.max(hoverPoint.x, 37), w - 37)} y={Math.max(hoverPoint.y - 16, 18)} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                {hoverData.value >= 1000 ? `₹${(hoverData.value / 1000).toFixed(1)}K` : hoverData.value}
              </text>
            </g>
          )}
          {/* Invisible hover areas */}
          {points.map((p, i) => (
            <rect key={i} x={p.x - 20} y={0} width="40" height={h} fill="transparent" onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)} />
          ))}
        </svg>
        {/* X-axis labels — HTML overlay, real CSS px so they stay readable on mobile
            (text inside the <svg> above would shrink along with the viewBox and
            become illegible on a narrow phone screen). */}
        {points.map((p, i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2 truncate text-center text-[9px] font-medium leading-none text-slate-400 sm:text-[10px]"
            style={{ left: `${(p.x / w) * 100}%`, top: height + 4, maxWidth: `${100 / data.length}%` }}
          >
            {data[i].label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── ProgressRing (circular) ─────────────────────────────────────────────────
export function ProgressRing({ value, max = 100, size = 80, color = '#14a4e0', label }) {
  const pct = max ? (value / max) * 100 : 0
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-xs font-bold text-navy-800">{Math.round(pct)}%</span>
      {label && <span className="text-[10px] text-slate-400">{label}</span>}
    </div>
  )
}

// ── MiniSparkline ───────────────────────────────────────────────────────────
export function MiniSparkline({ data, width = 80, height = 30, color = '#14a4e0' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
