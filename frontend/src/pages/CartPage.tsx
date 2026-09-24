import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import QuantitySelector from '../components/product/QuantitySelector'
import Container from '../components/ui/Container'
import ImagePlaceholder from '../components/ui/ImagePlaceholder'
import { Button, ButtonLink } from '../components/ui/Button'
import { useCart } from '../hooks/useCart'
import { buildCartLines, cartSubtotal } from '../utils/cart'
import { formatPrice, priceLabel } from '../utils/product'

export default function CartPage() {
  const { items, setQuantity, removeItem, clearCart } = useCart()
  const lines = buildCartLines(items)
  const subtotal = cartSubtotal(lines)
  const hasProblem = lines.some((line) => !line.orderable)

  if (lines.length === 0) {
    return (
      <Container className="py-20 text-center">
        <ShoppingBag size={48} strokeWidth={1.25} className="mx-auto text-gold-600" aria-hidden />
        <h1 className="mt-4 text-3xl font-bold text-maroon-800">Your cart is empty</h1>
        <p className="mt-2 text-maroon-900/70">Add some sweets to get started.</p>
        <ButtonLink to="/sweets" className="mt-6">
          BROWSE SWEETS
        </ButtonLink>
      </Container>
    )
  }

  return (
    <Container className="py-8 md:py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-maroon-800 md:text-4xl">Your Cart</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (window.confirm('Remove all sweets from your cart?')) clearCart()
          }}
        >
          Clear cart
        </Button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:items-start">
        <ul className="space-y-3 lg:col-span-2">
          {lines.map(({ product, quantity, lineTotal, orderable }) => (
            <li
              key={product.id}
              className="rounded-2xl border border-cream-200 bg-white p-3 shadow-sm sm:p-4"
            >
              <div className="flex gap-3 sm:gap-4">
                <ImagePlaceholder
                  src={product.image}
                  alt=""
                  label=""
                  className="h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold">
                        <Link to={`/product/${product.id}`} className="hover:underline">
                          {product.name}
                        </Link>
                      </h2>
                      <p className="mt-0.5 text-xs text-maroon-900/60">{priceLabel(product)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="rounded-full p-2 text-maroon-800/70 transition hover:bg-cream-100 hover:text-maroon-800"
                    >
                      <Trash2 size={18} aria-hidden />
                    </button>
                  </div>

                  {orderable ? (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <QuantitySelector
                        value={quantity}
                        onChange={(q) => setQuantity(product.id, q)}
                        unit={product.unit}
                      />
                      <p className="text-lg font-bold text-maroon-800">{formatPrice(lineTotal)}</p>
                    </div>
                  ) : (
                    <p className="mt-3 rounded-lg bg-cream-100 px-3 py-2 text-sm text-maroon-800">
                      This sweet is no longer available to order. Please remove it to continue.
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside
          aria-labelledby="summary-heading"
          className="rounded-2xl border border-cream-200 bg-cream-100 p-5 lg:sticky lg:top-24"
        >
          <h2 id="summary-heading" className="text-lg font-bold text-maroon-800">
            Order summary
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-maroon-900/70">
              <dt>Delivery charge</dt>
              <dd>Added at checkout</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-maroon-900/60">
            Payment: Cash on Delivery. Your final total is shown before you place the order.
          </p>
          {hasProblem ? (
            <Button disabled className="mt-5 w-full">
              REMOVE UNAVAILABLE SWEETS
            </Button>
          ) : (
            <ButtonLink to="/checkout" className="mt-5 w-full">
              PROCEED TO CHECKOUT
            </ButtonLink>
          )}
          <Link
            to="/sweets"
            className="mt-3 block text-center text-sm font-medium text-maroon-800 hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </Container>
  )
}