'use client'
import { FormProvider, useFormContext } from 'react-hook-form'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
import { useEffect } from 'react'
import {
  ProductCollections,
  ProductDescription,
  ProductDiscount,
  ProductFeatured,
  ProductImages,
  ProductInfoForm,
  ProductRefundable,
  ProductStockQuantity,
  ProductVariantForm,
  ProductWarranty,
  SeoMetaTags,
  ShippingConfiguration,
} from './components'
import { useProductHookForm } from './use-product-hook-form'
import { _productService } from './product.query'

interface ProductFormActionProps {
  productId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
}

const ProductFormAction = ({ productId, onSuccess, onCancel }: ProductFormActionProps) => {
  const { data: productDetail, isLoading } = _productService.useProduct(productId || '')
  const form = useProductHookForm()

  useEffect(() => {
    if (productDetail?.result) {
      form.reset({
        ...productDetail.result,
        variants: (productDetail.result as any).variants || [],
      } as any)
    } else if (!productId) {
      form.reset({
        type: 'SINGLE',
        isFeatured: false,
        isRefunded: false,
        hasWarranty: false,
        disableShipping: false,
        collectionIds: [],
        mediaIds: [],
        tags: [],
        variants: [],
      })
    }
  }, [productDetail, productId, form])

  if (productId && isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <Card className='border-none shadow-none bg-transparent'>
        <CardHeader className='px-6 pt-6 pb-2'>
          <HeadingSectionAdmin title={productId ? `Edit Product: ${productDetail?.result?.name || ''}` : 'Add New Product'} />
        </CardHeader>
        <CardContent className='px-6 py-4'>
          <div className='flex flex-col xl:grid grid-cols-12 gap-6'>
            <div className='col-span-12 lg:col-span-8 space-y-8'>
              <ProductInfoForm />
              <ProductVariantForm />
              <ProductDiscount />
              <ProductDescription />
              <ProductImages />
              <SeoMetaTags />
            </div>
            <div className='col-span-12 lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-4'>
              <ShippingConfiguration />
              <ProductFeatured />
              <ProductRefundable />
              <ProductWarranty />
              <ProductStockQuantity />
              <ProductCollections />
              <ActionForm onCancel={onCancel} productId={productId} onSuccess={onSuccess} />
            </div>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  )
}

export default ProductFormAction

const ActionForm = ({ onCancel, productId, onSuccess }: { onCancel?: () => void; productId?: string | null; onSuccess?: () => void }) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext()

  const createMutation = _productService.useCreateProduct()
  const updateMutation = _productService.useUpdateProduct()

  const handleSubmitData = async () => {
    handleSubmit(
      async (data) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { thumbnail, media, metaImage, ...submitData } = data as any
          
          if (!submitData.variants) {
            submitData.variants = []
          }

          if (productId) {
            await updateMutation.mutateAsync({ id: productId, data: submitData })
          } else {
            await createMutation.mutateAsync(submitData as any)
          }
          onSuccess?.()
        } catch (error) {
          console.error('Form submission failed:', error)
        }
      },
      (errors) => {
        console.log('Form validation errors:', errors)
      },
    )()
  }

  return (
    <div className='w-full p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm'>
      <div className='flex gap-3 justify-end'>
        <Button variant='outline' onClick={onCancel} type='button'>
          CANCEL
        </Button>
        <Button onClick={handleSubmitData} disabled={isSubmitting} className='min-w-[100px]'>
          {isSubmitting ? 'SAVING...' : 'SAVE'}
        </Button>
      </div>
    </div>
  )
}
