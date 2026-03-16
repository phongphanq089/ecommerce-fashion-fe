'use client'

import { Row } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { Brand } from '../../types'

interface TableToolbarProps {
  filterValue: string
  setFilter: (key: string, value: any) => void
  selectedRows: Row<Brand>[]
  onDelete: () => void
}

export function TableToolbar({
  filterValue,
  setFilter,
  selectedRows,
  onDelete,
}: TableToolbarProps) {
  const [sort, setSort] = useState('newest')

  return (
    <div className='flex items-center justify-between flex-wrap mb-4 gap-4'>
      <div className='flex gap-2 items-center '>
        <Input
          placeholder='Search brand...'
          value={filterValue || ''}
          onChange={(e) => setFilter('search', e.target.value)}
          className='min-w-[250px]'
        />

        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value)
            setFilter('sort', value)
          }}
        >
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='newest'>Newest</SelectItem>
              <SelectItem value='oldest'>Oldest</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-4'>
        <Button
          onClick={onDelete}
          disabled={selectedRows.length === 0}
          variant={'destructive'}
        >
          <Trash2 /> Delete ({selectedRows.length})
        </Button>
      </div>
    </div>
  )
}
