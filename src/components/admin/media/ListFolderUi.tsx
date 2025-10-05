'use client'

import { Edit, FolderClosed } from 'lucide-react'
import React, { useState } from 'react'
import { Label } from '~/components/ui/core/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/core/radio-group'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'
import { mockDataFolder } from '~/content/moc-data'
import AddFolder from './AddFolder'
import UpdateFolder from './UpdateFolder'

const ListFolderUi = () => {
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string
    name: string
  } | null>(null)

  const [open, setOpen] = useState(false)

  const handleUpdateValue = (id: string, value: string) => {
    console.log('update Folder', id, value)
  }

  return (
    <div className='space-y-5 w-full'>
      <div className='flex items-center gap-5 sm:gap-20'>
        <legend className='text-foreground text-sm leading-none font-medium whitespace-nowrap'>
          Select Folder
        </legend>
        <AddFolder />
      </div>

      <ScrollArea className='pb-5 w-full'>
        <RadioGroup
          className='inline-flex gap-3 sm:gap-6 min-w-max'
          // value={getCurrenId ?? ''}
          // onValueChange={handleFolderChange}
        >
          {mockDataFolder.map((item) => (
            <div
              key={`${item.id}-${item.name}`}
              className='border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none cursor-pointer min-w-[130px] sm:min-w-[150px]'
            >
              <div className='flex justify-between gap-2 cursor-pointer'>
                <RadioGroupItem
                  key={`${item.id}-${item.name}`}
                  value={item.name as string}
                  className='order-1 after:absolute after:inset-0 cursor-pointer'
                />
                <FolderClosed />
              </div>
              <Label htmlFor={`${item.id}-${item.name}`}>{item.name}</Label>

              <div className='absolute bottom-3 right-2'>
                <Edit
                  className='text-red-500 cursor-pointer'
                  size={18}
                  onClick={() => {
                    setSelectedFolder(item)
                    setOpen(true)
                  }}
                />
              </div>
            </div>
          ))}
        </RadioGroup>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <UpdateFolder
        open={open}
        setOpen={setOpen}
        folder={selectedFolder}
        handleUpdateValue={handleUpdateValue}
      />
    </div>
  )
}

export default ListFolderUi
