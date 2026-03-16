'use client'
import { useState } from 'react'
import { CollectionList } from './components/collection-list'
import { CollectionDetailForm } from './components/collection-details-form'
import { CollectionProducts } from './components/collection-products'
import { AddProductToCollection } from './components/add-product-to-collection'
import { _collectionService } from './collection.query'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/core/tabs'
import { Button } from '~/components/ui/core/button'
import {
  Trash2,
  AlertCircle,
  Loader2,
  Package,
  Settings,
  PlusSquare,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/core/alert'

export default function CollectionWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const {
    data: collectionRes,
    isLoading,
    refetch,
  } = _collectionService.useCollection(selectedId || '')
  const deleteMutation = _collectionService.useDeleteCollection()
  const updateMutation = _collectionService.useUpdateCollection()

  const collection = collectionRes?.result

  const handleDelete = async () => {
    if (
      selectedId &&
      confirm('Are you sure you want to delete this collection?')
    ) {
      await deleteMutation.mutateAsync(selectedId)
      setSelectedId(null)
    }
  }

  const handleRemoveProduct = async (productId: string) => {
    if (collection && confirm('Remove this product from collection?')) {
      const remainingIds = collection.products
        .filter((p) => p.id !== productId)
        .map((p) => p.id)

      await updateMutation.mutateAsync({
        id: collection.id,
        data: { productIds: remainingIds },
      })
    }
  }

  return (
    <div className='flex h-[calc(100vh-theme(spacing.20))] overflow-hidden bg-slate-50 rounded-2xl border shadow-xl'>
      <div className='w-80 flex-shrink-0 flex flex-col'>
        <CollectionList
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id)
            setIsAdding(false)
          }}
          onAdd={() => {
            setSelectedId(null)
            setIsAdding(true)
          }}
        />
      </div>

      <div className='flex-1 overflow-y-auto p-8'>
        {isAdding ? (
          <div className='max-w-4xl mx-auto space-y-6'>
            <div className='flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm'>
              <h1 className='text-3xl font-extrabold text-slate-800 italic'>
                NEW COLLECTION
              </h1>
              <Button variant='ghost' onClick={() => setIsAdding(false)}>
                CANCEL
              </Button>
            </div>
            <CollectionDetailForm onSuccess={() => setIsAdding(false)} />
          </div>
        ) : selectedId === null ? (
          <div className='h-full flex flex-col items-center justify-center text-slate-400 space-y-4'>
            <div className='h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center'>
              <Package size={48} className='text-slate-300' />
            </div>
            <div className='text-center'>
              <p className='text-xl font-bold text-slate-500'>
                Select a collection
              </p>
              <p className='text-sm'>
                or create a new one to start managing products.
              </p>
            </div>
            <Button
              onClick={() => setIsAdding(true)}
              variant='outline'
              className='mt-4 rounded-full px-8'
            >
              + CREATE NEW
            </Button>
          </div>
        ) : isLoading ? (
          <div className='h-full flex items-center justify-center'>
            <Loader2 className='animate-spin h-10 w-10 text-primary' />
          </div>
        ) : collection ? (
          <div className='max-w-6xl mx-auto space-y-8'>
            <div className='flex justify-between items-end gap-6 bg-white p-8 rounded-3xl border shadow-md border-b-4 border-b-primary/20 relative overflow-hidden'>
              <div className='relative z-10'>
                <p className='text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2'>
                  Editing Collection
                </p>
                <h1 className='text-5xl font-black text-slate-800 leading-tight'>
                  {collection.name}
                </h1>
                <p className='text-slate-400 mt-2 font-mono text-sm uppercase'>
                  ID: {collection.id}
                </p>
              </div>

              <div className='flex gap-3 relative z-10'>
                <Button
                  variant='outline'
                  className='border-red-500/20 text-red-500 hover:bg-red-50 rounded-2xl h-14 w-14'
                  size='icon'
                  onClick={handleDelete}
                >
                  <Trash2 size={24} />
                </Button>
              </div>

              {/* Decorative background element */}
              <div className='absolute right-[-20px] bottom-[-20px] opacity-[0.03] rotate-12'>
                <Package size={200} />
              </div>
            </div>

            <Tabs defaultValue='settings' className='w-full'>
              <TabsList className='bg-white p-1 rounded-2xl border shadow-sm h-16 w-fit mb-8'>
                <TabsTrigger
                  value='settings'
                  className='px-8 h-12 rounded-xl text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all'
                >
                  <Settings size={18} className='mr-2' /> SETTINGS
                </TabsTrigger>
                <TabsTrigger
                  value='products'
                  className='px-8 h-12 rounded-xl text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all'
                >
                  <Package size={18} className='mr-2' /> PRODUCTS (
                  {collection.products.length})
                </TabsTrigger>
                <TabsTrigger
                  value='add'
                  className='px-8 h-12 rounded-xl text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all'
                >
                  <PlusSquare size={18} className='mr-2' /> EXPLORE & ADD
                </TabsTrigger>
              </TabsList>

              <TabsContent value='settings' className='focus:outline-none'>
                <CollectionDetailForm
                  collection={collection}
                  onSuccess={refetch}
                />
              </TabsContent>

              <TabsContent value='products' className='focus:outline-none'>
                <CollectionProducts
                  products={collection.products}
                  onRemove={handleRemoveProduct}
                />
              </TabsContent>

              <TabsContent value='add' className='focus:outline-none'>
                <AddProductToCollection
                  collectionId={collection.id}
                  existingProductIds={collection.products.map((p) => p.id)}
                  onSuccess={refetch}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load collection details. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
