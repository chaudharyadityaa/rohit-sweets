import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProductCard from '../components/product/ProductCard'
import QuantitySelector from '../components/product/QuantitySelector'
import Container from '../components/ui/Container'
import ImagePlaceholder from '../components/ui/ImagePlaceholder'
import { Button, ButtonLink } from '../components/ui/Button'
import { BUSINESS, QUANTITY_RULES } from '../config/business'
import { products } from '../data/products'
import type { Product } from '../types/product'
import { addButtonLabel, formatPrice, isOrderable, priceLabel } from '../utils/product'

export default function ProductPage() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  useEffect(() => {
    document.title = product
      ? `${product.name} | ${BUSINESS.name}, Baraut`
      : `Sweet not found | ${BUSINESS.name}`
  }, [product])

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold text-maroon-800">Sweet not found</h1>
        <p className="mt-3 text-maroon-900/70">
          We couldn’t find that sweet. It may have been removed.
        </p>
        <ButtonLink to="/sweets" variant="outline" className="mt-6">
          Browse all sweets
        </ButtonLink>
      </Container>
    )
  }

  // `key` resets the selected quantity when moving between products.
  return <ProductDetails key={product.id} product={product} />
}

function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState<number>(QUANTITY_RULES.min)
  const orderable = isOrderable(product)

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <Container className="py-6 md:py-10">
      <Link
        to="/sweets"
        className="inline-flex items-center gap-1 text-sm font-medium text-maroon-800 hover:underline"
      >
        <ArrowLeft size={16} aria-hidden /> All sweets
      </Link>

      <div className="mt-5 grid gap-8 md:grid-cols-2 md:gap-12">
        <ImagePlaceholder
          src={product.image}
          alt={product.name}
          label="Photo coming soon"
          className="aspect-square w-full rounded-2xl"
        />

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-600">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-maroon-800 md:text-4xl">
            {product.name}
          </h1>
          <p
            className={`mt-3 text-2xl font-semibold ${
              product.price === null ? 'text-maroon-900/50' : 'text-maroon-800'
            }`}
          >
            {priceLabel(product)}
          </p>

          {product.description && (
            <p className="mt-4 text-maroon-900/80">{product.description}</p>
          )}

          {orderable ? (
            <div className="mt-6 space-y-5">
              <QuantitySelector value={quantity} onChange={setQuantity} unit={product.unit} />
              <p className="text-sm text-maroon-900/70">
                Total for this sweet:{' '}
                <span className="text-lg font-bold text-maroon-800">
                  {formatPrice(product.price! * quantity)}
                </span>
              </p>
              {/* Wired to the real cart in Checkpoint 6 */}
              <Button className="w-full sm:w-auto">{addButtonLabel(product)}</Button>
            </div>
          ) : (
            <div className="mt-6">
              <Button disabled className="w-full sm:w-auto">
                {addButtonLabel(product)}
              </Button>
              {product.available && (
                <p className="mt-3 text-sm text-maroon-900/70">
                  This sweet can’t be ordered online yet. Please call{' '}
                  <a href={`tel:+91${BUSINESS.phone}`} className="font-semibold underline">
                    {BUSINESS.phone}
                  </a>{' '}
                  to ask about it.
                </p>
              )}
            </div>
          )}

          <p className="mt-6 text-xs text-maroon-900/60">
            Cash on Delivery · Local delivery within {BUSINESS.delivery.radiusKm} km
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-14">
          <h2 id="related-heading" className="text-lg font-bold text-maroon-800">
            You may also like
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}