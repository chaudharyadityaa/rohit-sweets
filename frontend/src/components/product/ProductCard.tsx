import { Link } from 'react-router-dom'
import { useAddToCart } from '../../hooks/useAddToCart'
import type { Product } from '../../types/product'
import { addButtonLabel, isOrderable, priceLabel } from '../../utils/product'
import ImagePlaceholder from '../ui/ImagePlaceholder'
import { Button } from '../ui/Button'

type ProductCardProps = {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const orderable = isOrderable(product)
  const { add, added } = useAddToCart(product)
  const href = `/product/${product.id}`

  return (
    <article
      className={`flex flex-col rounded-2xl border border-cream-200 bg-white p-3 shadow-sm ${className}`}
    >
      <Link to={href} tabIndex={-1} aria-hidden>
        <ImagePlaceholder
          src={product.image}
          alt=""
          label=""
          className="aspect-square w-full rounded-xl"
        />
      </Link>
      <h3 className="mt-3 text-sm font-semibold">
        <Link to={href} className="hover:text-maroon-700 hover:underline">
          {product.name}
        </Link>
      </h3>
      <p
        className={`mt-1 text-xs ${
          product.price === null ? 'text-maroon-900/50' : 'font-medium text-gold-600'
        }`}
      >
        {priceLabel(product)}
      </p>
      <Button
        variant="outline"
        size="sm"
        disabled={!orderable}
        onClick={() => add()}
        aria-live="polite"
        className="mt-3 w-full text-[11px]"
      >
        {added ? 'ADDED ✓' : addButtonLabel(product)}
      </Button>
    </article>
  )
}