import { Minus, Plus } from 'lucide-react'
import { QUANTITY_RULES } from '../../config/business'
import { clampQuantity, formatQuantity } from '../../utils/quantity'

type QuantitySelectorProps = {
  value: number
  onChange: (value: number) => void
  unit: string
}

export default function QuantitySelector({ value, onChange, unit }: QuantitySelectorProps) {
  const { min, max, step } = QUANTITY_RULES
  const buttonClass =
    'flex h-11 w-11 items-center justify-center rounded-full border border-gold-500 text-maroon-800 transition hover:bg-cream-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div role="group" aria-label="Quantity" className="flex items-center gap-4">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(clampQuantity(value - step))}
        className={buttonClass}
      >
        <Minus size={18} aria-hidden />
      </button>
      <span aria-live="polite" className="min-w-16 text-center text-lg font-semibold">
        {formatQuantity(value, unit)}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(clampQuantity(value + step))}
        className={buttonClass}
      >
        <Plus size={18} aria-hidden />
      </button>
    </div>
  )
}