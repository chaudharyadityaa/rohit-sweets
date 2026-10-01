import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import DeliveryBandPicker from '../components/checkout/DeliveryBandPicker'
import Field from '../components/checkout/Field'
import OrderSummary from '../components/checkout/OrderSummary'
import Container from '../components/ui/Container'
import { Button, ButtonLink } from '../components/ui/Button'
import { BUSINESS } from '../config/business'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { saveLastOrder } from '../services/lastOrder'
import { ApiError } from '../services/apiClient'
import { createOrder, type OrderApiResponse } from '../services/ordersApi'
import type { CheckoutField, CheckoutForm } from '../types/checkout'
import type { PlacedOrder } from '../types/order'
import { buildCartLines, cartSubtotal, type CartLine } from '../utils/cart'
import { findBand } from '../utils/delivery'
import { inputClasses } from '../utils/formStyles'
import { FIELD_ORDER, validateCheckout } from '../utils/validation'
import { orderWhatsAppLink } from '../utils/whatsapp'

const INITIAL_FORM: CheckoutForm = {
  name: '',
  phone: '',
  address: '',
  landmark: '',
  instructions: '',
  bandId: null,
  inServiceArea: false,
}

export default function CheckoutPage() {
  const { items } = useCart()
  const { products, isLoading } = useProducts()
  const lines = buildCartLines(items, products)

  if (isLoading) {
    return (
      <Container className="py-20 text-center">
        <p className="text-sm text-maroon-900/60">Loading your cart…</p>
      </Container>
    )
  }

  if (lines.length === 0) {
    return (
      <Container className="py-20 text-center">
        <ShoppingBag size={48} strokeWidth={1.25} className="mx-auto text-gold-600" aria-hidden />
        <h1 className="mt-4 text-3xl font-bold text-maroon-800">Your cart is empty</h1>
        <p className="mt-2 text-maroon-900/70">Add some sweets before checking out.</p>
        <ButtonLink to="/sweets" className="mt-6">
          BROWSE SWEETS
        </ButtonLink>
      </Container>
    )
  }

  if (lines.some((line) => !line.orderable)) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold text-maroon-800">Please check your cart</h1>
        <p className="mt-2 text-maroon-900/70">
          One of your sweets is no longer available to order. Remove it to continue.
        </p>
        <ButtonLink to="/cart" className="mt-6">
          GO TO CART
        </ButtonLink>
      </Container>
    )
  }

  return <CheckoutContent lines={lines} />
}

function orderApiResponseToPlacedOrder(response: OrderApiResponse): PlacedOrder {
  return {
    orderNumber: response.orderNumber,
    createdAt: response.createdAt,
    draft: {
      customer: {
        name: response.customerName,
        phone: response.phone,
        address: response.address,
        landmark: response.landmark,
        instructions: response.instructions ?? '',
      },
      items: response.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
      subtotal: response.subtotal,
      deliveryBand: response.deliveryBand,
      deliveryCharge: response.deliveryCharge,
      total: response.total,
      paymentMethod: 'CASH_ON_DELIVERY',
    },
  }
}

function CheckoutContent({ lines }: { lines: CartLine[] }) {
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM)
  const [touched, setTouched] = useState<Partial<Record<CheckoutField, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [placeError, setPlaceError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { clearCart } = useCart()

  const errors = validateCheckout(form)
  const subtotal = cartSubtotal(lines)
  const band = findBand(form.bandId)

  const errorFor = (field: CheckoutField) =>
    submitted || touched[field] ? errors[field] : undefined

  function update<K extends CheckoutField>(key: K, value: CheckoutForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function markTouched(field: CheckoutField) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function fieldProps(field: CheckoutField) {
    const error = errorFor(field)
    return {
      id: `field-${field}`,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `field-${field}-error` : undefined,
      className: inputClasses(Boolean(error)),
      onBlur: () => markTouched(field),
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    setPlaceError(null)

    const firstInvalid = FIELD_ORDER.find((field) => errors[field])
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }
    if (!form.bandId) return

    setPlacing(true)
    try {
      const response = await createOrder({
        customerName: form.name.trim(),
        phone: form.phone.replace(/\D/g, '').slice(-10),
        address: form.address.trim(),
        landmark: form.landmark.trim(),
        instructions: form.instructions.trim(),
        deliveryBandId: form.bandId,
        inServiceArea: form.inServiceArea,
        items: lines.map((line) => ({ productId: line.product.id, quantity: line.quantity })),
      })

      const order = orderApiResponseToPlacedOrder(response)
      saveLastOrder(order)
      window.open(orderWhatsAppLink(order), '_blank', 'noopener,noreferrer')
      clearCart()
      navigate('/order-success', { replace: true, state: { order } })
    } catch (err) {
      setPlaceError(
        err instanceof ApiError
          ? err.message
          : 'Could not place your order. Please check your connection and try again.',
      )
    } finally {
      setPlacing(false)
    }
  }

  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-3xl font-bold text-maroon-800 md:text-4xl">Checkout</h1>
      <p className="mt-2 text-maroon-900/70">
        Enter your delivery details. You pay <strong>Cash on Delivery</strong>.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid gap-8 lg:grid-cols-3 lg:items-start"
      >
        <div className="space-y-5 lg:col-span-2">
          <Field id="field-name" label="Your name" error={errorFor('name')}>
            <input
              {...fieldProps('name')}
              type="text"
              autoComplete="name"
              maxLength={60}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </Field>

          <Field
            id="field-phone"
            label="Mobile number"
            hint="We may call this number about your delivery."
            error={errorFor('phone')}
          >
            <input
              {...fieldProps('phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={16}
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </Field>

          <Field
            id="field-address"
            label="Delivery address"
            hint="House / shop number, street, area"
            error={errorFor('address')}
          >
            <textarea
              {...fieldProps('address')}
              rows={3}
              autoComplete="street-address"
              maxLength={300}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
            />
          </Field>

          <Field
            id="field-landmark"
            label="Landmark"
            hint="A well-known place nearby, e.g. temple, school, petrol pump"
            error={errorFor('landmark')}
          >
            <input
              {...fieldProps('landmark')}
              type="text"
              maxLength={100}
              value={form.landmark}
              onChange={(e) => update('landmark', e.target.value)}
            />
          </Field>

          <Field
            id="field-instructions"
            label="Delivery instructions"
            optional
            error={errorFor('instructions')}
          >
            <textarea
              {...fieldProps('instructions')}
              rows={2}
              maxLength={200}
              placeholder="e.g. Call when you reach the gate"
              value={form.instructions}
              onChange={(e) => update('instructions', e.target.value)}
            />
          </Field>

          <DeliveryBandPicker
            value={form.bandId}
            onChange={(id) => {
              update('bandId', id)
              markTouched('bandId')
            }}
            error={errorFor('bandId')}
          />

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                id="field-inServiceArea"
                type="checkbox"
                checked={form.inServiceArea}
                aria-invalid={errorFor('inServiceArea') ? true : undefined}
                aria-describedby={
                  errorFor('inServiceArea') ? 'field-inServiceArea-error' : undefined
                }
                onChange={(e) => {
                  update('inServiceArea', e.target.checked)
                  markTouched('inServiceArea')
                }}
                className="mt-0.5 h-5 w-5 shrink-0 accent-maroon-800"
              />
              <span>
                I confirm my delivery address is within {BUSINESS.delivery.radiusKm} km of{' '}
                {BUSINESS.name}. The shop will check the address when it receives the order.
              </span>
            </label>
            {errorFor('inServiceArea') && (
              <p
                id="field-inServiceArea-error"
                role="alert"
                className="mt-1 text-xs text-red-700"
              >
                {errorFor('inServiceArea')}
              </p>
            )}
          </div>
        </div>

        <aside
          aria-labelledby="summary-heading"
          className="rounded-2xl border border-cream-200 bg-cream-100 p-5 lg:sticky lg:top-24"
        >
          <OrderSummary
            lines={lines}
            subtotal={subtotal}
            deliveryCharge={band ? band.charge : null}
          />

          <p className="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-maroon-900/70">
            Next, your order opens in WhatsApp. You need to <strong>send</strong> the message to{' '}
            {BUSINESS.name} for the shop to receive it.
          </p>

          {placeError && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {placeError}
            </p>
          )}

          <Button type="submit" disabled={placing} className="mt-4 w-full">
            {placing ? 'Placing order…' : 'PLACE ORDER'}
          </Button>
        </aside>
      </form>
    </Container>
  )
}