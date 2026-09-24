import { Bike, Banknote, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BUSINESS } from '../../config/business'
import { phoneLink, whatsappLink } from '../../utils/links'
import Container from '../ui/Container'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/sweets', label: 'Sweets' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const { name, address, phone, delivery } = BUSINESS
  const headingClass = 'text-sm font-semibold text-cream-50'
  const textClass = 'text-sm text-cream-100/80'

  return (
    <footer className="bg-maroon-900 text-cream-100">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-bold text-cream-50">
              {name}
            </p>
            <p className={`mt-2 ${textClass}`}>
              Fresh sweets • Local delivery
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className={headingClass}>Quick Links</h2>

            <ul className="mt-3 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`${textClass} hover:text-cream-50`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headingClass}>Delivery</h2>

            <ul className={`mt-3 space-y-2 ${textClass}`}>
              <li className="flex items-center gap-2">
                <Bike size={16} aria-hidden />
                Within {delivery.radiusKm} km
              </li>

              <li className="flex items-center gap-2">
                <Clock size={16} aria-hidden />
                {delivery.timeText}
              </li>

              <li className="flex items-center gap-2">
                <Banknote size={16} aria-hidden />
                Cash on Delivery
              </li>
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Contact</h2>

            <ul className={`mt-3 space-y-2 ${textClass}`}>
              <li>
                <a
                  href={phoneLink()}
                  className="flex items-center gap-2 hover:text-cream-50"
                >
                  <Phone size={16} aria-hidden />
                  {phone}
                </a>
              </li>

              <li className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0"
                  aria-hidden
                />

                <span>
                  {address.line1}, {address.line2}
                </span>
              </li>

              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cream-50"
                >
                  <MessageCircle size={16} aria-hidden />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-cream-100/15 pt-6 text-center text-xs text-cream-100/60">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}