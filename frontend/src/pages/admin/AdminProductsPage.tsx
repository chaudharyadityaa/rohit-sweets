import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import ProductFormPanel, {
  type ProductFormValues,
} from '../../components/admin/ProductFormPanel'
import ProductRow from '../../components/admin/ProductRow'
import { ApiError } from '../../services/apiClient'
import {
  createProduct,
  deleteProduct,
  fetchAllProductsForAdmin,
  reactivateProduct,
  setProductAvailability,
  updateProduct,
  type ProductPayload,
} from '../../services/adminProductsApi'
import type { Product } from '../../types/product'
import ScrollHintTable from '../../components/admin/ScrollHintTable'

type PanelState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; product: Product }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [panel, setPanel] = useState<PanelState>({ mode: 'closed' })
  const [busyId, setBusyId] = useState<number | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  function loadProducts() {
    setLoading(true)
    fetchAllProductsForAdmin()
      .then(setProducts)
      .catch((err) => setErrorMessage(err instanceof ApiError ? err.message : 'Could not load products.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadProducts, [])

  async function handleCreate(payload: ProductPayload) {
    const created = await createProduct(payload)
    setProducts((prev) => [...prev, created])
    setPanel({ mode: 'closed' })
  }

  async function handleUpdate(id: number, payload: ProductPayload) {
    const updated = await updateProduct(id, payload)
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setPanel({ mode: 'closed' })
  }

  async function handleToggleAvailability(product: Product) {
    setBusyId(product.id)
    try {
      const updated = await setProductAvailability(product.id, !product.available)
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)))
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Could not update availability.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Remove "${product.name}"? You can restore it later.`)) return
    setBusyId(product.id)
    try {
      await deleteProduct(product.id)
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, active: false } : p)))
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Could not delete product.')
    } finally {
      setBusyId(null)
    }
  }

    async function handleReactivate(product: Product) {
    setBusyId(product.id)
    try {
      const updated = await reactivateProduct(product.id)
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)))
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Could not restore product.')
    } finally {
      setBusyId(null)
    }
  }

  const visibleProducts = showInactive ? products : products.filter((p) => p.active)

  function toFormValues(product: Product): ProductFormValues {
    return {
      name: product.name,
      description: product.description ?? '',
      price: product.price === null ? '' : String(product.price),
      unit: product.unit,
      imageUrl: product.image ?? '',
      category: product.category,
      featured: product.featured,
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-maroon-800">Products</h1>
        {panel.mode === 'closed' && (
          <Button onClick={() => setPanel({ mode: 'create' })}>
            <Plus size={16} aria-hidden /> Add product
          </Button>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {panel.mode === 'create' && (
        <div className="mt-6">
          <ProductFormPanel
            title="Add product"
            onCancel={() => setPanel({ mode: 'closed' })}
            onSubmit={handleCreate}
          />
        </div>
      )}

      {panel.mode === 'edit' && (
        <div className="mt-6">
          <ProductFormPanel
            title={`Edit ${panel.product.name}`}
            initialValues={toFormValues(panel.product)}
            onCancel={() => setPanel({ mode: 'closed' })}
            onSubmit={(payload) => handleUpdate(panel.product.id, payload)}
          />
        </div>
      )}

      <label className="mt-6 flex items-center gap-2 text-sm text-maroon-900/70">
        <input
          type="checkbox"
          checked={showInactive}
          onChange={(e) => setShowInactive(e.target.checked)}
          className="h-4 w-4 accent-maroon-800"
        />
        Show deleted products
      </label>

      {loading ? (
        <p className="mt-4 text-sm text-maroon-900/60">Loading products…</p>
      ) : (
        <ScrollHintTable>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-200 text-xs uppercase text-maroon-900/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  busy={busyId === product.id}
                  onEdit={() => setPanel({ mode: 'edit', product })}
                  onToggleAvailability={() => handleToggleAvailability(product)}
                  onDelete={() => handleDelete(product)}
                  onReactivate={() => handleReactivate(product)}
                />
              ))}
            </tbody>
          </table>
        </ScrollHintTable>
      )}
    </div>
  )
}