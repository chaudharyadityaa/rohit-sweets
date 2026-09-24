import type { CheckoutForm, OrderDraft } from '../types/checkout'
import { cartSubtotal, type CartLine } from './cart'
import { findBand } from './delivery'
import { normalizePhone } from './validation'

/**
 * Turns a valid form + cart into a plain order object.
 * Checkpoint 8 formats this for WhatsApp; Checkpoint 12 sends it to the backend,
 * which recalculates every price itself.
 */
export function buildOrderDraft(form: CheckoutForm, lines: CartLine[]): OrderDraft | null {
  const band = findBand(form.bandId)
  if (!band) return null

  const subtotal = cartSubtotal(lines)

  return {
    customer: {
      name: form.name.trim(),
      phone: normalizePhone(form.phone),
      address: form.address.trim(),
      landmark: form.landmark.trim(),
      instructions: form.instructions.trim(),
    },
    items: lines.map((line) => ({
      productId: line.product.id,
      name: line.product.name,
      unit: line.product.unit,
      quantity: line.quantity,
      unitPrice: line.product.price ?? 0,
      lineTotal: line.lineTotal,
    })),
    subtotal,
    deliveryBand: band.label,
    deliveryCharge: band.charge,
    total: subtotal + band.charge,
    paymentMethod: 'CASH_ON_DELIVERY',
  }
}