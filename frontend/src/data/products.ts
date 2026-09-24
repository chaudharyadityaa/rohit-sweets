import type { Product, ProductCategory } from '../types/product'

// Temporary local data. Replaced by the backend API in Checkpoint 17.
// Only Ghewar has a confirmed price. Do NOT invent prices for the others.
// Categories are a draft grouping for the owner to confirm.
const STAMP = '2026-09-24T00:00:00.000Z'

function make(
  id: number,
  name: string,
  category: ProductCategory,
  options: { price?: number; featured?: boolean } = {},
): Product {
  return {
    id,
    name,
    description: null,
    price: options.price ?? null,
    unit: 'kg',
    image: null,
    category,
    available: true,
    featured: options.featured ?? false,
    createdAt: STAMP,
    updatedAt: STAMP,
  }
}

export const products: Product[] = [
  make(1, 'Ghewar', 'Ghewar', { price: 400, featured: true }),
  make(2, 'Mewa Laddu', 'Ladoo', { featured: true }),
  make(3, 'Barfi', 'Barfi', { featured: true }),
  make(4, 'Nariyali Barfi', 'Barfi', { featured: true }),
  make(5, 'Milk Cake', 'Milk Sweets', { featured: true }),
  make(6, 'Doda Barfi', 'Barfi', { featured: true }),
  make(7, 'Malai Barfi', 'Barfi'),
  make(8, 'Peda', 'Milk Sweets'),
  make(9, 'Gond Barfi', 'Barfi'),
  make(10, 'Balushahi', 'Syrup Sweets'),
  make(11, 'Malva Ladoo', 'Ladoo'),
  make(12, 'Cham Cham', 'Syrup Sweets'),
  make(13, 'Kesari Cham Cham', 'Syrup Sweets'),
  make(14, 'White Rasgulla', 'Syrup Sweets'),
  make(15, 'Chota Rasgulla', 'Syrup Sweets'),
  make(16, 'Gulabi Rasgulla', 'Syrup Sweets'),
  make(17, 'Gulab Jamun', 'Syrup Sweets'),
  make(18, 'Kala Zam', 'Syrup Sweets'),
  make(19, 'Katlas', 'Other'),
  make(20, 'Boondi Ladoo', 'Ladoo'),
  make(21, 'Simple Besan Ladoo', 'Ladoo'),
  make(22, 'Desi Ghee Besan Ladoo', 'Ladoo'),
  make(23, 'Kaju Katli', 'Barfi'),
]

export const GHEWAR_ID = 1