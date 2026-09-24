import { QUANTITY_RULES } from '../config/business'

/** 0.5 → "0.5 kg", 2 → "2 kg" */
export function formatQuantity(quantity: number, unit: string): string {
  return `${Number(quantity.toFixed(2))} ${unit}`
}

export function clampQuantity(quantity: number): number {
  const { min, max } = QUANTITY_RULES
  return Math.min(max, Math.max(min, quantity))
}