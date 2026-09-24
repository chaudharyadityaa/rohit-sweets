import { Banknote, Bike, Clock, Leaf, MapPin } from 'lucide-react'
import { BUSINESS } from '../../config/business'
import Container from '../ui/Container'

export default function WhyRohitSweets() {
  const { hours, delivery } = BUSINESS

  const items = [
    { icon: Leaf, title: 'Fresh Sweets', text: 'Prepared daily' },
    { icon: Bike, title: 'Local Delivery', text: `Within ${delivery.radiusKm} km` },
    { icon: MapPin, title: 'Local Shop', text: 'Right here in Baraut' },
    { icon: Clock, title: `Open ${hours.open} – ${hours.close}`, text: 'Every day' },
    { icon: Banknote, title: 'Cash on Delivery', text: 'Pay when it arrives' },
  ]

  return (
    <section aria-labelledby="why-heading" className="bg-cream-100 py-10">
      <Container>
        <h2
          id="why-heading"
          className="text-center text-xl font-bold uppercase text-maroon-800 md:text-2xl"
        >
          Why Rohit Sweets?
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-5">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col items-center text-center">
              <Icon size={36} strokeWidth={1.25} className="text-gold-600" aria-hidden />
              <p className="mt-3 text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs text-maroon-900/70">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}