import { ArrowRight, ClipboardList, ShoppingBag, Bike } from 'lucide-react'
import { Fragment } from 'react'

const STEPS = [
  { icon: ShoppingBag, title: 'Browse', text: 'Choose your sweets' },
  { icon: ClipboardList, title: 'Place Order', text: 'Enter details, send on WhatsApp' },
  { icon: Bike, title: 'We Deliver', text: 'Pay cash on delivery' },
]

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-heading">
      <h2 id="how-heading" className="text-lg font-bold uppercase text-maroon-800">
        How it works
      </h2>
      <ol className="mt-5 flex items-start justify-between gap-2">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <Fragment key={title}>
            <li className="relative flex flex-1 flex-col items-center text-center">
              <span className="absolute -top-2 left-1/2 -ml-8 flex h-5 w-5 items-center justify-center rounded-full bg-maroon-800 text-[10px] font-semibold text-cream-50">
                {index + 1}
              </span>
              <Icon size={36} strokeWidth={1.25} className="text-maroon-800" aria-hidden />
              <p className="mt-2 text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs text-maroon-900/70">{text}</p>
            </li>
            {index < STEPS.length - 1 && (
              <ArrowRight
                size={16}
                aria-hidden
                className="mt-4 hidden shrink-0 text-gold-500 sm:block"
              />
            )}
          </Fragment>
        ))}
      </ol>
    </section>
  )
}