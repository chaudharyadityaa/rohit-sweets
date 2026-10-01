import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { BUSINESS } from '../../config/business'
import { useCartCount } from '../../hooks/useCartCount'
import Container from '../ui/Container'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/sweets', label: 'Sweets', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = useCartCount()
  const closeMenu = () => setMenuOpen(false)

  return (
        <header
      className="sticky z-50 border-b border-cream-200 bg-cream-50/95 backdrop-blur"
      style={{ top: 0, paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        {/* Wordmark. Replace with the owner's logo when provided. */}
        <Link to="/" onClick={closeMenu} className="leading-tight">
          <span className="block font-display text-xl font-bold tracking-wide text-maroon-800 md:text-3xl">
            {BUSINESS.name}
          </span>
          <span className="block text-[9px] uppercase tracking-[0.3em] text-gold-600 md:text-[10px]">
            {BUSINESS.tagline}
          </span>
        </Link>

        {/* Desktop links */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `border-b-2 pb-1 text-sm font-medium transition ${
                      isActive
                        ? 'border-maroon-800 text-maroon-800'
                        : 'border-transparent text-maroon-900 hover:text-maroon-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/cart"
            onClick={closeMenu}
            aria-label={`Cart, ${cartCount} items`}
            className="relative rounded-full p-2 text-maroon-800 transition hover:bg-cream-100"
          >
            <ShoppingCart size={22} />
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon-800 px-1 text-[10px] font-semibold text-cream-50">
                {cartCount}
              </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="rounded-full p-2 text-maroon-800 transition hover:bg-cream-100 md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-cream-200 bg-cream-50 md:hidden"
        >
          <ul className="px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-base font-medium ${
                      isActive
                        ? 'bg-cream-100 text-maroon-800'
                        : 'text-maroon-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}