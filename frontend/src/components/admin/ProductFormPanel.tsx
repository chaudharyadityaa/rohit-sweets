import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { CATEGORIES } from '../../data/categories'
import type { ProductPayload } from '../../services/adminProductsApi'

export type ProductFormValues = {
  name: string
  description: string
  price: string // kept as string in the form; parsed on submit
  unit: string
  imageUrl: string
  category: string
  featured: boolean
}

const EMPTY_FORM: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  unit: 'kg',
  imageUrl: '',
  category: '',
  featured: false,
}

type ProductFormPanelProps = {
  initialValues?: ProductFormValues
  title: string
  onCancel: () => void
  onSubmit: (payload: ProductPayload) => Promise<void>
}

export default function ProductFormPanel({
  initialValues,
  title,
  onCancel,
  onSubmit,
}: ProductFormPanelProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(initialValues ?? EMPTY_FORM)
  }, [initialValues])

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!values.name.trim() || !values.category.trim()) {
      setError('Name and category are required.')
      return
    }

    let price: number | null = null
    if (values.price.trim() !== '') {
      const parsed = Number(values.price)
      if (Number.isNaN(parsed) || parsed < 0) {
        setError('Price must be a positive number, or left blank.')
        return
      }
      price = parsed
    }

    setSubmitting(true)
    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim() || null,
        price,
        unit: values.unit.trim() || 'kg',
        imageUrl: values.imageUrl.trim() || null,
        category: values.category.trim(),
        featured: values.featured,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gold-400 bg-cream-100 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-maroon-800">{title}</h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="rounded-full p-1.5 text-maroon-800/70 hover:bg-cream-200"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="pf-name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="pf-name"
            type="text"
            required
            maxLength={100}
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          />
        </div>

        <div>
          <label htmlFor="pf-price" className="block text-sm font-medium">
            Price (₹/kg) <span className="font-normal text-maroon-900/50">optional</span>
          </label>
          <input
            id="pf-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Leave blank if not set"
            value={values.price}
            onChange={(e) => update('price', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          />
        </div>

        <div>
          <label htmlFor="pf-category" className="block text-sm font-medium">
            Category
          </label>
          <input
            id="pf-category"
            type="text"
            required
            list="pf-category-options"
            value={values.category}
            onChange={(e) => update('category', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          />
          <datalist id="pf-category-options">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="pf-description" className="block text-sm font-medium">
            Description <span className="font-normal text-maroon-900/50">optional</span>
          </label>
          <textarea
            id="pf-description"
            rows={2}
            maxLength={2000}
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="pf-image" className="block text-sm font-medium">
            Image URL <span className="font-normal text-maroon-900/50">optional</span>
          </label>
          <input
            id="pf-image"
            type="text"
            placeholder="https://..."
            value={values.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          />
        </div>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update('featured', e.target.checked)}
            className="h-4 w-4 accent-maroon-800"
          />
          Featured on homepage
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save product'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}