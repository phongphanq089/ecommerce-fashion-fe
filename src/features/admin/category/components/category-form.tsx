'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/core/card'
import { categorySchema, CategorySchemaType } from '../category.validate'
import { _categoryService } from '../category.query'
import { generateSlug } from '~/lib/utils'
import { toast } from 'react-toastify'

interface CategoryFormProps {
  categoryId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
}

const CategoryForm = ({ categoryId, onSuccess, onCancel }: CategoryFormProps) => {
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
  const { data: categoryDetail } = _categoryService.useCategory(categoryId || '')
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
    } else {
      reset({
        name: '',
        slug: '',
        parentId: null,
      })
    }
  }, [categoryDetail, reset, categoryId])

  const name = watch('name')

  useEffect(() => {
    if (name && !isEdit) {
      setValue('slug', generateSlug(name), { shouldValidate: true })
    }
  }, [name, setValue, isEdit])

  const onSubmit = async (data: CategorySchemaType) => {
    try {
      if (isEdit && categoryId) {
        await updateCategoryMutation.mutateAsync({ id: categoryId, payload: data })
        toast.success('Category updated successfully')
      } else {
        await createCategoryMutation.mutateAsync(data)
        toast.success('Category created successfully')
      }
      reset()
      onSuccess?.()
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} category`)
    }
  }

  const categories = categoriesData?.result?.data || []

  return (
    <Card className='bg-muted shadow-none h-fit'>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Electronics, Clothing...'
              aria-invalid={!!errors.name}
              className='bg-white'
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
              className='bg-white'
            />
            {errors.slug && (
              <p className='text-xs text-destructive'>{errors.slug.message}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='parentId'>Parent Category</Label>
            <Select
              onValueChange={(value) =>
                setValue('parentId', value === 'none' ? null : value)
              }
              value={watch('parentId') || 'none'}
            >
              <SelectTrigger className='bg-white'>
                <SelectValue placeholder='Select parent category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>None (Root)</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2 pt-2'>
            <Button type='submit' className='flex-1' disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                ? 'Update Category'
                : 'Create Category'}
            </Button>
            {isEdit && (
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CategoryForm
