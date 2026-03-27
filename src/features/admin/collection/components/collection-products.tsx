'use client'
import { Product } from '../../product/types'
import { ScrollArea } from '~/components/ui/core/scroll-area'
import { Package, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { cn } from '~/lib/utils'

interface CollectionProductsProps {
  products: Product[]
  onRemove: (productId: string) => void
}

export const CollectionProducts = ({
  products,
  onRemove,
}: CollectionProductsProps) => {
  return (
    <div className='bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500'>
      <div className='p-6 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <div className='h-8 w-1 bg-primary rounded-full' />
          <h3 className='font-black text-white uppercase tracking-wider'>
            Products In Collection ({products.length})
          </h3>
        </div>
      </div>
      <ScrollArea className='h-[500px]'>
        {products.length === 0 ? (
          <div className='p-20 text-center space-y-4'>
            <div className='h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-slate-700'>
              <Package size={32} className='text-slate-600' />
            </div>
            <p className='text-slate-500 font-medium italic'>
              No products assigned to this collection.
            </p>
          </div>
        ) : (
          <table className='w-full text-sm text-left border-collapse'>
            <thead className='bg-slate-900/80 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] sticky top-0 z-10 backdrop-blur-md'>
              <tr>
                <th className='p-5 border-b border-slate-800'>Product</th>
                <th className='p-5 border-b border-slate-800'>SKU</th>
                <th className='p-5 border-b border-slate-800'>Stock</th>
                <th className='p-5 border-b border-slate-800 text-right'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/50'>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className='group hover:bg-white/[0.02] transition-colors'
                >
                  <td className='p-5'>
                    <div className='flex items-center gap-4'>
                      <div className='relative h-14 w-14 flex-shrink-0 group-hover:scale-110 transition-transform duration-500'>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className='h-full w-full rounded-2xl object-cover border border-slate-700 shadow-2xl'
                        />
                        <div className='absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10' />
                      </div>
                      <div className='min-w-0'>
                        <span className='font-bold text-slate-200 block truncate max-w-[250px] group-hover:text-primary transition-colors'>
                          {product.name}
                        </span>
                        <span className='text-[10px] text-slate-500 font-mono uppercase tracking-tighter'>
                          {product.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='p-5 font-mono text-slate-500 text-xs italic'>
                    {product.slug}
                  </td>
                  <td className='p-5'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700'>
                      <div
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          product.stock > 0 ? 'bg-green-500' : 'bg-red-500',
                        )}
                      />
                      <span className='text-xs font-bold text-slate-300'>
                        {product.stock} in stock
                      </span>
                    </div>
                  </td>
                  <td className='p-5 text-right'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all'
                      onClick={() => onRemove(product.id)}
                    >
                      <Trash2 size={20} />
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
