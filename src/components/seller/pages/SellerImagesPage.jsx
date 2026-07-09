import { useMemo } from 'react'
import { UploadCloud, ImageOff, Trash2, Eye } from 'lucide-react'
import { PRODUCT_INDEX } from '../../../data'
import { StatCard } from '../Charts'

const ALL_PRODUCTS = Object.values(PRODUCT_INDEX)

export default function SellerImagesPage({ onToast }) {
  const images = useMemo(() => ALL_PRODUCTS.slice(0, 18), [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Product Images</h1>
          <p className="text-sm text-slate-500">Manage photos used across your listings</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-aqua-500 to-navy-800 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
          <UploadCloud className="h-3.5 w-3.5" strokeWidth={1.5} /> Upload Image
          <input type="file" accept="image/*" multiple className="hidden" onChange={() => onToast?.('Upload — demo only.')} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Images" value={images.length} sub="Product photos" icon={Eye} color="aqua" />
        <StatCard label="With Images" value={images.length - 2} sub="Listings covered" icon={ImageOff} color="green" />
        <StatCard label="Missing" value={2} sub="Need upload" icon={UploadCloud} color="accent" />
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {images.map((p) => (
          <button
            key={p.key}
            onClick={() => onToast?.('Image manager — demo only.')}
            className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="aspect-[4/3] overflow-hidden bg-slate-50">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="relative px-2 py-1.5">
              <p className="truncate text-[10px] font-medium text-slate-600 sm:text-[11px]">{p.name}</p>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500">
                  <Trash2 className="h-2.5 w-2.5" strokeWidth={1.5} />
                </span>
              </div>
            </div>
          </button>
        ))}
        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 py-16 text-slate-400">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-100">
              <ImageOff className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <p className="text-sm font-medium">No images yet</p>
            <p className="text-xs">Upload product photos to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
