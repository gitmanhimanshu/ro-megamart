import { ArrowRight, Layers3 } from 'lucide-react'
import SmartImage from './SmartImage'
import LoopCarousel from './LoopCarousel'

/**
 * CategoryBanner — small auto-rotating carousel for a category section's
 * banner area. We only have one real banner photo per category, so slide 2
 * is a generated brand promo card (category name/tagline/CTA) — giving every
 * category a genuine multi-slide carousel instead of a single static image.
 */
export default function CategoryBanner({ category, bannerImage, onOpen }) {
  const { name, tagline, products = [], subcategories = [] } = category

  const slides = [
    <div className="relative h-full w-full bg-slate-100">
      <SmartImage src={bannerImage} alt={name} className="h-full w-full" imgClassName="h-full w-full object-cover" />
    </div>,
    <div className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-aqua-700 px-6 sm:px-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-accent-400/20 blur-2xl" />
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-aqua-100 backdrop-blur">
        <Layers3 className="h-3 w-3" /> {subcategories.length || products.length} {subcategories.length ? 'sub-categories' : 'products'}
      </span>
      <h3 className="relative mt-2 max-w-md text-lg font-bold text-white sm:text-2xl">{name}</h3>
      <p className="relative mt-1 line-clamp-2 max-w-sm text-xs text-aqua-100/80 sm:text-sm">{tagline}</p>
      <span className="relative mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-navy-900 transition-transform group-hover:translate-x-1">
        Shop Now <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </div>,
  ]

  return (
    <LoopCarousel
      slides={slides}
      heightClass="h-40 sm:h-44 lg:h-52"
      onSlideClick={onOpen}
      className="border border-slate-200/70"
    />
  )
}
