'use client'
import { useState } from 'react'

import { Input } from '~/components/ui/core/input'
import { Button } from '~/components/ui/core/button'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Search, Loader2 } from 'lucide-react'
import { ScrollArea } from '~/components/ui/core/scroll-area'
import { _collectionService } from '../collection.query'
import { _productService } from '../../product/product.query'

interface AddProductToCollectionProps {
  collectionId: string
  existingProductIds: string[]
  onSuccess: () => void
}

export const AddProductToCollection = ({
  collectionId,
  existingProductIds,
  onSuccess,
}: AddProductToCollectionProps) => {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { data: productsRes, isLoading } = _productService.useProducts({
    search,
    limit: 100,
  })
  const addMutation = _collectionService.useAddProducts()

  const allProducts = productsRes?.result?.data || []
  const filteredProducts = allProducts.filter(
    (p) => !existingProductIds.includes(p.id),
  )

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleAdd = async () => {
    if (selectedIds.length === 0) return
    await addMutation.mutateAsync({ collectionId, productIds: selectedIds })
    setSelectedIds([])
    onSuccess()
  }

  return (
    <div className='flex flex-col h-full gap-4 p-6 bg-white rounded-xl border shadow-sm'>
      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-slate-800'>Assign Products</h3>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
            size={18}
          />
          <Input
            placeholder='Search products to add...'
            className='pl-10 h-11'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className='flex-1 border rounded-lg overflow-hidden'>
        {isLoading ? (
          <div className='flex items-center justify-center p-12'>
            <Loader2 className='animate-spin h-6 w-6 text-primary' />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='p-12 text-center text-slate-400'>
            No available products found.
          </div>
        ) : (
          <div className='divide-y'>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className='flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer'
                onClick={() => toggleProduct(product.id)}
              >
                <Checkbox
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                />
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className='h-12 w-12 rounded object-cover border'
                />
                <div className='flex-1 min-w-0'>
                  <div className='font-semibold text-slate-700 truncate'>
                    {product.name}
                  </div>
                  <div className='text-sm text-slate-400'>{product.slug}</div>
                </div>
                <div className='text-sm font-bold text-primary'>
                  ${product.variants?.[0]?.price || 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className='flex items-center justify-between pt-4 border-t mt-auto'>
        <span className='text-sm font-medium text-slate-500'>
          {selectedIds.length} products selected
        </span>
        <Button
          disabled={selectedIds.length === 0 || addMutation.isPending}
          onClick={handleAdd}
          className='min-w-[140px]'
        >
          {addMutation.isPending ? 'ADDING...' : 'ADD TO COLLECTION'}
        </Button>
      </div>
    </div>
  )
}
