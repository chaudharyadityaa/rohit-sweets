import { GHEWAR_ID, products } from '../../data/products'
import { useAddToCart } from '../../hooks/useAddToCart'
import type { Product } from '../../types/product'
import { addButtonLabel, isOrderable, priceLabel } from '../../utils/product'
import ImagePlaceholder from '../ui/ImagePlaceholder'
import { Button } from '../ui/Button'

export default function FeaturedGhewar() {
  const ghewar = products.find((p) => p.id === GHEWAR_ID)
  if (!ghewar) return null
  return <GhewarBlock ghewar={ghewar} />
}

function GhewarBlock({ ghewar }: { ghewar: Product }) {
  const { add, added } = useAddToCart(ghewar)

  return (
    <section
      aria-labelledby="ghewar-heading"
      className="overflow-hidden rounded-2xl border border-cream-200 bg-cream-100"
    >
      <div className="flex flex-col-reverse sm:flex-row sm:items-center">
        <div className="p-5 sm:w-1/2 md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-600">
            Our speciality
          </p>
          <h2
            id="ghewar-heading"
            className="mt-1 text-2xl font-bold uppercase text-maroon-800"
          >
            Famous Ghewar
          </h2>
          <p className="mt-2 text-sm text-maroon-900/80">
            Traditional • Freshly prepared
          </p>
          <p className="mt-4 text-3xl font-bold text-maroon-800">
            {priceLabel(ghewar)}
          </p>
          <Button
            disabled={!isOrderable(ghewar)}
            onClick={() => add()}
            aria-live="polite"
            className="mt-4"
          >
            {added ? 'ADDED ✓' : addButtonLabel(ghewar)}
          </Button>
        </div>
        <ImagePlaceholder
          src={ghewar.image}
          alt="Ghewar"
          label="Ghewar photo coming soon"
          className="h-48 w-full sm:h-64 sm:w-1/2"
        />
      </div>
    </section>
  )
}