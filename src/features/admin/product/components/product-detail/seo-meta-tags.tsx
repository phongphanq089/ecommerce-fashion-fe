'use client'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Trash, UploadCloud } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Textarea } from '~/components/ui/core/textarea'
import { MediaPickerModal } from '~/features/admin/media/components'
import { MediaItem } from '~/features/admin/media/types'
import { cn } from '~/lib/utils'
import { ProductSchemaType } from '../../product.validate'

const SeoMetaTags = () => {
  const { register, setValue, watch, getValues } = useFormContext<ProductSchemaType>()
  const [metaImage, setMetaImage] = useState<MediaItem | null>(null)

  const watchMetaImageId = watch('metaImageId')

  useEffect(() => {
    const values = getValues() as any
    if (values.metaImage && !metaImage) {
      setMetaImage(values.metaImage)
    }
  }, [watchMetaImageId, getValues, metaImage])

  const handleSelectMedia = (items: MediaItem[]) => {
    if (items.length > 0) {
      setMetaImage(items[0])
      setValue('metaImageId', items[0].id)
      setValue('metaImage', items[0])
    }
  }

  const handleRemoveImage = () => {
    setMetaImage(null)
    setValue('metaImageId', null)
    setValue('metaImage', null)
  }

  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>Seo Meta Tags</CardHeader>
      <CardContent className='space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>Meta Title</Label>
          </div>
          <Input
            {...register('metaTitle')}
            placeholder='Meta Title'
            type='text'
            className='bg-white'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>Meta Description</Label>
          </div>

          <Textarea
            {...register('metaDescription')}
            placeholder='Meta Description'
            className='bg-white'
          />
        </div>

        <div className='flex flex-col gap-3'>
          <div>
            <Label className='text-lg font-medium text-gray-700 dark:text-gray-200'>
              Meta Image
            </Label>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Main image for SEO purposes. (Recommended: 1200x630 px)
            </p>
          </div>

          <div className='flex flex-col items-start gap-3 w-full'>
            {metaImage ? (
              <div className='relative w-full aspect-[1200/630] max-h-[200px] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden'>
                <img
                  src={metaImage.url}
                  alt={metaImage.altText || 'Meta Image'}
                  className='w-full h-full object-cover'
                />
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full'
                  onClick={handleRemoveImage}
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 text-gray-500 transition-colors hover:border-primary dark:bg-muted dark:hover:border-primary h-36 w-full',
                )}
              >
                <UploadCloud className='h-8 w-8 text-gray-400' />
                <span className={cn('mt-2 font-medium text-center px-2')}>
                  Choose Image
                </span>
              </div>
            )}

            <MediaPickerModal
              onSelect={handleSelectMedia}
              trigger={
                <Button
                  variant={'ghost'}
                  className='text-base font-medium text-primary transition-colors mx-auto'
                >
                  {metaImage ? 'Change Image' : 'Choose File'}
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SeoMetaTags
