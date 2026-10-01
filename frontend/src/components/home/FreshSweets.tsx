import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../product/ProductCard'

export default function FreshSweets() {
  const { products, isLoading } = useProducts()
  const items = products.filter((p) => p.featured).slice(0, 5)

  return (
    <section aria-labelledby="fresh-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="fresh-heading"
          className="text-sm font-bold uppercase tracking-wide text-maroon-800"
        >
          Fresh from Rohit Sweets
        </h2>
        <Link
          to="/sweets"
          className="flex items-center gap-1 text-sm font-medium text-maroon-800 hover:underline"
        >
          View All <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-cream-100" aria-hidden />
          ))}
        </div>
      ) : (
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-40 shrink-0 snap-start lg:w-auto"
            />
          ))}
        </div>
      )}
    </section>
  )
}