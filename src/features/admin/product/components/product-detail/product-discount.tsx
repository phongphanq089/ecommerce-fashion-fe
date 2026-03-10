'use client'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { ProductSchemaType } from '../../product.validate'

const discountTypes = [
  { value: 'FLAT', label: 'Flat' },
  { value: 'PERCENTAGE', label: 'Percentage' },
]
const ProductDiscount = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()
  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>Product Discount</CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
          <div className='*:not-first:mt-2'>
            <Label>Name</Label>
          </div>
          <div className='flex flex-col gap-2 space-y-2'>
            <Input
              {...register('discountValue', { valueAsNumber: true })}
              placeholder='0.00'
              type='number'
              className='bg-white'
              aria-invalid={errors.discountValue ? true : false}
              errorMessage={errors.discountValue?.message}
            />

            <Controller
              control={control}
              name='discountType'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full bg-white'>
                    <SelectValue placeholder='Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Discount Type</SelectLabel>
                      {discountTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductDiscount
