import Container from '../components/ui/Container'
import AboutSnippet from '../components/home/AboutSnippet'
import DeliveryBanner from '../components/home/DeliveryBanner'
import FeaturedGhewar from '../components/home/FeaturedGhewar'
import FindUs from '../components/home/FindUs'
import FreshSweets from '../components/home/FreshSweets'
import HeroSection from '../components/home/HeroSection'
import HowItWorks from '../components/home/HowItWorks'
import WhyRohitSweets from '../components/home/WhyRohitSweets'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DeliveryBanner />
      <Container className="space-y-8 py-6 md:py-10">
        <FeaturedGhewar />
        <FreshSweets />
      </Container>
      <WhyRohitSweets />
      <Container className="grid gap-10 py-10 lg:grid-cols-3 lg:items-start">
        <HowItWorks />
        <AboutSnippet />
        <FindUs />
      </Container>
    </>
  )
}