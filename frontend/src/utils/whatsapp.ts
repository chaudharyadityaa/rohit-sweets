import { BUSINESS } from '../config/business'
import type { PlacedOrder } from '../types/order'
import { whatsappLink } from './links'
import { formatPrice } from './product'
import { formatQuantity } from './quantity'

/** Structured order message. `*text*` is bold in WhatsApp. */
export function buildWhatsAppMessage(order: PlacedOrder): string {
  const { draft, orderNumber } = order
  const { customer } = draft

  const itemLines = draft.items.map(
    (item) =>
      `• ${item.name} — ${formatQuantity(item.quantity, item.unit)} × ${formatPrice(
        item.unitPrice,
      )} = ${formatPrice(item.lineTotal)}`,
  )

  const lines = [
    `*${BUSINESS.name} — NEW ORDER*`,
    '',
    `*Order:* ${orderNumber}`,
    `*Customer:* ${customer.name}`,
    `*Phone:* +91 ${customer.phone}`,
    '',
    '*Items:*',
    ...itemLines,
    '',
    `*Subtotal:* ${formatPrice(draft.subtotal)}`,
    `*Delivery (${draft.deliveryBand}):* ${formatPrice(draft.deliveryCharge)}`,
    `*TOTAL:* ${formatPrice(draft.total)}`,
    '',
    '*Payment:* Cash on Delivery',
    '',
    '*Delivery Address:*',
    customer.address,
    '',
    `*Landmark:* ${customer.landmark}`,
  ]

  if (customer.instructions) {
    lines.push('', `*Instructions:* ${customer.instructions}`)
  }
  lines.push('', '_Distance band chosen by customer. Please verify the address._')

  return lines.join('\n')
}

export function orderWhatsAppLink(order: PlacedOrder): string {
  return whatsappLink(buildWhatsAppMessage(order))
}