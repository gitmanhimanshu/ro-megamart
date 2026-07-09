import SmartImage from './SmartImage'

export default function ProductTile({ product, onView }) {
  const { name, image, categoryImage, category } = product
  return (
    <button
      onClick={() => onView(product)}
      className="group flex h-40 w-40 shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 text-center shadow-soft transition-transform hover:-translate-y-1 sm:h-44 sm:w-44"
      aria-label={`View ${name}`}
    >
      <span className="relative block h-full w-full overflow-hidden rounded-lg bg-slate-50">
        <SmartImage
          src={image || categoryImage}
          alt={name}
          className="h-full w-full"
          imgClassName="h-full w-full object-contain p-2"
        />
      </span>
    </button>
  )
}
