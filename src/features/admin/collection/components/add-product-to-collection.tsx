'use client'
import { useState, useMemo } from 'react'
import { Input } from '~/components/ui/core/input'
import { Button } from '~/components/ui/core/button'
import { Checkbox } from '~/components/ui/core/checkbox'
import {
  Search,
  Loader2,
  PlusSquare,
  Package,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react'
import { ScrollArea } from '~/components/ui/core/scroll-area'
import { _collectionService } from '../collection.query'
import { _productService } from '../../product/product.query'
import { cn } from '~/lib/utils'

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

  // 1. Gọi API lấy danh sách sản phẩm
  const {
    data: productsRes,
    isLoading,
    error,
  } = _productService.useProducts({
    search: search || null,
    page: 1,
    limit: 100,
  })

  const addMutation = _collectionService.useAddProducts()

  // 2. Trích xuất danh sách sản phẩm linh hoạt hơn
  const allProducts = useMemo(() => {
    const result = (productsRes as any)?.result
    if (!result) return []

    // Nếu result là mảng thì dùng luôn, nếu có trường data thì lấy data
    return Array.isArray(result) ? result : result.data || []
  }, [productsRes])

  // 3. Lọc sản phẩm (Chỉ hiển thị những sản phẩm CHƯA có trong collection)
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p: any) => !existingProductIds.includes(p.id))
  }, [allProducts, existingProductIds])

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredProducts.map((p: any) => p.id))
    }
  }

  const handleAdd = async () => {
    if (selectedIds.length === 0) return
    try {
      await addMutation.mutateAsync({ collectionId, productIds: selectedIds })
      setSelectedIds([])
      onSuccess()
    } catch (err) {
      console.error('Failed to add products:', err)
    }
  }

  return (
    <div className='flex flex-col h-[700px] gap-6 p-8 bg-slate-900/40 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500'>
      {/* Search Header */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div className='flex items-center gap-4'>
          <div className='h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/10'>
            <ShoppingBag size={24} className='text-primary' />
          </div>
          <div>
            <h3 className='text-2xl font-black text-white uppercase tracking-tighter leading-none italic'>
              Assign Products
            </h3>
            <p className='text-slate-500 text-xs italic font-medium mt-1 uppercase tracking-widest opacity-60'>
              Total Catalog: {allProducts.length} items
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='relative w-full md:w-80 group'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors'
              size={18}
            />
            <Input
              placeholder='Search by name...'
              className='pl-10 h-12 bg-slate-900/50 border-slate-800 rounded-2xl focus:ring-primary focus:border-primary text-slate-200'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredProducts.length > 0 && (
            <Button
              variant='outline'
              onClick={handleSelectAll}
              className='h-12 border-slate-700 text-slate-400 hover:text-white rounded-2xl font-black px-6 uppercase tracking-widest text-[10px] bg-slate-800/30'
            >
              {selectedIds.length === filteredProducts.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <ScrollArea className='flex-1 border border-slate-800 rounded-[2rem] bg-slate-950/40 overflow-hidden shadow-2xl'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center h-[400px] space-y-6'>
            <div className='relative'>
              <Loader2 className='animate-spin h-14 w-14 text-primary' />
              <div className='absolute inset-0 blur-2xl bg-primary/30 opacity-50' />
            </div>
            <p className='text-slate-500 font-mono text-xs uppercase tracking-[0.4em] animate-pulse'>
              Syncing Catalog...
            </p>
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center h-[400px] text-red-500 p-10'>
            <Package size={48} className='mb-4 opacity-20' />
            <p className='font-bold uppercase tracking-widest'>
              Failed to load products
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-[400px] text-center p-10 space-y-4'>
            <div className='h-24 w-24 bg-slate-800/20 rounded-[2.5rem] flex items-center justify-center border border-slate-700/30'>
              <Package size={40} className='text-slate-700' />
            </div>
            <div>
              <p className='text-white font-black text-xl tracking-tighter uppercase'>
                No Available Products
              </p>
              <p className='text-slate-500 font-medium italic text-sm mt-2 max-w-xs mx-auto'>
                {allProducts.length > 0
                  ? 'All products in your catalog are already assigned to this collection.'
                  : 'Your product catalog is empty. Please create some products first.'}
              </p>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6'>
            {filteredProducts.map((product: any) => (
              <div
                key={product.id}
                className={cn(
                  'group flex flex-col gap-4 p-5 rounded-[2rem] transition-all duration-500 border relative overflow-hidden cursor-pointer shadow-lg',
                  selectedIds.includes(product.id)
                    ? 'bg-primary/10 border-primary/50 shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-900/60',
                )}
                onClick={() => toggleProduct(product.id)}
              >
                <div className='flex items-start justify-between relative z-10'>
                  <div className='relative h-20 w-20 flex-shrink-0 group-hover:rotate-3 transition-transform duration-700'>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className='h-full w-full rounded-2xl object-cover border border-slate-700 bg-slate-800'
                    />
                    {selectedIds.includes(product.id) && (
                      <div className='absolute -top-2 -right-2 h-7 w-7 bg-primary rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl animate-in zoom-in'>
                        <CheckCircle2 size={14} className='text-white' />
                      </div>
                    )}
                  </div>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => toggleProduct(product.id)}
                    className='border-slate-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-6 w-6 rounded-lg'
                  />
                </div>

                <div className='space-y-1 relative z-10'>
                  <div
                    className={cn(
                      'font-black text-lg truncate tracking-tight transition-colors',
                      selectedIds.includes(product.id)
                        ? 'text-primary'
                        : 'text-slate-200 group-hover:text-white',
                    )}
                  >
                    {product.name}
                  </div>
                  <div className='flex items-center justify-between mt-3'>
                    <span className='text-xl font-black text-white italic tracking-tighter'>
                      ${product.variants?.[0]?.price || 0}
                    </span>
                    <div className='flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50'>
                      <div
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          product.stock > 0 ? 'bg-green-500' : 'bg-red-500',
                        )}
                      />
                      <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>
                        STK: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedIds.includes(product.id) && (
                  <div className='absolute right-[-15px] bottom-[-15px] opacity-[0.03] rotate-12 scale-150'>
                    <PlusSquare size={100} className='text-primary' />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Action Footer */}
      <div className='flex flex-col md:flex-row items-center justify-between p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800 backdrop-blur-md shadow-2xl relative overflow-hidden group border-b-4 border-b-primary/30'>
        <div className='flex items-center gap-6 mb-6 md:mb-0 relative z-10'>
          <div className='relative h-16 w-16'>
            <div className='absolute inset-0 bg-primary blur-xl opacity-30 animate-pulse' />
            <div className='relative h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 border border-white/20 group-hover:scale-110 transition-transform'>
              <span className='text-2xl font-black text-white italic'>
                {selectedIds.length}
              </span>
            </div>
          </div>
          <div>
            <p className='text-2xl font-black text-white tracking-tighter italic uppercase leading-none'>
              Ready to Assign
            </p>
            <p className='text-slate-500 text-sm font-medium mt-1 italic'>
              Expanding catalog with {selectedIds.length} items.
            </p>
          </div>
        </div>

        <Button
          disabled={selectedIds.length === 0 || addMutation.isPending}
          onClick={handleAdd}
          className='w-full md:w-auto min-w-[300px] h-16 rounded-2xl font-black tracking-[0.25em] uppercase shadow-2xl shadow-primary/40 hover:scale-[1.05] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale overflow-hidden relative group'
        >
          {addMutation.isPending ? (
            <div className='flex items-center gap-3'>
              <Loader2 className='animate-spin h-6 w-6 text-white' />
              <span>SYNCHRONIZING...</span>
            </div>
          ) : (
            'CONFIRM & ADD TO COLLECTION'
          )}
        </Button>
      </div>
    </div>
  )
}
