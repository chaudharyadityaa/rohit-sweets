import { BUSINESS } from '../config/business'

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${BUSINESS.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function phoneLink(): string {
  return `tel:+91${BUSINESS.phone}`
}

/** Free Google Maps search link. No API key needed. */
export function directionsLink(): string {
  const query = `${BUSINESS.name}, ${BUSINESS.address.line1}, ${BUSINESS.address.line2}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}