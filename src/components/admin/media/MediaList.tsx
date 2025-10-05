'use client'

import { CheckIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '~/components/ui/core/button'
import { listMedia } from '~/content/moc-data'
import { useFileUpload } from '~/hooks/use-file-upload'

const maxSizeMB = 20
const maxSize = maxSizeMB * 1024 * 1024
const maxFiles = 6

type FileItem = {
  file: File
  id: string
  preview: string
}
type DisplayItem = {
  clientId?: string
  preview?: string
  fileId: string
  altText: string
  url?: string
  id?: string
}

const MediaList = () => {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      clearFiles,
    },
  ] = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
    maxSize,
    multiple: true,
    maxFiles,
  })

  const displayItems: DisplayItem[] = [
    // ==== Use preview as url for display  ======= //
    ...files.map((file) => ({
      clientId: file.id,
      preview: file.preview,
      fileId: file.id,
      altText: file.file.name,
      url: file.preview,
      id: file.id,
    })),
    ...listMedia.map((u) => ({
      clientId: '',
      preview: u.url,
      fileId: u.fileId ?? u.id ?? '',
      altText: (u.altText ?? '') as string,
      url: u.url,
      id: u.id,
    })),
  ]
  return (
    <div className='flex flex-col gap-2'>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className='border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]'
      >
        <input
          {...getInputProps()}
          className='sr-only'
          aria-label='Upload image file'
        />
        {files.length > 0 || displayItems.length > 0 ? (
          <div className='flex w-full flex-col gap-3'>
            <div className='flex items-center justify-between gap-3 flex-wrap'>
              <h3 className='truncate text-sm font-medium'>
                Uploaded Files ({files.length})
              </h3>

              <div className='flex items-center gap-2 flex-wrap'>
                {/* <Button
                  disabled={!isSelectImage}
                  onClick={handleDeleteManyMedia}
                  variant='outline'
                >
                  {selectImage.length > 0
                    ? `Remove ${selectImage.length} file`
                    : 'Remove 0 file'}
                </Button> */}

                {/* <Button
                  variant='outline'
                  onClick={handleUploadMedia}
                  disabled={uploading || files.length === 0}
                >
                  Upload Selected Files
                </Button> */}
                <Button
                  size='sm'
                  onClick={openFileDialog}
                  disabled={files.length >= maxFiles}
                >
                  <UploadIcon
                    className='-ms-0.5 size-3.5 opacity-60'
                    aria-hidden='true'
                  />
                  Add more
                </Button>
              </div>
            </div>

            {/* Display Combined Media List */}
            {displayItems.length > 0 && (
              <div className='my-4'>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4 mt-2'>
                  {displayItems.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className='bg-accent relative aspect-square rounded-md mb-5'
                      >
                        <div className='absolute -top-2 right-0 p-1 rounded-md flex items-center gap-3 bg-white shadow-2xl'>
                          {!item.clientId ? (
                            <label className='border-gray-800 bg-primary text-gray-700 has-data-[state=checked]:border-primary-color has-data-[state=checked]:bg-primary-color has-data-[state=checked]:text-white has-focus-visible:border-ring has-focus-visible:ring-ring/50 flex size-5 cursor-pointer flex-col items-center justify-center gap-3 rounded-sm border text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50'>
                              {/* <Checkbox
                                className='sr-only after:absolute after:inset-0'
                                checked={selectImage.includes(
                                  item.id as string
                                )}
                                onCheckedChange={() =>
                                  // handleSelectImage(item.id as string)
                                }
                              /> */}
                              <span
                                aria-hidden='true'
                                className='text-sm font-medium'
                              >
                                <CheckIcon className='size-3' />
                              </span>
                            </label>
                          ) : (
                            ''
                          )}
                          <Button
                            onClick={() => {
                              if (item.clientId) {
                                removeFile(item.clientId)
                              } else {
                                // handleDeleteMedia(item.id as string)
                              }
                            }}
                            size='icon'
                            className='focus-visible:border-background  size-6 rounded-full border-2 shadow-none'
                            aria-label='Remove image'
                          >
                            <XIcon className='size-3.5' />
                          </Button>
                        </div>

                        <Image
                          src={item.preview || item.url || ''}
                          alt={item.altText || item.fileId}
                          className='size-full rounded-[inherit] object-cover'
                          width={500}
                          height={500}
                        />
                        {/* {uploading && item.clientId && (
                          <div className='absolute inset-0 flex items-center justify-center bg-black/50 text-white'>
                            Uploading...
                          </div>
                        )} */}
                        {/* {item.clientId && (
                          <div className='absolute bottom-0 left-0 right-0 h-4 bg-black/50'>
                            <div
                              className='h-full bg-orange-600'
                              style={{
                                width: `${progress[item.clientId] || 0}%`,
                              }}
                            />
                          </div>
                        )} */}
                      </div>
                    )
                  })}
                </div>
                {/*
                <Pagination
                  meta={meta}
                  className='justify-center'
                  variant='numbers'
                /> */}

                <h3 className='text-sm font-medium mt-6 text-center'>
                  All Media ({displayItems.length})
                </h3>
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
            <div
              className='bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
              aria-hidden='true'
            >
              <ImageIcon className='size-4 opacity-60' />
            </div>
            <p className='mb-1.5 text-sm font-medium'>Drop your images here</p>
            <p className='text-muted-foreground text-xs'>
              SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
            </p>
            <Button variant='outline' className='mt-4' onClick={openFileDialog}>
              <UploadIcon className='-ms-1 opacity-60' aria-hidden='true' />
              Select images
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaList
