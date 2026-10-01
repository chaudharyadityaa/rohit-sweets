import { describe, expect, it } from 'vitest'
import { normalizePhone, validateCheckout } from './validation'
import type { CheckoutForm } from '../types/checkout'

function makeValidForm(overrides: Partial<CheckoutForm> = {}): CheckoutForm {
  return {
    name: 'Rahul Sharma',
    phone: '9876543210',
    address: '123 Test Street, Test Area, Baraut',
    landmark: 'Near Railway Station',
    instructions: '',
    bandId: '3-5',
    inServiceArea: true,
    ...overrides,
  }
}

describe('normalizePhone', () => {
  it('strips spaces and formatting', () => {
    expect(normalizePhone('98765 43210')).toBe('9876543210')
  })

  it('strips a +91 country code', () => {
    expect(normalizePhone('+91 98765 43210')).toBe('9876543210')
  })

  it('strips a leading 0', () => {
    expect(normalizePhone('098765 43210')).toBe('9876543210')
  })
})

describe('validateCheckout', () => {
  it('passes with no errors for a fully valid form', () => {
    const errors = validateCheckout(makeValidForm())
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('rejects a name under 2 characters', () => {
    const errors = validateCheckout(makeValidForm({ name: 'A' }))
    expect(errors.name).toBeDefined()
  })

  it('rejects a phone number not starting with 6-9', () => {
    const errors = validateCheckout(makeValidForm({ phone: '5876543210' }))
    expect(errors.phone).toBeDefined()
  })

  it('rejects a phone number with the wrong length', () => {
    const errors = validateCheckout(makeValidForm({ phone: '12345' }))
    expect(errors.phone).toBeDefined()
  })

  it('accepts a phone number with a country code and spaces', () => {
    const errors = validateCheckout(makeValidForm({ phone: '+91 98765 43210' }))
    expect(errors.phone).toBeUndefined()
  })

  it('rejects an address under 10 characters', () => {
    const errors = validateCheckout(makeValidForm({ address: 'short' }))
    expect(errors.address).toBeDefined()
  })

  it('rejects a landmark under 3 characters', () => {
    const errors = validateCheckout(makeValidForm({ landmark: 'X' }))
    expect(errors.landmark).toBeDefined()
  })

  it('rejects when no delivery band is chosen', () => {
    const errors = validateCheckout(makeValidForm({ bandId: null }))
    expect(errors.bandId).toBeDefined()
  })

  it('rejects when the service area checkbox is unticked', () => {
    const errors = validateCheckout(makeValidForm({ inServiceArea: false }))
    expect(errors.inServiceArea).toBeDefined()
  })

  it('rejects instructions over 200 characters', () => {
    const errors = validateCheckout(makeValidForm({ instructions: 'x'.repeat(201) }))
    expect(errors.instructions).toBeDefined()
  })
})