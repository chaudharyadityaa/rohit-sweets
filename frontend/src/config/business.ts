export const BUSINESS = {
  name: 'ROHIT SWEETS',
  tagline: 'Tradition · Taste · Trust',
  address: {
    line1: 'Shiv Murti, Near Railway Road',
    line2: 'Baraut, Uttar Pradesh 250611',
  },
  phone: '8824121485',
  // WhatsApp click-to-chat needs country code, digits only
  whatsappNumber: '918824121485',
  hours: { open: '9:00 AM', close: '5:00 PM' },
  delivery: {
    radiusKm: 7,
    timeText: '30–60 minutes',
    disclaimer: 'Delivery time may vary depending on order volume and location.',
  },
} as const

// PROPOSED defaults only. Not final policy. To be made admin-configurable.
export const DEFAULT_DELIVERY_CHARGES = [
  { fromKm: 0, toKm: 3, charge: 30 },
  { fromKm: 3, toKm: 5, charge: 50 },
  { fromKm: 5, toKm: 7, charge: 70 },
] as const


// Allowed order quantities, in kg. PROPOSED defaults, pending the owner's decision
// (whole kg only, or also 1/2 kg and 1/4 kg?). `max` is only a sanity cap.
export const QUANTITY_RULES: { min: number; step: number; max: number } = {
  min: 1,
  step: 1,
  max: 20,
}