'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Switch } from '~/components/ui/core/switch'
import { brandSchema, BrandSchemaType } from '../brand.validate'
import { _brandService } from '../brand.query'
import { generateSlug } from '~/lib/utils'
import { toast } from 'react-toastify'

interface AddBrandModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brandId?: string | null
}

const AddBrandModal = ({
  open,
  onOpenChange,
  brandId,
}: AddBrandModalProps) => {
  const isEdit = !!brandId

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      slug: '',
      logoUrl: null,
      isActive: true,
    },
  })

  const { data: brandDetail } = _brandService.useBrand(brandId || '')
  const createBrandMutation = _brandService.useBrandCreate()
  const updateBrandMutation = _brandService.useBrandUpdate()

  useEffect(() => {
    if (brandDetail?.result) {
      const { name, slug, logoUrl, isActive } = brandDetail.result
      reset({
        name,
        slug,
        logoUrl: logoUrl || null,
        isActive: isActive ?? true,
      })
    } else if (!open) {
      reset({
        name: '',
        slug: '',
        logoUrl: null,
        isActive: true,
      })
    }
  }, [brandDetail, reset, open])

  const name = watch('name')

  useEffect(() => {
    if (name && !isEdit) {
      setValue('slug', generateSlug(name), { shouldValidate: true })
    }
  }, [name, setValue, isEdit])

  const onSubmit = async (data: BrandSchemaType) => {
    try {
      if (isEdit && brandId) {
        await updateBrandMutation.mutateAsync({ id: brandId, payload: data })
        toast.success('Brand updated successfully')
      } else {
        await createBrandMutation.mutateAsync(data)
        toast.success('Brand created successfully')
      }
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} brand`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Nike, Adidas...'
              aria-invalid={!!errors.name}
            />
            {errors.name?.message && (
              <p className='text-xs text-destructive'>{String(errors.name.message)}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='slug'>Slug</Label>
            <Input
              id='slug'
              {...register('slug')}
              placeholder='nike-adidas'
              aria-invalid={!!errors.slug}
            />
            {errors.slug?.message && (
              <p className='text-xs text-destructive'>{String(errors.slug.message)}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='logoUrl'>Logo URL (Optional)</Label>
            <Input
              id='logoUrl'
              {...register('logoUrl')}
              placeholder='https://...'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Switch
              id='isActive'
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor='isActive'>Active Status</Label>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                ? 'Update Brand'
                : 'Create Brand'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddBrandModal
