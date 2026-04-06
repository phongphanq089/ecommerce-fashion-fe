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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { categorySchema, CategorySchemaType } from '../category.validate'
import { _categoryService } from '../category.query'
import { generateRandomId, generateSlug } from '~/lib/utils'
import { toast } from 'react-toastify'
import { useMemo } from 'react'

interface AddCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId?: string | null
}

const AddCategoryModal = ({
  open,
  onOpenChange,
  categoryId,
}: AddCategoryModalProps) => {
  const isEdit = !!categoryId

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parentId: null,
    },
  })

  const { data: categoriesData } = _categoryService.useCategories()
  const { data: categoryDetail } = _categoryService.useCategory(
    categoryId || '',
  )
  const createCategoryMutation = _categoryService.useCategoryCreate()
  const updateCategoryMutation = _categoryService.useCategoryUpdate()

  useEffect(() => {
    if (categoryDetail?.result) {
      const { name, slug, parentId } = categoryDetail.result
      reset({
        name,
        slug,
        parentId: parentId || null,
      })
    } else if (!open) {
      reset({
        name: '',
        slug: '',
        parentId: null,
      })
    }
  }, [categoryDetail, reset, open])

  const name = watch('name')
  const randomId = useMemo(() => generateRandomId(), [])

  useEffect(() => {
    if (name && !isEdit) {
      setValue('slug', generateSlug(name, randomId), { shouldValidate: true })
    }
  }, [name, setValue, isEdit, randomId])

  const onSubmit = async (data: CategorySchemaType) => {
    try {
      if (isEdit && categoryId) {
        await updateCategoryMutation.mutateAsync({
          id: categoryId,
          payload: data,
        })
        toast.success('Category updated successfully')
      } else {
        await createCategoryMutation.mutateAsync(data)
        toast.success('Category created successfully')
      }
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} category`)
    }
  }

  const categories = categoriesData?.result || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Electronics, Clothing...'
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className='text-xs text-destructive'>{errors.name.message}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='slug'>Slug</Label>
            <Input
              id='slug'
              {...register('slug')}
              placeholder='electronics-clothing'
              aria-invalid={!!errors.slug}
            />
            {errors.slug && (
              <p className='text-xs text-destructive'>{errors.slug.message}</p>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='parentId'>Parent Category</Label>
            <Select
              onValueChange={(value) =>
                setValue('parentId', value === 'none' ? null : value)
              }
              defaultValue='none'
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select parent category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>None (Root)</SelectItem>
                {categories?.data?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update Category'
                  : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCategoryModal
