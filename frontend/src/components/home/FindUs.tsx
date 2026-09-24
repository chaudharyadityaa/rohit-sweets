import { ArrowRight, MapPin, Phone } from 'lucide-react'
import { BUSINESS } from '../../config/business'
import { directionsLink, phoneLink } from '../../utils/links'
import { buttonClasses } from '../../utils/buttonStyles'

export default function FindUs() {
  const { address, phone, name } = BUSINESS

  return (
    <section aria-labelledby="find-heading">
      <h2
        id="find-heading"
        className="text-sm font-bold uppercase text-maroon-800"
      >
        Find us
      </h2>

      <div className="mt-3 flex items-start gap-3">
        <MapPin
          size={20}
          className="mt-0.5 shrink-0 text-maroon-800"
          aria-hidden
        />

        <address className="text-sm not-italic">
          <p className="font-semibold">{name}</p>

          <p className="mt-1 text-maroon-900/80">
            {address.line1},<br />
            {address.line2}
          </p>
        </address>
      </div>

      <a
        href={directionsLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses('primary', 'sm', 'mt-4')}
      >
        GET DIRECTIONS
        <ArrowRight size={14} aria-hidden />
      </a>

      <a
        href={phoneLink()}
        className="mt-4 flex items-center gap-3 text-sm font-semibold hover:underline"
      >
        <Phone size={18} className="text-maroon-800" aria-hidden />
        {phone}
      </a>
    </section>
  )
}