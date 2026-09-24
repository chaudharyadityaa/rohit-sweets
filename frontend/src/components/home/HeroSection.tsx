import { ArrowRight, Bike, Cookie, Leaf } from 'lucide-react'
import { HERO_IMAGE } from '../../data/images'
import Container from '../ui/Container'
import ImagePlaceholder from '../ui/ImagePlaceholder'
import { ButtonLink } from '../ui/Button'

const HIGHLIGHTS = [
  { icon: Cookie, label: 'Famous Ghewar' },
  { icon: Leaf, label: 'Fresh Daily' },
  { icon: Bike, label: 'Local Delivery' },
]

export default function HeroSection() {
  return (
    <section className="relative flex flex-col overflow-hidden bg-cream-100 md:block">
      <Container className="relative order-1">
        <div className="py-10 motion-safe:animate-fade-up md:w-1/2 md:py-24 lg:w-3/5">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-gold-600 sm:text-sm">
            <span aria-hidden className="h-px w-8 bg-gold-500" />
            Authentic taste of Baraut
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-none text-maroon-800 sm:text-6xl lg:text-7xl">
            ROHIT SWEETS
          </h1>

          <p className="mt-4 text-lg text-maroon-900/80 md:text-xl">
            Freshly prepared sweets, made with tradition.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm">
                <Icon size={20} className="text-gold-600" aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/sweets">
              ORDER NOW <ArrowRight size={16} aria-hidden />
            </ButtonLink>
            <ButtonLink to="/sweets" variant="outline">
              VIEW SWEETS
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Image: below the text on mobile, right half on desktop */}
      <div className="relative order-2 h-64 sm:h-80 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-1/2">
        <ImagePlaceholder
          src={HERO_IMAGE}
          alt="Ghewar, a traditional round honeycomb-textured sweet topped with nuts"
          label="Ghewar photo coming soon"
          className="h-full w-full"
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-linear-to-r from-cream-100 via-cream-100/10 to-transparent md:block"
        />
      </div>
    </section>
  )
}