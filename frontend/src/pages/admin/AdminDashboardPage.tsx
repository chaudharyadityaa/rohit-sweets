import { useEffect, useState } from 'react'
import { Banknote, Bike, Clock, PackageCheck, ShoppingBag, Truck } from 'lucide-react'
import { fetchAdminOrders } from '../../services/adminOrdersApi'
import { ApiError } from '../../services/apiClient'
import type { AdminOrder } from '../../types/admin'
import { countByStatus, todaysOrders, todaysSales } from '../../utils/adminOrders'
import { formatPrice } from '../../utils/product'
import ScrollHintTable from '../../components/admin/ScrollHintTable'

type LoadState = 'loading' | 'ready' | 'error'

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchAdminOrders()
      .then((data) => {
        if (cancelled) return
        setOrders(data)
        setState('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setErrorMessage(err instanceof ApiError ? err.message : 'Could not load orders.')
        setState('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (state === 'loading') {
    return <p className="text-sm text-maroon-900/60">Loading dashboard…</p>
  }

  if (state === 'error') {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
    )
  }

  const today = todaysOrders(orders)
  const cards = [
    { label: "Today's Orders", value: today.length, icon: ShoppingBag },
    { label: 'Pending', value: countByStatus(orders, 'PENDING'), icon: Clock },
    { label: 'Preparing', value: countByStatus(orders, 'PREPARING'), icon: PackageCheck },
    { label: 'Out for Delivery', value: countByStatus(orders, 'OUT_FOR_DELIVERY'), icon: Bike },
    { label: 'Delivered Today', value: countByStatus(today, 'DELIVERED'), icon: Truck },
    { label: "Today's Sales", value: formatPrice(todaysSales(orders)), icon: Banknote },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon-800">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-cream-200 bg-white p-4 shadow-sm"
          >
            <Icon size={22} className="text-gold-600" aria-hidden />
            <p className="mt-3 text-2xl font-bold text-maroon-800">{value}</p>
            <p className="mt-1 text-xs text-maroon-900/60">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-maroon-800">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-maroon-900/60">No orders yet.</p>
        ) : (
          <ScrollHintTable>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-cream-200 text-xs uppercase text-maroon-900/60">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b border-cream-100 last:border-0">
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-maroon-900/60">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollHintTable>
        )}
      </section>
    </div>
  )
}