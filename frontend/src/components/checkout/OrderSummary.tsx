import { Link } from 'react-router-dom'
import type { CartLine } from '../../utils/cart'
import { formatPrice } from '../../utils/product'
import { formatQuantity } from '../../utils/quantity'

type OrderSummaryProps = {
  lines: CartLine[]
  subtotal: number
  deliveryCharge: number | null // null = distance not chosen yet
}

export default function OrderSummary({ lines, subtotal, deliveryCharge }: OrderSummaryProps) {
  const total = subtotal + (deliveryCharge ?? 0)

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 id="summary-heading" className="text-lg font-bold text-maroon-800">
          Order summary
        </h2>
        <Link to="/cart" className="text-xs font-medium text-maroon-800 underline">
          Edit cart
        </Link>
      </div>

      <ul className="mt-4 space-y-2 border-b border-cream-200 pb-4 text-sm">
        {lines.map(({ product, quantity, lineTotal }) => (
          <li key={product.id} className="flex justify-between gap-3">
            <span>
              {product.name}
              <span className="block text-xs text-maroon-900/60">
                {formatQuantity(quantity, product.unit)} × {formatPrice(product.price ?? 0)}
              </span>
            </span>
            <span className="font-medium">{formatPrice(lineTotal)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-semibold">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd className={deliveryCharge === null ? 'text-maroon-900/60' : 'font-semibold'}>
            {deliveryCharge === null ? 'Choose distance' : formatPrice(deliveryCharge)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-cream-200 pt-3 text-base">
          <dt className="font-bold">{deliveryCharge === null ? 'Total so far' : 'Total'}</dt>
          <dd className="font-bold text-maroon-800">{formatPrice(total)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-maroon-900/60">Payment: Cash on Delivery</p>
    </>
  )
}