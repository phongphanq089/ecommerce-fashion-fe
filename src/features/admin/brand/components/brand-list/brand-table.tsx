'use client'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import {
  Edit,
  Trash2,
  MoreVertical,
  ShieldCheck,
  Globe,
  LayoutGrid,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Brand } from '../../types'
import { TableToolbar } from './table-toolbar'
import { _brandService } from '../../brand.query'
import { useDebounce } from '~/hooks/use-debounce'
import AddBrandModal from '../add-brand'
import { Badge } from '~/components/ui/core/badge'
import { Checkbox } from '~/components/ui/core/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/core/dropdown-menu'
import { cn } from '~/lib/utils'
import { toast } from 'react-toastify'

const BrandTable = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const debouncedSearch = useDebounce(globalFilter, 500)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12, // Increased for grid
  })

  const { data: brandResponse, isLoading } = _brandService.useBrands({
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch || null,
    sort:
      (columnFilters.find((f) => f.id === 'sort')?.value as any) || 'newest',
  })

  const deleteBrandMutation = _brandService.useBrandDelete()
  const deleteBrandsMutation = _brandService.useBrandsDelete()

  const data = useMemo(() => brandResponse?.result?.data || [], [brandResponse])
  const pageCount = brandResponse?.result?.meta?.totalPages || 0

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  const [editId, setEditId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const table = useReactTable<Brand>({
    data,
    columns: [], // Not needed for grid but required by hook
    pageCount,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id,
  })

  const selectedRows = table.getSelectedRowModel().rows

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrandMutation.mutateAsync(id)
        toast.success('Brand deleted successfully')
      } catch (error) {
        toast.error('Failed to delete brand')
      }
    }
  }

  const handleBulkDelete = async () => {
    const idsToDelete = selectedRows.map((row) => row.original.id)
    if (idsToDelete.length === 0) return

    if (
      confirm(`Are you sure you want to delete ${idsToDelete.length} brands?`)
    ) {
      try {
        await deleteBrandsMutation.mutateAsync(idsToDelete)
        table.resetRowSelection()
        toast.success('Brands deleted successfully')
      } catch (error) {
        toast.error('Failed to delete brands')
      }
    }
  }

  return (
    <div className='w-full bg-accent/30 p-4 md:p-8 min-h-screen rounded-[2.5rem]'>
      <div className='flex flex-col gap-6 max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-extrabold tracking-tight flex items-center gap-3'>
              <div className='p-2 bg-primary/10 rounded-xl'>
                <ShieldCheck className='h-8 w-8 text-primary' />
              </div>
              Brand Management
            </h1>
            <p className='text-muted-foreground text-sm font-medium'>
              Manage your store&apos;s brands, logos, and visibility settings.
            </p>
          </div>
        </div>

        <TableToolbar
          filterValue={globalFilter}
          setFilter={(key: string, value: any) => {
            if (key === 'search') {
              setGlobalFilter(String(value || ''))
            } else {
              const otherFilters = columnFilters.filter((f) => f.id !== key)
              const newFilters =
                value !== undefined
                  ? [...otherFilters, { id: key, value }]
                  : otherFilters
              setColumnFilters(newFilters)
            }
          }}
          selectedRows={selectedRows}
          onDelete={handleBulkDelete}
          onAdd={() => {
            setEditId(null)
            setIsAddModalOpen(true)
          }}
        />

        {isLoading ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'>
            {Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className='aspect-[4/5] rounded-3xl bg-white/50 animate-pulse border border-white'
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 bg-white/40 rounded-[2rem] border-2 border-dashed border-muted-foreground/10'>
            <div className='p-6 bg-muted/50 rounded-full mb-4'>
              <LayoutGrid className='h-12 w-12 text-muted-foreground/40' />
            </div>
            <h3 className='text-xl font-bold'>No Brands Found</h3>
            <p className='text-muted-foreground max-w-[250px] text-center mt-1'>
              Try adjusting your search or add a new brand to get started.
            </p>
            <Button
              variant='outline'
              className='mt-6 rounded-xl'
              onClick={() => setIsAddModalOpen(true)}
            >
              Add First Brand
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'>
            {data.map((brand) => {
              const isSelected = table.getRow(brand.id).getIsSelected()
              return (
                <div
                  key={brand.id}
                  className={cn(
                    'group relative flex flex-col items-center bg-white rounded-[2rem] p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 border-2',
                    isSelected
                      ? 'border-primary shadow-lg shadow-primary/5 bg-primary/[0.02]'
                      : 'border-transparent',
                  )}
                >
                  {/* Select Checkbox */}
                  <div className='absolute top-4 left-4 z-10'>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(val) =>
                        table.getRow(brand.id).toggleSelected(!!val)
                      }
                      className='rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                    />
                  </div>

                  {/* Quick Actions Dropdown */}
                  <div className='absolute top-3 right-3 z-10'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 rounded-full hover:bg-muted'
                        >
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='end'
                        className='rounded-xl w-40'
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setEditId(brand.id)
                            setIsAddModalOpen(true)
                          }}
                          className='gap-2 py-2 cursor-pointer'
                        >
                          <Edit className='h-4 w-4 text-primary' />
                          <span>Edit Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(brand.id)}
                          className='gap-2 py-2 cursor-pointer text-destructive focus:text-destructive'
                        >
                          <Trash2 className='h-4 w-4' />
                          <span>Remove</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Logo Container */}
                  <div className='relative w-full aspect-square rounded-2xl bg-muted/30 mb-4 p-4 flex items-center justify-center group-hover:bg-muted/50 transition-colors border border-muted-foreground/5'>
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className='w-full h-full object-contain drop-shadow-sm'
                      />
                    ) : (
                      <div className='flex flex-col items-center gap-1 text-muted-foreground/30'>
                        <Globe className='h-10 w-10' />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className='text-center w-full space-y-1'>
                    <h3 className='font-bold text-sm truncate px-2 text-foreground/90 uppercase tracking-tight'>
                      {brand.name}
                    </h3>
                    <div className='flex items-center justify-center gap-1.5'>
                      {brand.isActive ? (
                        <Badge
                          variant='outline'
                          className='h-5 bg-emerald-50 text-emerald-600 border-emerald-100 rounded-full text-[10px] uppercase font-bold py-0'
                        >
                          <CheckCircle2 className='h-2.5 w-2.5 mr-1 bg-emerald-600 rounded-full' />
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='h-5 bg-rose-50 text-rose-600 border-rose-100 rounded-full text-[10px] uppercase font-bold py-0'
                        >
                          <XCircle className='h-2.5 w-2.5 mr-1 bg-rose-600 rounded-full' />
                          Hidden
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Improved Pagination */}
        <div className='flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-white'>
          <div className='text-sm font-medium text-muted-foreground'>
            Showing{' '}
            <span className='text-foreground'>{pageIndex * pageSize + 1}</span>{' '}
            to{' '}
            <span className='text-foreground'>
              {Math.min(
                (pageIndex + 1) * pageSize,
                brandResponse?.result?.meta?.totalItems || 0,
              )}
            </span>{' '}
            of{' '}
            <span className='text-foreground'>
              {brandResponse?.result?.meta?.totalItems || 0}
            </span>{' '}
            brands
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='rounded-xl h-9 px-4 font-semibold'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className='flex gap-1 items-center px-2'>
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs font-bold transition-all',
                    pageIndex === i
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white hover:bg-muted text-muted-foreground',
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant='outline'
              size='sm'
              className='rounded-xl h-9 px-4 font-semibold'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AddBrandModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        brandId={editId}
      />
    </div>
  )
}

export default BrandTable
