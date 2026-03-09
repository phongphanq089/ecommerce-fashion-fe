'use client'
import { FormProvider, useFormContext } from 'react-hook-form'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Button } from '~/components/ui/core/button'
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

const ProductFormAction = () => {
  const form = useProductHookForm()
  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader>
          <HeadingSectionAdmin title='Add New Product' />
        </CardHeader>
        <CardContent className='max-sm:p-2'>
          <div className='flex flex-col xl:grid grid-cols-12 gap-5'>
            <div className='col-span-7 space-y-10'>
              <ProductInfoForm />
              <ProductVariantForm />
              <ProductDiscount />
              <ProductDescription />
              <ProductImages />
              <SeoMetaTags />
            </div>
            <div className='col-span-5 space-y-10 sticky top-20 right-0 h-fit w-full'>
              <ShippingConfiguration />
              <ProductFeatured />
              <ProductRefundable />
              <ProductWarranty />
              <ProductStockQuantity />
              <ProductCollections />
              <ActionForm />
            </div>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  )
}

export default ProductFormAction

const ActionForm = () => {
  const { handleSubmit } = useFormContext()

  const onClickSubmit = () => {
    handleSubmit((data) => {
      console.log('Submit data:', data)
    })()
  }
  return (
    <div className='w-full flex justify-end custom-gradient dark:custom-gradient-dark'>
      <div className='flex gap-2 items-center w-fit'>
        <div className='flex items-center justify-center gap-3'>
          <Button variant={'outline'} className='bg-muted'>
            CANCLE
          </Button>
          <Button onClick={onClickSubmit}>SAVE</Button>
        </div>
      </div>
    </div>
  )
}
