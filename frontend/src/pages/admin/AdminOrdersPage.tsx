import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import OrderDetailPanel from '../../components/admin/OrderDetailPanel'
import OrderStatusBadge from '../../components/admin/OrderStatusBadge'
import OrderStatusSelect from '../../components/admin/OrderStatusSelect'
import { fetchAdminOrders, updateOrderStatus } from '../../services/adminOrdersApi'
import { ApiError } from '../../services/apiClient'
import type { AdminOrder, OrderStatus } from '../../types/admin'
import { formatPrice } from '../../utils/product'

type StatusFilter = OrderStatus | 'ALL'

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  function loadOrders() {
    setLoading(true)
    fetchAdminOrders()
      .then((data) => setOrders([...data].sort((a, b) => b.id - a.id)))
      .catch((err) => setErrorMessage(err instanceof ApiError ? err.message : 'Could not load orders.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadOrders, [])

  async function handleStatusChange(order: AdminOrder, status: OrderStatus) {
    if (status === 'CANCELLED') {
      const confirmed = window.confirm(
        `Cancel order ${order.orderNumber}? Make sure the customer has been informed.`,
      )
      if (!confirmed) return
    }

    setBusyId(order.id)
    setErrorMessage('')
    try {
      await updateOrderStatus(order.id, status)
      loadOrders()
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Could not update order status.')
    } finally {
      setBusyId(null)
    }
  }

  const visibleOrders = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
      const matchesQuery =
        needle === '' ||
        order.orderNumber.toLowerCase().includes(needle) ||
        order.customerName.toLowerCase().includes(needle) ||
        order.phone.includes(needle)
      return matchesStatus && matchesQuery
    })
  }, [orders, statusFilter, query])

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon-800">Orders</h1>

      {errorMessage && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-900/40"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order #, name, or phone"
            className="w-full rounded-full border border-cream-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40"
          />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                statusFilter === filter.value
                  ? 'border-maroon-800 bg-maroon-800 text-cream-50'
                  : 'border-cream-200 bg-white text-maroon-900 hover:bg-cream-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-maroon-900/60">Loading orders…</p>
      ) : visibleOrders.length === 0 ? (
        <p className="mt-6 text-sm text-maroon-900/60">No orders match this filter.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-cream-200 bg-white">
          {visibleOrders.map((order) => {
            const isExpanded = expandedId === order.id
            return (
              <div key={order.id} className="border-b border-cream-100 last:border-0">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left hover:bg-cream-50"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-maroon-900/50" />
                    ) : (
                      <ChevronRight size={16} className="text-maroon-900/50" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">{order.orderNumber}</p>
                      <p className="text-xs text-maroon-900/60">{order.customerName}</p>
                    </div>
                  </div>

                  <p className="text-sm font-medium">{formatPrice(order.total)}</p>

                  <OrderStatusBadge status={order.status} />

                  <p className="text-xs text-maroon-900/60">
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>

                  <span onClick={(e) => e.stopPropagation()}>
                    <OrderStatusSelect
                      value={order.status}
                      disabled={busyId === order.id}
                      onChange={(status) => handleStatusChange(order, status)}
                    />
                  </span>
                </button>

                {isExpanded && <OrderDetailPanel order={order} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}