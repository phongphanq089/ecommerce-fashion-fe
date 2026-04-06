import { IconEdit, IconTrash } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Category, TableMeta } from '../../types'
import { Switch } from '~/components/ui/core/switch'

export const columns: ColumnDef<Category>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
          }
          onCheckedChange={(val) => table.toggleAllRowsSelected(!!val)}
          aria-label='Select all'
        />
      )
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'parent.name',
    header: 'Parent',
    cell: ({ row }) => row.original.parent?.name || 'Root',
  },
  {
    accessorKey: 'Action',
    header: 'Action',
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta
      return (
        <div className='flex items-center gap-3'>
          <div
            className='border border-red-500 text-red-500 p-2 rounded-xl cursor-pointer'
            onClick={() => meta.onDelete(row.original.id)}
          >
            <IconTrash />
          </div>
          <div
            className='border bg-primary p-2 text-white rounded-xl cursor-pointer'
            onClick={() => meta.onEdit(row.original.id)}
          >
            <IconEdit />
          </div>
        </div>
      )
    },
  },
]
