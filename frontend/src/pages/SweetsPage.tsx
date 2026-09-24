import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryTabs, { type CategoryFilter } from '../components/product/CategoryTabs'
import ProductCard from '../components/product/ProductCard'
import SearchBox from '../components/product/SearchBox'
import Container from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { CATEGORIES } from '../data/categories'
import { products } from '../data/products'

export default function SweetsPage() {
  const [params, setParams] = useSearchParams()

  const query = params.get('q') ?? ''
  const rawCategory = params.get('category')
  const category: CategoryFilter =
    CATEGORIES.find((c) => c === rawCategory) ?? 'All'

  function updateParam(key: 'q' | 'category', value: string) {
    const next = new URLSearchParams(params)
    if (value && value !== 'All') next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        p.name.toLowerCase().includes(needle),
    )
  }, [category, query])

  const hasUnpriced = products.some((p) => p.price === null)

  return (
    <Container className="py-8 md:py-12">
      <header>
        <h1 className="text-3xl font-bold text-maroon-800 md:text-4xl">Our Sweets</h1>
        <p className="mt-2 text-maroon-900/70">
          Traditional sweets from ROHIT SWEETS, Baraut. Sold by the kg.
        </p>
      </header>

      {hasUnpriced && (
        <p className="mt-5 rounded-xl border border-gold-400/50 bg-cream-100 px-4 py-3 text-sm text-maroon-900/80">
          Prices are being finalised. Sweets marked “Price coming soon” can’t be
          ordered online yet. Call us to ask about them.
        </p>
      )}

      <div className="mt-6 space-y-4">
        <SearchBox value={query} onChange={(v) => updateParam('q', v)} />
        <CategoryTabs active={category} onChange={(c) => updateParam('category', c)} />
      </div>

      <p className="mt-6 text-sm text-maroon-900/60" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'sweet' : 'sweets'}
      </p>

      {visible.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-cream-200 py-14 text-center">
          <p className="font-semibold text-maroon-800">No sweets found</p>
          <p className="mt-1 text-sm text-maroon-900/70">
            Try a different name or category.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setParams({}, { replace: true })}
          >
            Clear filters
          </Button>
        </div>
      )}
    </Container>
  )
}