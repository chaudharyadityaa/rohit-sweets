import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Check, Copy, MessageCircle, Phone } from 'lucide-react'
import Container from '../components/ui/Container'
import { Button, ButtonLink } from '../components/ui/Button'
import { BUSINESS } from '../config/business'
import { clearLastOrder, loadLastOrder } from '../services/lastOrder'
import type { PlacedOrder } from '../types/order'
import { buttonClasses } from '../utils/buttonStyles'
import { phoneLink } from '../utils/links'
import { formatPrice } from '../utils/product'
import { formatQuantity } from '../utils/quantity'
import { buildWhatsAppMessage, orderWhatsAppLink } from '../utils/whatsapp'

export default function OrderSuccessPage() {
  const location = useLocation()
  const stateOrder = (location.state as { order?: PlacedOrder } | null)?.order
  const [order] = useState<PlacedOrder | null>(
    () => stateOrder ?? loadLastOrder()
  )
  const [copied, setCopied] = useState(false)

  if (!order) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold text-maroon-800">
          No recent order found
        </h1>

        <p className="mt-2 text-maroon-900/70">
          If you placed an order, please contact us on{' '}
          <a href={phoneLink()} className="font-semibold underline">
            {BUSINESS.phone}
          </a>
          .
        </p>

        <ButtonLink to="/sweets" className="mt-6">
          BROWSE SWEETS
        </ButtonLink>
      </Container>
    )
  }

  const { draft, orderNumber } = order

   const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage(order))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.alert(
        'Could not copy automatically. Please use the WhatsApp button instead.'
      )
    }
  }

  return (
    <Container className="py-10 md:py-14">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-600">
          Order ready
        </p>

        <h1 className="mt-2 text-3xl font-bold text-maroon-800 md:text-4xl">
          Your order {orderNumber} has been prepared
        </h1>

        <div
          role="status"
          className="mt-6 rounded-2xl border border-gold-400 bg-cream-100 p-4 text-sm"
        >
          <p className="font-semibold text-maroon-800">
            One more step: send it on WhatsApp
          </p>

          <p className="mt-1 text-maroon-900/80">
            Please make sure the order message has been sent to{' '}
            {BUSINESS.name} on WhatsApp. The shop does not receive your order
            until you press <strong>Send</strong> in WhatsApp.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={orderWhatsAppLink(order)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('primary', 'md', 'w-full sm:w-auto')}
          >
            <MessageCircle size={18} aria-hidden />
            OPEN WHATSAPP TO SEND
          </a>

          <Button
            variant="outline"
            onClick={copyMessage}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <>
                <Check size={16} aria-hidden />
                COPIED
              </>
            ) : (
              <>
                <Copy size={16} aria-hidden />
                COPY ORDER MESSAGE
              </>
            )}
          </Button>
        </div>

        <section
          aria-labelledby="order-heading"
          className="mt-8 rounded-2xl border border-cream-200 bg-white p-5 shadow-sm"
        >
          <h2
            id="order-heading"
            className="text-lg font-bold text-maroon-800"
          >
            Order {orderNumber}
          </h2>

          <ul className="mt-4 space-y-2 border-b border-cream-200 pb-4 text-sm">
            {draft.items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between gap-3"
              >
                <span>
                  {item.name}

                  <span className="block text-xs text-maroon-900/60">
                    {formatQuantity(item.quantity, item.unit)} ×{' '}
                    {formatPrice(item.unitPrice)}
                  </span>
                </span>

                <span className="font-medium">
                  {formatPrice(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(draft.subtotal)}</dd>
            </div>

            <div className="flex justify-between">
              <dt>Delivery ({draft.deliveryBand})</dt>
              <dd>{formatPrice(draft.deliveryCharge)}</dd>
            </div>

            <div className="flex justify-between border-t border-cream-200 pt-3 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold text-maroon-800">
                {formatPrice(draft.total)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 space-y-1 text-sm text-maroon-900/80">
            <p>
              <span className="font-semibold text-maroon-900">
                Payment:
              </span>{' '}
              Cash on Delivery
            </p>

            <p>
              <span className="font-semibold text-maroon-900">
                Deliver to:
              </span>{' '}
              {draft.customer.name}, {draft.customer.address}
            </p>

            <p>
              <span className="font-semibold text-maroon-900">
                Landmark:
              </span>{' '}
              {draft.customer.landmark}
            </p>
          </div>
        </section>

        <div className="mt-6 space-y-2 text-sm text-maroon-900/80">
          <p>
            <span className="font-semibold text-maroon-900">
              Expected delivery:
            </span>{' '}
            Usually within {BUSINESS.delivery.timeText}.
          </p>

          <p className="text-xs text-maroon-900/60">
            {BUSINESS.delivery.disclaimer}
          </p>

          <p className="flex flex-wrap items-center gap-2">
            Questions or no reply from the shop? Call{' '}
            <a
              href={phoneLink()}
              className="inline-flex items-center gap-1 font-semibold text-maroon-800 underline"
            >
              <Phone size={14} aria-hidden />
              {BUSINESS.phone}
            </a>{' '}
            and mention {orderNumber}.
          </p>
        </div>

        <Link
          to="/sweets"
          onClick={clearLastOrder}
          className="mt-8 inline-block text-sm font-medium text-maroon-800 underline"
        >
          Start a new order
        </Link>
      </div>
    </Container>
  )
}