'use client'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'
import { columns } from './components/product-list/columns'
import { ArrowDown, ArrowUp, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Product, ProductParams, TableMeta } from './types'
import { TableToolbar } from './components/product-list/table-toolbar'
import { _productService } from './product.query'
import { Sheet, SheetContent } from '~/components/ui/core/sheet'
import ProductFormAction from './product-form-action'

const ProductTable = () => {
  const [editId, setEditId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  const debouncedSearch =
    (columnFilters.find((f) => f.id === 'search')?.value as string) || ''

  const params: ProductParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch || null,
    categoryId:
      (columnFilters.find((f) => f.id === 'categoryId')?.value as string) ||
      null,
    brandId:
      (columnFilters.find((f) => f.id === 'brandId')?.value as string) || null,
    minPrice:
      (columnFilters.find((f) => f.id === 'minPrice')?.value as number) || null,
    maxPrice:
      (columnFilters.find((f) => f.id === 'maxPrice')?.value as number) || null,
    sort:
      (columnFilters.find((f) => f.id === 'sort')?.value as string) || 'newest',
  }

  const { data: productsData, isLoading } = _productService.useProducts(params)
  const deleteProductMutation = _productService.useDeleteProduct()
  const deleteManyMutation = _productService.useDeleteManyProducts()
  const updateStatusMutation = _productService.useUpdateProductStatus()

  const data = (productsData?.result as any)?.data || []
  const pageCount = (productsData?.result as any)?.meta?.totalPages || 0

  const updateProductStatus = async (
    productId: string,
    columnId: 'isActive' | 'isFeatured',
    value: boolean,
  ) => {
    await updateStatusMutation.mutateAsync({
      id: productId,
      data: { [columnId]: value },
    })
  }

  const handleEdit = (id: string) => {
    setEditId(id)
    setIsSidebarOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProductMutation.mutateAsync(id)
    }
  }

  const handleBulkDelete = async () => {
    const ids = table.getSelectedRowModel().rows.map((row) => row.original.id)
    if (confirm(`Are you sure you want to delete ${ids.length} products?`)) {
      await deleteManyMutation.mutateAsync(ids)
      table.resetRowSelection()
    }
  }

  const table = useReactTable<Product>({
    data,
    columns,
    pageCount,
    meta: {
      updateProductStatus,
      onEdit: handleEdit,
      onDelete: handleDelete,
    } as TableMeta,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const selectedRows = table.getSelectedRowModel().rows

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between gap-4 mb-6'>
        <h1 className='text-3xl font-bold text-slate-800 tracking-tight'>
          Product Management
        </h1>
      </div>

      <TableToolbar
        filterValue={debouncedSearch}
        setFilter={(key, value) => {
          const otherFilters = columnFilters.filter((f) => f.id !== key)
          setColumnFilters(
            value !== null
              ? [...otherFilters, { id: key, value }]
              : otherFilters,
          )
        }}
        onReset={() => {
          setColumnFilters([])
          setPagination({ pageIndex: 0, pageSize: 10 })
        }}
        selectedRows={selectedRows}
        onDelete={handleBulkDelete}
        onAdd={() => {
          setEditId(null)
          setIsSidebarOpen(true)
        }}
      />

      <ScrollArea className='w-full rounded-2xl border overflow-hidden shadow-sm'>
        <table className='text-sm text-left w-full border-collapse'>
          <thead className='backdrop-blur-sm'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='p-4 font-semibold text-slate-600 border-b'
                  >
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'flex items-center gap-2 cursor-pointer select-none'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() && (
                        <span className='ml-1 text-slate-400'>
                          {header.column.getIsSorted() === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ArrowDown size={14} />
                          ) : (
                            <ChevronsUpDown size={14} className='opacity-30' />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='h-48 text-center border-b'
                >
                  <div className='flex flex-col items-center justify-center gap-3'>
                    <Loader2 className='animate-spin h-8 w-8 text-primary opacity-70' />
                    <span className='text-slate-500 font-medium'>
                      Loading products...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='h-48 text-center border-b'
                >
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <span className='text-slate-400 text-lg'>
                      No products found.
                    </span>
                    <Button variant='link' onClick={() => setColumnFilters([])}>
                      Clear all filters
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className='border-b  transition-colors duration-200'
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='p-4 align-middle'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      <div className='flex items-center justify-between py-6 px-2'>
        <div className='text-sm font-medium text-slate-500'>
          Showing <span className='text-slate-900'>{data.length}</span> products
          (Page{' '}
          <span className='text-slate-900'>
            {table.getState().pagination.pageIndex + 1}
          </span>{' '}
          of {table.getPageCount()})
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='bg-white shadow-sm'
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='bg-white shadow-sm'
          >
            Next
          </Button>
        </div>
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent className='sm:min-w-full lg:min-w-[75%] xl:min-w-[70%] overflow-y-auto p-0 border-l shadow-2xl'>
          <ProductFormAction
            productId={editId}
            onSuccess={() => {
              setIsSidebarOpen(false)
              setEditId(null)
            }}
            onCancel={() => {
              setIsSidebarOpen(false)
              setEditId(null)
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ProductTable
