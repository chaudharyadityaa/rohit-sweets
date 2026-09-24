import type { Product } from '../../types/product'
import { addButtonLabel, isOrderable, priceLabel } from '../../utils/product'
import ImagePlaceholder from '../ui/ImagePlaceholder'
import { Button } from '../ui/Button'

type ProductCardProps = {
  product: Product
  onAddToCart?: (product: Product) => void
  className?: string
}

export default function ProductCard({
  product,
  onAddToCart,
  className = '',
}: ProductCardProps) {
  const orderable = isOrderable(product)

  return (
    <article
      className={`flex flex-col rounded-2xl border border-cream-200 bg-white p-3 shadow-sm ${className}`}
    >
      <ImagePlaceholder
        src={product.image}
        alt={product.name}
        label=""
        className="aspect-square w-full rounded-xl"
      />
      <h3 className="mt-3 text-sm font-semibold">{product.name}</h3>
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
        onClick={() => onAddToCart?.(product)}
        className="mt-3 w-full text-[11px]"
      >
        {addButtonLabel(product)}
      </Button>
    </article>
  )
}