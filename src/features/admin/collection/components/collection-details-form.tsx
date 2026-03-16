'use client'
import { FormProvider } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Textarea } from '~/components/ui/core/textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '~/components/ui/core/form'
import { Switch } from '~/components/ui/core/switch'

import { useCollectionHookForm } from '../use-collection-hook-form'
import { useEffect } from 'react'
import { CollectionDetail } from '../types'
import { _collectionService } from '../collection.query'
import { Card, CardContent } from '~/components/ui/core/card'

interface CollectionDetailFormProps {
  collection?: CollectionDetail | null
  onSuccess: () => void
}

export const CollectionDetailForm = ({
  collection,
  onSuccess,
}: CollectionDetailFormProps) => {
  const form = useCollectionHookForm()
  const createMutation = _collectionService.useCreateCollection()
  const updateMutation = _collectionService.useUpdateCollection()

  useEffect(() => {
    if (collection) {
      form.reset({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        imageUrl: collection.imageUrl || '',
        isActive: collection.isActive,
      })
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        isActive: true,
      })
    }
  }, [collection, form])

  const onSubmit = async (data: any) => {
    if (collection) {
      await updateMutation.mutateAsync({ id: collection.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
    onSuccess()
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Card className='border shadow-sm'>
          <CardContent className='p-6 space-y-6'>
            <div className='grid grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Modern Summer' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder='modern-summer' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://image-url.com'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tell more about this collection...'
                      className='min-h-[120px]'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Active Status</FormLabel>
                    <div className='text-sm text-muted-foreground'>
                      Show this collection on the public website.
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className='flex justify-end gap-3'>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'SAVING...' : 'SAVE COLLECTION'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
