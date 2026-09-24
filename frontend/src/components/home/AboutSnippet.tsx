import { ArrowRight } from 'lucide-react'
import { BUSINESS } from '../../config/business'
import ImagePlaceholder from '../ui/ImagePlaceholder'
import { ButtonLink } from '../ui/Button'

export default function AboutSnippet() {
  return (
    <section
      aria-labelledby="about-heading"
      className="flex overflow-hidden rounded-2xl border border-cream-200 bg-cream-100"
    >
      <div className="flex-1 p-5">
        <h2 id="about-heading" className="text-sm font-bold uppercase text-maroon-800">
          About {BUSINESS.name}
        </h2>
        <p className="mt-3 text-sm text-maroon-900/80">
          A local sweet shop serving traditional Indian sweets in Baraut, near Shiv Murti,
          Railway Road.
        </p>
        <ButtonLink to="/about" size="sm" className="mt-4">
          LEARN MORE <ArrowRight size={14} aria-hidden />
        </ButtonLink>
      </div>
      <ImagePlaceholder
        src={null}
        alt="Photo of the shop, coming soon"
        label=""
        className="hidden w-32 sm:flex"
      />
    </section>
  )
}