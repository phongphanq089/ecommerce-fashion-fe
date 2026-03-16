'use client'
import { Product } from '../../product/types'
import { ScrollArea } from '~/components/ui/core/scroll-area'
import { Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/core/button'

interface CollectionProductsProps {
  products: Product[]
  onRemove: (productId: string) => void
}

export const CollectionProducts = ({ products, onRemove }: CollectionProductsProps) => {
  return (
    <div className='bg-white rounded-xl border shadow-sm overflow-hidden'>
      <div className='p-4 bg-slate-50 border-b flex justify-between items-center'>
        <h3 className='font-semibold text-slate-700'>Products In Collection ({products.length})</h3>
      </div>
      <ScrollArea className='h-[500px]'>
        {products.length === 0 ? (
          <div className='p-12 text-center text-slate-400'>
            No products assigned to this collection.
          </div>
        ) : (
          <table className='w-full text-sm text-left'>
            <thead className='bg-slate-50 text-slate-500 font-medium border-b sticky top-0 z-10'>
              <tr>
                <th className='p-4'>Product</th>
                <th className='p-4'>SKU</th>
                <th className='p-4'>Stock</th>
                <th className='p-4 text-right'>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className='border-b hover:bg-slate-50 transition-colors'>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className='h-10 w-10 rounded object-cover border'
                      />
                      <span className='font-medium text-slate-700 truncate max-w-[200px]'>
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className='p-4 text-slate-500'>{product.slug}</td>
                  <td className='p-4 text-slate-500'>{product.stock}</td>
                  <td className='p-4 text-right'>
                    <Button 
                      variant='ghost' 
                      size='icon' 
                      className='text-red-500 hover:text-red-700 hover:bg-red-50'
                      onClick={() => onRemove(product.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ScrollArea>
    </div>
  )
}
