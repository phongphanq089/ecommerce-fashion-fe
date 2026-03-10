import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { ProductSchemaType } from '../../product.validate'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import MultipleSelector, { Option } from '~/components/ui/core/multiselect'
import { FieldError } from '~/components/ui/core/field'

const ProductInfoForm = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()

  const categories = [
    { value: 'xpmgpi1qi05nl2d0ygir8zsj', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'books', label: 'Books' },
  ]

  const brands = [
    { value: 'apple', label: 'Apple' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'ikea', label: 'IKEA' },
    { value: 'nike', label: 'Nike' },
  ]

  const frameworks: Option[] = [
    {
      value: 'sale',
      label: 'Sale',
    },
    {
      value: 'new',
      label: 'New',
    },
    {
      value: 'hot',
      label: 'Hot',
    },
    {
      value: 'limited',
      label: 'Limited',
    },
  ]

  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>
        Product Information
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Name <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Input
            {...register('name')}
            placeholder='Product Name'
            type='text'
            required
            className='bg-white'
            aria-invalid={errors.name && errors.name.message ? true : false}
            errorMessage={errors.name?.message}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Categories <span className='text-destructive'>*</span>
            </Label>
          </div>
          <div className='flex flex-col gap-2'>
            <Controller
              control={control}
              name='categoryId'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className='w-full bg-white'
                    aria-invalid={
                      errors.categoryId && errors.categoryId.message
                        ? true
                        : false
                    }
                  >
                    <SelectValue placeholder='Select Categories' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError className='pl-2'>
              {errors.categoryId?.message}
            </FieldError>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Brand <span className='text-destructive'>*</span>
            </Label>
          </div>
          <div className='flex flex-col gap-2'>
            <Controller
              control={control}
              name='brandId'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className='w-full bg-white'
                    aria-invalid={
                      errors.brandId && errors.brandId.message ? true : false
                    }
                  >
                    <SelectValue placeholder='Select Brands' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Brands</SelectLabel>
                      {brands.map((brand) => (
                        <SelectItem key={brand.value} value={brand.value}>
                          {brand.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError className='pl-2'>{errors.brandId?.message}</FieldError>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Tags <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Controller
            control={control}
            name='tags'
            render={({ field }) => (
              <MultipleSelector
                {...field}
                className='bg-white dark:bg-accent'
                commandProps={{
                  label: 'Select Tags',
                }}
                defaultOptions={frameworks}
                placeholder='Select Tags'
                hideClearAllButton
                hidePlaceholderWhenSelected
                emptyIndicator={
                  <p className='text-center text-sm'>No results found</p>
                }
                onChange={(options) => {
                  field.onChange(options.map((o) => o.value))
                }}
                value={frameworks.filter((f) => field.value?.includes(f.value))}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductInfoForm
