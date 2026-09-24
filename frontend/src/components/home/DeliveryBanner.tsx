import { ArrowRight, Bike } from 'lucide-react'
import { BUSINESS } from '../../config/business'
import Container from '../ui/Container'
import { ButtonLink } from '../ui/Button'

export default function DeliveryBanner() {
  const { radiusKm, timeText, disclaimer } = BUSINESS.delivery

  return (
    <section aria-labelledby="delivery-heading" className="py-6 md:py-8">
      <Container>
        <div className="flex flex-col gap-5 rounded-2xl border border-cream-200 bg-cream-100 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div className="flex items-start gap-4 md:items-center md:gap-6">
            <Bike
              size={48}
              strokeWidth={1.25}
              className="shrink-0 text-maroon-800"
              aria-hidden
            />
            <div>
              <h2
                id="delivery-heading"
                className="text-lg font-bold uppercase tracking-wide text-maroon-800"
              >
                Local Delivery
              </h2>
              <p className="mt-1 text-sm text-maroon-800">
                Delivery available within {radiusKm} km of {BUSINESS.name}.
              </p>
              <p className="text-sm text-maroon-800">
                Usually delivered within {timeText}.
              </p>
              <p className="mt-1 text-xs text-maroon-900/60">{disclaimer}</p>
            </div>
          </div>

          <ButtonLink to="/sweets" className="self-start sm:self-center">
            ORDER NOW <ArrowRight size={16} aria-hidden />
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}