import { LogOut } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { BUSINESS } from '../../config/business'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products', end: false },
  { to: '/admin/orders', label: 'Orders', end: false },
]

export default function AdminLayout() {
  const { username, logout } = useAuth()

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-cream-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-lg font-bold text-maroon-800">
              {BUSINESS.name} Admin
            </p>
            {username && <p className="text-xs text-maroon-900/60">Signed in as {username}</p>}
          </div>

          <nav aria-label="Admin" className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-maroon-800 text-cream-50'
                      : 'text-maroon-900 hover:bg-cream-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button variant="ghost" size="sm" onClick={logout} className="ml-2">
              <LogOut size={16} aria-hidden /> Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}