import Container from '../components/ui/Container'
import DeliveryBanner from '../components/home/DeliveryBanner'
import FeaturedGhewar from '../components/home/FeaturedGhewar'
import FreshSweets from '../components/home/FreshSweets'
import HeroSection from '../components/home/HeroSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DeliveryBanner />
      <Container className="space-y-8 py-6 md:py-10">
        <FeaturedGhewar />
        <FreshSweets />
      </Container>
      {/* Next (3C): Why Rohit Sweets, How it works, About, Find us, Footer */}
    </>
  )
}