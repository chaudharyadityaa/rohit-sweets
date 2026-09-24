import type { CheckoutErrors, CheckoutField, CheckoutForm } from '../types/checkout'
import { BUSINESS } from '../config/business'
import { findBand } from './delivery'

/** Order in which fields appear, used to focus the first error. */
export const FIELD_ORDER: CheckoutField[] = [
  'name',
  'phone',
  'address',
  'landmark',
  'instructions',
  'bandId',
  'inServiceArea',
]

/** "+91 98765 43210", "098765 43210" → "9876543210" */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {}

  const name = form.name.trim()
  if (name.length < 2) errors.name = 'Please enter your name.'
  else if (name.length > 60) errors.name = 'Name is too long (max 60 characters).'

  if (!/^[6-9]\d{9}$/.test(normalizePhone(form.phone))) {
    errors.phone = 'Enter a valid 10-digit mobile number.'
  }

  const address = form.address.trim()
  if (address.length < 10) {
    errors.address = 'Please enter your full delivery address (house/shop, street, area).'
  } else if (address.length > 300) {
    errors.address = 'Address is too long (max 300 characters).'
  }

  const landmark = form.landmark.trim()
  if (landmark.length < 3) errors.landmark = 'Please add a nearby landmark to help us find you.'
  else if (landmark.length > 100) errors.landmark = 'Landmark is too long (max 100 characters).'

  if (form.instructions.trim().length > 200) {
    errors.instructions = 'Instructions are too long (max 200 characters).'
  }

  if (!findBand(form.bandId)) {
    errors.bandId = 'Please choose how far your address is from the shop.'
  }

  if (!form.inServiceArea) {
    errors.inServiceArea = `Please confirm your address is within ${BUSINESS.delivery.radiusKm} km of the shop.`
  }

  return errors
}