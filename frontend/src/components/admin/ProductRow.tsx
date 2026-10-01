import { Pencil, RotateCcw, Trash2 } from 'lucide-react'
import type { Product } from '../../types/product'
import { priceLabel } from '../../utils/product'

type ProductRowProps = {
  product: Product
  onEdit: () => void
  onToggleAvailability: () => void
  onDelete: () => void
  onReactivate: () => void
  busy: boolean
}

export default function ProductRow({
  product,
  onEdit,
  onToggleAvailability,
  onDelete,
  onReactivate,
  busy,
}: ProductRowProps) {
  return (
    <tr className={`border-b border-cream-100 last:border-0 ${!product.active ? 'opacity-50' : ''}`}>
      <td className="px-4 py-3 font-medium">{product.name}</td>
      <td className="px-4 py-3 text-maroon-900/70">{product.category}</td>
      <td className="px-4 py-3">{priceLabel(product)}</td>
      <td className="px-4 py-3">
        {product.active ? (
          <button
            type="button"
            onClick={onToggleAvailability}
            disabled={busy}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              product.available
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-cream-200 text-maroon-900/70 hover:bg-cream-100'
            }`}
          >
            {product.available ? 'Available' : 'Unavailable'}
          </button>
        ) : (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
            Deleted
          </span>
        )}
      </td>
      <td className="px-4 py-3">{product.featured ? 'Yes' : '—'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {product.active ? (
            <>
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit ${product.name}`}
                className="rounded-full p-2 text-maroon-800 hover:bg-cream-100"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={busy}
                aria-label={`Delete ${product.name}`}
                className="rounded-full p-2 text-maroon-800/70 hover:bg-cream-100 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onReactivate}
              disabled={busy}
              aria-label={`Restore ${product.name}`}
              className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-maroon-800 hover:bg-cream-100"
            >
              <RotateCcw size={14} /> Restore
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}