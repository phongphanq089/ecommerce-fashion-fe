/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Edit, FolderClosed } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Label } from '~/components/ui/core/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/core/radio-group'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'

import AddFolder from './AddFolder'
import UpdateFolder from './UpdateFolder'
import { useQueryState } from 'nuqs'
import { _mediaService } from '~/service/queries/media'
import { LoadingUiFolder } from '../shared/LoadingUIFolder'
import { toast } from 'react-toastify'
import { useUiStore } from '~/store/useUiStore'

const ListFolderUi = () => {
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string
    name: string
  } | null>(null)

  const [open, setOpen] = useState(false)

  const [folderMedia, setFolderMedia] = useQueryState('folderMedia')

  const { data: mediaFolderData, isLoading } = _mediaService.useMediaFolder()

  const { setLoading } = useUiStore()

  const { mutate: updateFolder } = _mediaService.useMediaFolderUpdate()

  const { mutate: deleteFolder } = _mediaService.useMediaFolderDelete()

  const handleUpdateValue = (id: string, value: string) => {
    const payload = {
      id: id,
      name: value,
    }
    setLoading(true)
    updateFolder(payload, {
      onSuccess: () => {
        toast.success(`Update folder ${value} successfuly`)
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  const handleDeleteFolder = (id: string) => {
    setLoading(true)
    deleteFolder(id, {
      onSuccess: () => {
        toast.success(`Delete successfuly`)
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  const handleFolderChange = (id: string) => {
    setFolderMedia(id)
  }
  useEffect(() => {
    if (!folderMedia) {
      setFolderMedia(mediaFolderData?.result[0].id as string)
    }
  }, [folderMedia])

  return (
    <div className='space-y-5 w-full'>
      <div className='flex items-center gap-5 sm:gap-20'>
        <legend className='text-foreground text-sm leading-none font-medium whitespace-nowrap'>
          Select Folder
        </legend>
        <AddFolder />
      </div>

      <ScrollArea className='pb-5 w-full'>
        {isLoading ? (
          <LoadingUiFolder />
        ) : folderMedia === undefined ? (
          <LoadingUiFolder />
        ) : (
          <RadioGroup
            key={folderMedia}
            className='inline-flex gap-3 sm:gap-6 min-w-max'
            value={folderMedia ?? ''}
            onValueChange={handleFolderChange}
          >
            {mediaFolderData?.result.map((item) => (
              <div
                key={`${item.id}-${item.name}`}
                className='border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none cursor-pointer min-w-[130px] sm:min-w-[150px]'
              >
                <div className='flex justify-between gap-2 cursor-pointer'>
                  <RadioGroupItem
                    key={item.id}
                    value={item.id}
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
        )}

        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <UpdateFolder
        open={open}
        setOpen={setOpen}
        folder={selectedFolder}
        handleUpdateValue={handleUpdateValue}
        handleDeleteFolder={handleDeleteFolder}
      />
    </div>
  )
}

export default ListFolderUi
