'use client'
import { IconFileUploadFilled } from '@tabler/icons-react'
import { ImageIcon, Trash, UploadIcon, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '~/components/ui/core/button'
import { useFileUpload } from '~/hooks/use-file-upload'
import { useUiStore } from '~/store/useUiStore'
import { _mediaService } from '../media.query'
import { DisplayItem, FileItem, FileType } from '../types'
import { DEFAULT_FOLDER_MEDIA } from '~/constants'
import Pagination from '~/components/shared/pagination-ui'
import { LoadingUiMediaList } from './loading-ui-list'
import { MediaGrid } from './media-grid'

const maxSizeMB = 10
const maxSize = maxSizeMB * 1024 * 1024
const maxFiles = 6

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

  const [selectMedia, setSelectMedia] = useState<string[]>([])

  const { setLoading, uploadProgress, setUploadProgress, clearUploadProgress } =
    useUiStore()

  const [isSelectMedia, setIsSelectMedia] = useState<boolean>(false)

  const searchParams = useSearchParams()

  const folderMedia = searchParams.get('folderMedia') || ''

  const pageSize = searchParams.get('page') || 1

  const {
    data: mediaList,
    isLoading,
    refetch,
  } = _mediaService.useMediaFileList({
    folderId: folderMedia !== 'all' ? folderMedia : '',
    page: Number(pageSize),
  })

  const metadata = {
    total: mediaList?.result.total as number,
    page: mediaList?.result.page as number,
    limit: mediaList?.result.limit as number,
    totalPages: mediaList?.result.totalPages as number,
  }

  const { mutate: uploadFiles, isPending: isPendingUploadFiles } =
    _mediaService.useMediaUploadFiles()

  const { mutate: deleteFileSingle } = _mediaService.useMediaDeleteSingle()

  const { mutate: deleteFiles } = _mediaService.useMediaDeletes()

  const handleSelectMedia = (id: string) => {
    setSelectMedia((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  useEffect(() => {
    if (selectMedia.length > 0) {
      setIsSelectMedia(true)
    } else {
      setIsSelectMedia(false)
    }
  }, [selectMedia])

  const handleUploadMedia = async () => {
    uploadFiles(
      {
        files: files as FileItem[],
        folderId: folderMedia !== DEFAULT_FOLDER_MEDIA ? folderMedia : '',
        onProgress: (fileId: string, percent: number) => {
          setUploadProgress(fileId, percent)
        },
      },
      {
        onSuccess: async () => {
          // Wait for the query to finish refetching the updated media list
          // before clearing the local files to prevent UI flickering.
          await refetch()
          clearFiles()
          clearUploadProgress()
        },
      },
    )
  }

  const handleDeleteFileMutiple = async () => {
    setLoading(true)
    const payload = {
      ids: selectMedia,
    }
    deleteFiles(payload, {
      onSuccess: () => {
        if (!isLoading) {
          refetch()
          setSelectMedia([])
        }
      },
      onSettled: () => {
        setLoading(false)
      },
    })
  }

  const handleDeleteFileSingle = async (id: string) => {
    deleteFileSingle(id, {
      onSuccess: () => {
        if (!isLoading) {
          refetch()
        }
      },
    })
  }

  // ====== kết hợp giữa danh sách api trả về và các file tạm dưới client upload ======= //
  const displayItems: DisplayItem[] = [
    ...files.map((file) => ({
      clientId: file.id,
      preview: file.preview,
      fileId: file.id,
      altText: file.file.name,
      url: file.preview,
      id: file.id,
    })),
    ...(mediaList?.result.items ?? []).map((u: any) => ({
      clientId: '',
      preview: u.url,
      fileId: u.fileId ?? u.id ?? '',
      altText: (u.altText ?? '') as string,
      url: u.url,
      id: u.id,
      mediaType: u.fileType,
    })),
  ]

  useEffect(() => {
    if (errors) {
      toast.error(errors[0])
    }
  }, [errors])

  return (
    <div className='flex flex-col gap-2 mt-5'>
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
                {
                  <Button
                    variant={'secondary'}
                    onClick={clearFiles}
                    disabled={files.length === 0}
                  >
                    CleaFile
                    <X />
                  </Button>
                }

                <Button
                  disabled={!isSelectMedia}
                  onClick={handleDeleteFileMutiple}
                  variant='destructive'
                >
                  {selectMedia.length > 0
                    ? `Remove ${selectMedia.length} file`
                    : 'Remove 0 file'}

                  <Trash />
                </Button>

                <Button
                  variant='default'
                  onClick={handleUploadMedia}
                  disabled={files.length === 0 || isPendingUploadFiles}
                >
                  {isPendingUploadFiles
                    ? 'Uploading...'
                    : 'Upload Selected Files'}
                  <UploadIcon />
                </Button>
                <Button
                  onClick={openFileDialog}
                  disabled={files.length >= maxFiles}
                >
                  <IconFileUploadFilled
                    className='-ms-0.5 size-3.5 opacity-60'
                    aria-hidden='true'
                  />
                  Add File
                </Button>
              </div>
            </div>

            {/* Display Combined Media List */}
            {displayItems.length > 0 && (
              <div className='my-4'>
                {isLoading ? (
                  <LoadingUiMediaList count={12} />
                ) : (
                  <>
                    <MediaGrid
                      items={displayItems}
                      selectedIds={selectMedia}
                      uploadProgress={uploadProgress}
                      onSelect={(id) => handleSelectMedia(id)}
                      onRemove={(id, isClientId) => {
                        if (isClientId) {
                          removeFile(id)
                        } else {
                          handleDeleteFileSingle(id)
                        }
                      }}
                    />

                    {!isLoading && (
                      <Pagination
                        meta={metadata}
                        className='justify-center fixed bottom-0 left-1/2 min-md:left-[55%] -translate-x-1/2 z-50 bg-accent p-2 rounded-md main-container w-full'
                        variant='numbers'
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {isLoading ? (
              <LoadingUiMediaList count={12} />
            ) : (
              <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
                <div
                  className='bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
                  aria-hidden='true'
                >
                  <ImageIcon className='size-4 opacity-60' />
                </div>
                <p className='mb-1.5 text-sm font-medium'>
                  Drop your images here
                </p>
                <p className='text-muted-foreground text-xs'>
                  SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                </p>
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={openFileDialog}
                >
                  <UploadIcon className='-ms-1 opacity-60' aria-hidden='true' />
                  Select images
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MediaList
