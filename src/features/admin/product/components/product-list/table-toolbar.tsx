import { Row } from '@tanstack/react-table'
import { Plus, Trash2, Search, FilterX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, buttonVariants } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '~/components/ui/core/select'
import { Product } from '../../types'
import { _categoryService } from '~/features/admin/category/category.query'
import { _brandService } from '~/features/admin/brand/brand.query'
import Link from 'next/link'

interface TableToolbarProps {
  filterValue: string
  setFilter: (key: string, value: any) => void
  onReset: () => void
  selectedRows: Row<Product>[]
  onDelete: () => void
  onAdd: () => void
}

export function TableToolbar({
  filterValue,
  setFilter,
  onReset,
  selectedRows,
  onDelete,
  onAdd,
}: TableToolbarProps) {
  const { data: categoriesData } = _categoryService.useCategories()
  const { data: brandsData } = _brandService.useBrands()

  const categories = categoriesData?.result?.data || []
  const brands = brandsData?.result?.data || []

  return (
    <div className='flex flex-col gap-4 mb-6'>
      <div className='flex items-center justify-between flex-wrap gap-4'>
        <div className='flex flex-1 min-w-[300px] items-center gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search product name...'
              value={filterValue || ''}
              onChange={(e) => setFilter('search', e.target.value)}
              className='pl-9 bg-white'
            />
          </div>
          <Button variant='outline' onClick={onReset} className='gap-2'>
            <FilterX className='h-4 w-4' /> Reset
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            onClick={onDelete}
            disabled={selectedRows.length === 0}
            variant='destructive'
            className='gap-2'
          >
            <Trash2 className='h-4 w-4' /> Delete ({selectedRows.length})
          </Button>
          <Link
            className={buttonVariants({ variant: 'default' })}
            href={'/admin/product/create'}
          >
            <Plus className='h-4 w-4' /> Add Product
          </Link>
        </div>
      </div>

      <div className='flex items-center gap-3 flex-wrap'>
        <Select
          onValueChange={(val) =>
            setFilter('categoryId', val === 'all' ? null : val)
          }
        >
          <SelectTrigger className='bg-white'>
            <SelectValue placeholder='Select Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val) =>
            setFilter('brandId', val === 'all' ? null : val)
          }
        >
          <SelectTrigger className='bg-white'>
            <SelectValue placeholder='Select Brand' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Brands</SelectLabel>
              <SelectItem value='all'>All Brands</SelectItem>
              {brands.map((brand: any) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className='flex items-center gap-2'>
          <Input
            type='number'
            placeholder='Min price'
            onChange={(e) =>
              setFilter(
                'minPrice',
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className='bg-white'
          />
          <span className='text-muted-foreground'>-</span>
          <Input
            type='number'
            placeholder='Max price'
            onChange={(e) =>
              setFilter(
                'maxPrice',
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className='bg-white'
          />
        </div>

        <Select onValueChange={(val) => setFilter('sort', val)}>
          <SelectTrigger className='bg-white'>
            <SelectValue placeholder='Sort By' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sorting</SelectLabel>
              <SelectItem value='newest'>Newest</SelectItem>
              <SelectItem value='oldest'>Oldest</SelectItem>
              <SelectItem value='price-asc'>Price: Low to High</SelectItem>
              <SelectItem value='price-desc'>Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
