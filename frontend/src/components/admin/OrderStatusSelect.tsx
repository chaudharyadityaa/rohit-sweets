import type { OrderStatus } from '../../types/admin'

const OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

type OrderStatusSelectProps = {
  value: OrderStatus
  onChange: (status: OrderStatus) => void
  disabled?: boolean
}

export default function OrderStatusSelect({ value, onChange, disabled }: OrderStatusSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      aria-label="Change order status"
      className="rounded-full border border-cream-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40 disabled:opacity-50"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}