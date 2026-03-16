export type Variant = {
  sku: string
  price: number
  stock: number
  purchasePrice: number
  lowStockQuantity?: number
  attributes: {
    name: string
    value: string
  }[]
}

export type Product = {
  id: string
  name: string
  slug: string
  description?: string
  summary?: string
  type: 'SINGLE' | 'VARIANT'
  imageUrl?: string
  thumbnailId?: string
  category: { id: string; name: string }
  brand: { id: string; name: string }
  stock: number
  isFeatured: boolean
  isActive: boolean
  isRefunded: boolean
  hasWarranty: boolean
  unit?: string
  condition?: string
  createdAt: string
  updatedAt: string
  variants: Variant[]
}

export type ProductParams = {
  page?: number
  limit?: number
  search?: string | null
  categoryId?: string | null
  brandId?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  sort?: string | null
}

export type TableMeta = {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  updateProductStatus: (
    productId: string,
    columnId: 'isActive' | 'isFeatured',
    value: boolean
  ) => void
}
