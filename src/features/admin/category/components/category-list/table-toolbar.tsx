/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Row } from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button, buttonVariants } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { Category } from '../../types'
import Link from 'next/link'

interface TableToolbarProps {
  filterValue: string
  setFilter: (key: string, value: string | boolean | undefined) => void
  selectedRows: any[] // Changed from Row<Category>[] to simplify if not using table
  onDelete: () => void
  onAdd: () => void
}

export function TableToolbar({
  filterValue,
  setFilter,
  selectedRows,
  onDelete,
  onAdd,
}: TableToolbarProps) {
  const [sort, setSort] = useState('newest')

  return (
    <div className='flex items-center justify-between flex-wrap mb-4 gap-4'>
      <div className='flex gap-2 items-center flex-1'>
        <Input
          placeholder='Search category...'
          value={filterValue || ''}
          onChange={(e) => setFilter('search', e.target.value)}
          className='max-w-[300px] bg-white'
        />

        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value)
            setFilter('sort', value)
          }}
        >
          <SelectTrigger className='w-[150px] bg-white'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='newest'>Newest</SelectItem>
              <SelectItem value='oldest'>Oldest</SelectItem>
              <SelectItem value='name_asc'>Name: A to Z</SelectItem>
              <SelectItem value='name_desc'>Name: Z to A</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-2'>
        {selectedRows.length > 0 && (
          <Button onClick={onDelete} variant={'destructive'}>
            <Trash2 className='mr-2 h-4 w-4' /> Delete ({selectedRows.length})
          </Button>
        )}
        <Button onClick={onAdd} className='bg-primary hover:bg-primary/90'>
          <Plus className='mr-2 h-4 w-4' /> Add Category
        </Button>
      </div>
    </div>
  )
}
