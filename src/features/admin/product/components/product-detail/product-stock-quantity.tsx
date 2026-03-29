'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { ProductSchemaType } from '../../product.validate'

const ProductStockQuantity = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()
  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>Low stock quantity</CardHeader>
      <CardContent className='space-y-5'>
        <div className='flex flex-col gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>Quantity</Label>
          </div>
          <Input
            {...register('lowStockQuantity', { valueAsNumber: true })}
            placeholder='Quantity'
            type='number'
            className='bg-white'
            error={errors.lowStockQuantity?.message}
            errorMessage={errors.lowStockQuantity?.message}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductStockQuantity
