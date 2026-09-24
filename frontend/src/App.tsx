import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import PlaceholderPage from './pages/PlaceholderPage'
import SweetsPage from './pages/SweetsPage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'



export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sweets" element={<SweetsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<PlaceholderPage title="About Rohit Sweets" />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
        <Route path="*" element={<PlaceholderPage title="Page not found" />} />
      </Route>
    </Routes>
  )
}