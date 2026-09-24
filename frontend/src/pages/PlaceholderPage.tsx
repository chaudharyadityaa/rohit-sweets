import Container from '../components/ui/Container'
import { ButtonLink } from '../components/ui/Button'

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <Container className="py-20 text-center">
      <h1 className="text-3xl font-bold text-maroon-800 md:text-4xl">{title}</h1>
      <p className="mt-3 text-maroon-900/70">This page is coming soon.</p>
      <ButtonLink to="/" variant="outline" className="mt-6">
        Back to Home
      </ButtonLink>
    </Container>
  )
}