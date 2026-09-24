export type ProductCategory =
  | 'Ghewar'
  | 'Barfi'
  | 'Ladoo'
  | 'Milk Sweets'
  | 'Syrup Sweets'
  | 'Other'

export type Product = {
  id: number
  name: string
  description: string | null
  price: number | null // null = owner has not confirmed a price yet
  unit: 'kg'
  image: string | null // null = show placeholder
  category: ProductCategory
  available: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}