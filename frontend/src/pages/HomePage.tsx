import Container from '../components/ui/Container'
import { Button, ButtonLink } from '../components/ui/Button'

export default function HomePage() {
  return (
    <Container className="py-12">
      <p className="text-sm tracking-[0.25em] text-gold-500">
        CHECKPOINT 2 · DESIGN SYSTEM CHECK
      </p>
      <h1 className="mt-2 text-4xl font-bold text-maroon-800 md:text-6xl">
        ROHIT SWEETS
      </h1>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ButtonLink to="/sweets">ORDER NOW</ButtonLink>
        <ButtonLink to="/sweets" variant="outline">
          VIEW SWEETS
        </ButtonLink>
        <Button variant="ghost">Ghost</Button>
        <Button size="sm">Add to cart</Button>
        <Button size="sm" disabled>
          Currently unavailable
        </Button>
      </div>
    </Container>
  )
}