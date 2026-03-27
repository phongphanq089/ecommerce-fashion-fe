'use client'

import { Plus, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/core/dialog'
import MultipleSelector, { Option } from '~/components/ui/core/multiselect'
import { ProductSchemaType } from '../../product.validate'
import { _collectionService } from '~/features/admin/collection/collection.query'
import { toast } from 'react-toastify'

const ProductCollections = () => {
  const { control } = useFormContext<ProductSchemaType>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')

  // 1. Lấy danh sách collection từ API
  const { data: collectionsRes, isLoading, refetch } = _collectionService.useCollections({ limit: 100 })
  const createCollectionMutation = _collectionService.useCreateCollection()

  const collectionOptions: Option[] = (collectionsRes?.result as any)?.data?.map((c: any) => ({
    label: c.name,
    value: c.id,
  })) || []

  // 2. Logic tạo nhanh collection
  const handleQuickAdd = async () => {
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name')
      return
    }

    try {
      await createCollectionMutation.mutateAsync({
        name: newCollectionName,
        slug: newCollectionName.toLowerCase().replace(/ /g, '-'),
        description: '',
        isActive: true,
      } as any)
      
      setNewCollectionName('')
      setIsDialogOpen(false)
      refetch() // Reload danh sách để hiện collection mới
    } catch (error) {
      console.error('Quick add failed:', error)
    }
  }

  return (
    <Card className='bg-muted shadow-none border-slate-200 dark:border-slate-800'>
      <CardHeader className='border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic'>
          Collections
        </CardTitle>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant='ghost' 
              size='icon' 
              className='h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all'
            >
              <Plus size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] bg-white dark:bg-slate-950'>
            <DialogHeader>
              <DialogTitle className='font-black tracking-tighter italic uppercase'>Quick Add Collection</DialogTitle>
              <DialogDescription className='text-slate-500'>
                Create a new collection on the fly. You can add details later.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name' className='font-bold'>Collection Name</Label>
                <Input
                  id='name'
                  placeholder='e.g. Summer Collection'
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className='col-span-3'
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleQuickAdd} 
                disabled={createCollectionMutation.isPending}
                className='w-full font-black'
              >
                {createCollectionMutation.isPending ? (
                  <Loader2 className='animate-spin mr-2' size={18} />
                ) : 'CREATE COLLECTION'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='space-y-4'>
          <Label className='text-xs font-black uppercase tracking-widest text-slate-500'>Select Target Collections</Label>
          <Controller
            control={control}
            name='collectionIds'
            render={({ field }) => (
              <MultipleSelector
                {...field}
                value={collectionOptions.filter(opt => field.value?.includes(opt.value))}
                onChange={(options) => {
                  field.onChange(options.map(opt => opt.value))
                }}
                defaultOptions={collectionOptions}
                placeholder={isLoading ? 'Loading collections...' : 'Search or select collections...'}
                className='bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                emptyIndicator={
                  <p className='text-center text-sm text-slate-500 py-2'>
                    {isLoading ? 'Fetching data...' : 'No collections found.'}
                  </p>
                }
              />
            )}
          />
        </div>
      </CardContent>

      <CardFooter className='border-t border-slate-200 dark:border-slate-800 px-6 py-4'>
        <p className='text-[10px] text-slate-500 leading-relaxed italic'>
          Add this product to multiple collections to increase visibility across categories.
        </p>
      </CardFooter>
    </Card>
  )
}

export default ProductCollections
