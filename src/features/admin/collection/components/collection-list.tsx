'use client'
import { Loader2, Package, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { _collectionService } from '../collection.query'
import { cn } from '~/lib/utils'
import { ScrollArea } from '~/components/ui/core/scroll-area'

interface CollectionListProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAdd: () => void
}

export const CollectionList = ({
  selectedId,
  onSelect,
  onAdd,
}: CollectionListProps) => {
  const [search, setSearch] = useState('')
  const { data: collectionsRes, isLoading } = _collectionService.useCollections(
    { search },
  )

  const collections = collectionsRes?.result?.data || []

  return (
    <div className='flex flex-col h-full bg-slate-950/50 backdrop-blur-xl'>
      <div className='p-6 border-b border-slate-800 space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-black text-white tracking-tighter italic'>
            COLLECTIONS
          </h2>
          <Button
            size='icon'
            variant='ghost'
            onClick={onAdd}
            className='h-10 w-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all'
          >
            <Plus size={20} />
          </Button>
        </div>
        <div className='relative group'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors'
            size={18}
          />
          <Input
            placeholder='Search master...'
            className='pl-10 h-11 bg-slate-900/50 border-slate-800 rounded-xl focus:ring-primary focus:border-primary text-slate-200'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className='flex-1'>
        <div className='p-4 space-y-2'>
          {isLoading ? (
            <div className='flex justify-center p-8'>
              <Loader2 className='animate-spin h-6 w-6 text-slate-700' />
            </div>
          ) : collections.length === 0 ? (
            <div className='p-8 text-center text-slate-600 text-sm font-medium italic'>
              No collections found
            </div>
          ) : (
            collections.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  'w-full text-left p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                  selectedId === item.id
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                    : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800',
                )}
              >
                <div className='font-bold truncate relative z-10'>
                  {item.name}
                </div>
                <div
                  className={cn(
                    'text-[10px] mt-1 truncate font-mono uppercase tracking-widest relative z-10',
                    selectedId === item.id ? 'text-white/60' : 'text-slate-500',
                  )}
                >
                  {item.slug}
                </div>
                {selectedId === item.id && (
                  <div className='absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12'>
                    <Package size={60} />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
