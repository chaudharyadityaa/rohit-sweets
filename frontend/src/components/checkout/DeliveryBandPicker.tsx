import { DELIVERY_BANDS } from '../../utils/delivery'
import { formatPrice } from '../../utils/product'

type DeliveryBandPickerProps = {
  value: string | null
  onChange: (id: string) => void
  error?: string
}

export default function DeliveryBandPicker({ value, onChange, error }: DeliveryBandPickerProps) {
  return (
    <fieldset
      id="field-bandId"
      tabIndex={-1}
      aria-describedby={error ? 'field-bandId-error' : undefined}
      className="focus:outline-none"
    >
      <legend className="text-sm font-medium">How far is your address from the shop?</legend>
      <p className="mt-0.5 text-xs text-maroon-900/60">
        This sets your delivery charge. The shop will confirm your address.
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {DELIVERY_BANDS.map((band) => (
          <label
            key={band.id}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm transition has-checked:border-maroon-800 has-checked:bg-cream-100 has-focus-visible:outline-2 has-focus-visible:outline-gold-500"
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="deliveryBand"
                value={band.id}
                checked={value === band.id}
                onChange={() => onChange(band.id)}
                className="accent-maroon-800"
              />
              {band.label}
            </span>
            <span className="font-semibold text-maroon-800">{formatPrice(band.charge)}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id="field-bandId-error" role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </fieldset>
  )
}