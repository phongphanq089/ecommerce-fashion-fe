'use client'

import Link from 'next/link'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Label } from '~/components/ui/core/label'
import { ProductSchemaType } from '../../product.validate'

const ProductCollections = () => {
  const { control } = useFormContext<ProductSchemaType>()
  const collections = [
    { id: 'coll-1', label: 'Top Picks On Clothing' },
    { id: 'coll-2', label: 'Trending Offers' },
  ]
  return (
    <Card className='bg-muted shadow-none '>
      <CardHeader className='border-b font-bold'>
        <CardTitle className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
          Product Collections
        </CardTitle>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='space-y-5'>
          {collections.map((collection) => (
            <div key={collection.id} className='flex items-center space-x-3'>
              <Controller
                control={control}
                name='collectionIds'
                render={({ field }) => (
                  <Checkbox
                    id={collection.id}
                    checked={field.value?.includes(collection.id)}
                    onCheckedChange={(checked) => {
                      const current = field.value || []
                      const updated = checked
                        ? [...current, collection.id]
                        : current.filter((id) => id !== collection.id)
                      field.onChange(updated)
                    }}
                  />
                )}
              />
              <Label
                htmlFor={collection.id}
                className='text-base font-medium text-gray-700 dark:text-gray-200 cursor-pointer'
              >
                {collection.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className='border-t border-gray-200 dark:border-gray-700 px-6'>
        <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
          You can create new collection or manage existing collections from
          <Link href='#' className='font-medium text-primary hover:underline'>
            Product Collections Module
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default ProductCollections
