import { DEFAULT_DELIVERY_CHARGES } from '../config/business'

export type DeliveryBand = {
  id: string
  label: string
  charge: number
}

// Built from the proposed defaults. Later this comes from admin settings (backend).
export const DELIVERY_BANDS: DeliveryBand[] = DEFAULT_DELIVERY_CHARGES.map((band) => ({
  id: `${band.fromKm}-${band.toKm}`,
  label: `${band.fromKm}–${band.toKm} km`,
  charge: band.charge,
}))

export function findBand(id: string | null): DeliveryBand | undefined {
  return id ? DELIVERY_BANDS.find((band) => band.id === id) : undefined
}