/** Categories are free text on the backend (Checkpoint 11); this is now just a string. */
export type ProductCategory = string

export type Product = {
  id: number
  name: string
  description: string | null
  price: number | null
  unit: 'kg'
  image: string | null
  category: ProductCategory
  available: boolean
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}