'use client'
import { Plus, Search } from 'lucide-react'
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

export const CollectionList = ({ selectedId, onSelect, onAdd }: CollectionListProps) => {
  const [search, setSearch] = useState('')
  const { data: collectionsRes, isLoading } = _collectionService.useCollections({ search })

  const collections = collectionsRes?.result?.data || []

  return (
    <div className='flex flex-col h-full bg-white border-r'>
      <div className='p-4 border-b space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-slate-800'>Collections</h2>
          <Button size='icon' variant='ghost' onClick={onAdd} className='h-8 w-8 rounded-full bg-slate-50'>
            <Plus size={18} />
          </Button>
        </div>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
          <Input 
            placeholder='Search collections...' 
            className='pl-9 h-9 bg-slate-50 border-none rounded-lg'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className='flex-1'>
        <div className='p-2 space-y-1'>
          {isLoading ? (
            <div className='p-4 text-center text-slate-400 text-sm'>Loading...</div>
          ) : collections.length === 0 ? (
            <div className='p-4 text-center text-slate-400 text-sm'>No collections found</div>
          ) : (
            collections.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  'w-full text-left p-3 rounded-xl transition-all duration-200 group',
                  selectedId === item.id 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'hover:bg-slate-50 text-slate-600'
                )}
              >
                <div className='font-semibold truncate'>{item.name}</div>
                <div className={cn(
                  'text-xs mt-1 truncate',
                  selectedId === item.id ? 'text-white/70' : 'text-slate-400'
                )}>
                  {item.slug}
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
