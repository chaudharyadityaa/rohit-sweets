import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { CartProvider } from './context/CartProvider'
import { AuthProvider } from './context/AuthProvider'
import { ProductsProvider } from './context/ProductsProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
       <ProductsProvider>
        <CartProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  </StrictMode>,
)