import React, { useEffect } from 'react'
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
import { generateSlug } from '~/lib/utils'
import { Button } from '~/components/ui/core/button'
import { _categoryService } from '~/features/admin/category/category.query'
import AddCategoryModal from '~/features/admin/category/components/add-category'
import { _brandService } from '~/features/admin/brand/brand.query'
import AddBrandModal from '~/features/admin/brand/components/add-brand'

const ProductInfoForm = () => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] =
    React.useState(false)
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = React.useState(false)
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()

  const name = watch('name')

  useEffect(() => {
    if (name) {
      setValue('slug', generateSlug(name), { shouldValidate: true })
    }
  }, [name, setValue])

  const { data: categoriesData, isLoading: isLoadingCategories } =
    _categoryService.useCategories()

  const { data: brandsData, isLoading: isLoadingBrands } =
    _brandService.useBrands()

  const categories = categoriesData?.result || []
  const brands = brandsData?.result || []

  const PRODUCT_TAG_OPTIONS: Option[] = [
    { value: 'sale', label: 'Sale' },
    { value: 'new', label: 'New' },
    { value: 'hot', label: 'Hot' },
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
              Slug <span className='text-destructive'>*</span>
            </Label>
          </div>
          <Input
            {...register('slug')}
            placeholder='product-slug'
            type='text'
            required
            className='bg-white'
            aria-invalid={errors.slug && errors.slug.message ? true : false}
            errorMessage={errors.slug?.message}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Categories <span className='text-destructive'>*</span>
            </Label>
          </div>
          <div className='flex item-center  gap-2'>
            <div className='flex flex-col gap-2 flex-1'>
              <Controller
                control={control}
                name='categoryId'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger
                      className='w-full bg-white'
                      aria-invalid={
                        errors.categoryId && errors.categoryId.message
                          ? true
                          : false
                      }
                    >
                      <SelectValue
                        placeholder={
                          isLoadingCategories
                            ? 'Loading categories...'
                            : 'Select Categories'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories?.data?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
            <Button
              type='button'
              variant='outline'
              className='h-fit'
              onClick={() => setIsAddCategoryModalOpen(true)}
            >
              Add Category
            </Button>
          </div>
        </div>

        <AddCategoryModal
          open={isAddCategoryModalOpen}
          onOpenChange={setIsAddCategoryModalOpen}
        />

        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>
              Brand <span className='text-destructive'>*</span>
            </Label>
          </div>

          <div className='flex item-center  gap-2'>
            <div className='flex flex-col gap-2 flex-1'>
              <Controller
                control={control}
                name='brandId'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={isLoadingBrands}
                  >
                    <SelectTrigger
                      className='w-full bg-white'
                      aria-invalid={
                        errors.brandId && errors.brandId.message ? true : false
                      }
                    >
                      <SelectValue
                        placeholder={
                          isLoadingBrands ? 'Loading brands...' : 'Select Brand'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Brands</SelectLabel>
                        {brands?.data?.map((brand: any) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError className='pl-2'>
                {errors.brandId?.message}
              </FieldError>
            </div>
            <Button
              type='button'
              variant='outline'
              className='h-fit'
              onClick={() => setIsAddBrandModalOpen(true)}
            >
              Add Brand
            </Button>
          </div>
        </div>

        <AddBrandModal
          open={isAddBrandModalOpen}
          onOpenChange={setIsAddBrandModalOpen}
        />

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
                className='bg-white dark:bg-muted'
                commandProps={{
                  label: 'Select Tags',
                }}
                defaultOptions={PRODUCT_TAG_OPTIONS}
                placeholder='Select Tags'
                hideClearAllButton
                hidePlaceholderWhenSelected
                emptyIndicator={
                  <p className='text-center text-sm'>No results found</p>
                }
                onChange={(options) => {
                  field.onChange(options.map((o) => o.value))
                }}
                value={PRODUCT_TAG_OPTIONS.filter((f: Option) => field.value?.includes(f.value))}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductInfoForm
