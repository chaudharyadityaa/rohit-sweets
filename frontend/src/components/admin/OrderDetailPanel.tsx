import { MapPin, Phone } from 'lucide-react'
import type { AdminOrder } from '../../types/admin'
import { formatPrice } from '../../utils/product'
import { formatQuantity } from '../../utils/quantity'

function directionsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export default function OrderDetailPanel({ order }: { order: AdminOrder }) {
  return (
    <div className="grid gap-6 border-t border-cream-100 bg-cream-50 p-4 sm:grid-cols-2">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-maroon-900/60">
          Items
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.name}
                <span className="text-maroon-900/60">
                  {' '}
                  — {formatQuantity(item.quantity, item.unit)} × {formatPrice(item.unitPrice)}
                </span>
              </span>
              <span className="font-medium">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-cream-200 pt-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery ({order.deliveryBand})</dt>
            <dd>{formatPrice(order.deliveryCharge)}</dd>
          </div>
          <div className="flex justify-between font-bold text-maroon-800">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-maroon-900/60">
          Delivery details
        </h3>
        <div className="mt-2 space-y-2 text-sm">
          <p className="font-medium">{order.customerName}</p>
          <a
            href={`tel:+91${order.phone}`}
            className="flex items-center gap-2 text-maroon-800 hover:underline"
          >
            <Phone size={14} aria-hidden /> {order.phone}
          </a>
          <p className="flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 shrink-0 text-maroon-800" aria-hidden />
            <span>
              {order.address}
              <br />
              <span className="text-maroon-900/60">Landmark: {order.landmark}</span>
            </span>
          </p>
          {order.instructions && (
            <p className="text-maroon-900/70">
              <span className="font-medium text-maroon-900">Instructions: </span>
              {order.instructions}
            </p>
          )}
          <a
            href={directionsLink(order.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-maroon-800 underline"
          >
            Get directions
          </a>
          <p className="text-xs text-maroon-900/60">
            Payment: {order.paymentMethod.replace(/_/g, ' ')}
          </p>
        </div>
      </div>
    </div>
  )
}