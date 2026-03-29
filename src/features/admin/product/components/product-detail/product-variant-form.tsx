'use client'
import { Trash2, Loader2, Plus } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '~/components/ui/core/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import MultipleSelector, { Option } from '~/components/ui/core/multiselect'
import { RadioGroup, RadioGroupItem } from '~/components/ui/core/radio-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/core/table'
import { ProductSchemaType } from '../../product.validate'
import { _attributeService } from '../../attribute.query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'

interface Variation {
  id: string | number
  name: string
  values: Option[]
}

// Hàm tạo tổ hợp chéo (Cartesian Product)
const getCombinations = (
  arrays: Option[][],
  optionNames: string[],
): string[] => {
  if (
    !arrays ||
    arrays.length === 0 ||
    arrays.some((arr) => arr.length === 0)
  ) {
    return []
  }

  let result: string[][] = [[]]
  for (const arr of arrays) {
    const newResult: string[][] = []
    for (const res of result) {
      for (const item of arr) {
        newResult.push([...res, item.label])
      }
    }
    result = newResult
  }

  // Format the output string
  return result.map((combo) =>
    combo.map((value, index) => `${optionNames[index]}:${value}`).join(' | '),
  )
}

const ProductVariantForm = () => {
  const { control, register, watch, setValue } =
    useFormContext<ProductSchemaType>()
  const { fields: variants, replace } = useFieldArray({
    control,
    name: 'variants',
  })

  const productType = watch('type')

  // API Integration
  const { data: attributesData, isLoading: isLoadingAttributes } =
    _attributeService.useAllAttributes()

  console.log(attributesData, '####=>')
  const [variations, setVariations] = useState<Variation[]>([
    { id: Date.now(), name: '', values: [] },
  ])

  // Map API data to options format for MultipleSelector
  const attributeOptionsMap = useMemo(() => {
    const map: Record<string, Option[]> = {}
    attributesData?.result?.forEach((attr) => {
      map[attr.name] = attr.values.map((v) => ({
        label: v.value,
        value: v.value,
      }))
    })
    return map
  }, [attributesData])

  useEffect(() => {
    if (productType === 'VARIANT') {
      const activeVariations = variations.filter(
        (v) => v.name && v.values.length > 0,
      )

      // Đẩy dữ liệu vào trường options
      const optionsData = activeVariations.map((v) => ({
        name: v.name,
        values: v.values.map((val) => val.label),
      }))
      setValue('options', optionsData)

      const optionValues = activeVariations.map((v) => v.values)
      const optionNames = activeVariations.map((v) => v.name)

      const combinations = getCombinations(optionValues, optionNames)

      if (combinations.length > 0) {
        const newVariants = combinations.map((combo) => {
          const skuSuffix = combo
            .split(' | ')
            .map((part) => part.split(':')[1])
            .join('-')

          const attributes = combo.split(' | ').map((part) => {
            const [name, value] = part.split(':')
            return { name, value }
          })

          return {
            sku: `${skuSuffix}`,
            price: 0,
            stock: 0,
            purchasePrice: 0,
            lowStockQuantity: 0,
            attributes,
          }
        })
        replace(newVariants)
      } else {
        replace([])
      }
    } else if (productType === 'SINGLE') {
      const currentVariants = watch('variants')
      if (
        !currentVariants ||
        currentVariants.length === 0 ||
        (currentVariants[0]?.attributes &&
          currentVariants[0].attributes.length > 0)
      ) {
        replace([
          {
            sku: '',
            price: 0,
            stock: 0,
            purchasePrice: 0,
            lowStockQuantity: 0,
            attributes: [],
          },
        ])
      }
    }
  }, [variations, productType])

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), name: '', values: [] }])
  }

  const removeVariation = (id: string | number) => {
    setVariations(variations.filter((v) => v.id !== id))
  }

  const handleVariationNameChange = (id: string | number, newName: string) => {
    setVariations(
      variations.map((v) =>
        v.id === id ? { ...v, name: newName, values: [] } : v,
      ),
    )
  }

  const handleVariationValuesChange = (
    id: string | number,
    newValues: Option[],
  ) => {
    setVariations(
      variations.map((v) => (v.id === id ? { ...v, values: newValues } : v)),
    )
  }

  return (
    <div className='space-y-10'>
      <Card className='bg-muted shadow-none '>
        <CardHeader className='border-b font-bold'>Product Type</CardHeader>
        <CardContent>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className='flex items-center gap-8'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='SINGLE' id='r1' />
                  <Label htmlFor='r1'>Single Product</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='VARIANT' id='r2' />
                  <Label htmlFor='r2'>Variant Product</Label>
                </div>
              </RadioGroup>
            )}
          />
        </CardContent>
      </Card>

      {/* --- Form for Single Product --- */}
      {productType === 'SINGLE' && variants[0] && (
        <Card className='bg-muted shadow-none '>
          <CardHeader>
            <CardTitle>Product Price And Stock</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Purchase Price</Label>
              <Input
                type='number'
                {...register(`variants.${0}.purchasePrice`, {
                  valueAsNumber: true,
                })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Unit Price</Label>
              <Input
                type='number'
                {...register(`variants.${0}.price`, { valueAsNumber: true })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Quantity</Label>
              <Input
                type='number'
                {...register(`variants.${0}.stock`, { valueAsNumber: true })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Sku</Label>
              <Input
                {...register(`variants.${0}.sku`)}
                placeholder='Type product sku'
                className='bg-white'
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Form for Variant Product --- */}
      {productType === 'VARIANT' && (
        <>
          <Card className='bg-muted shadow-none'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4 border-b'>
              <CardTitle>Product Variation</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={addVariation}
                className='bg-white'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Variation
              </Button>
            </CardHeader>
            <CardContent className='space-y-6 pt-6'>
              {variations.map((variation) => (
                <div
                  key={variation.id}
                  className='grid grid-cols-1 md:grid-cols-[200px_1fr_auto] items-start gap-4 p-4 rounded-lg  border'
                >
                  <div className='space-y-2'>
                    <Label>Attribute Name</Label>
                    <Select
                      value={variation.name}
                      onValueChange={(value) =>
                        handleVariationNameChange(variation.id, value)
                      }
                    >
                      <SelectTrigger className='bg-muted'>
                        <SelectValue placeholder='Select Attribute' />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingAttributes ? (
                          <div className='flex items-center justify-center p-2'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                          </div>
                        ) : (
                          attributesData?.result?.map((attr) => (
                            <SelectItem key={attr.id} value={attr.name}>
                              {attr.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label>Attribute Values</Label>
                    <MultipleSelector
                      className='bg-muted'
                      value={variation.values}
                      onChange={(options) =>
                        handleVariationValuesChange(variation.id, options)
                      }
                      options={attributeOptionsMap[variation.name] || []}
                      placeholder='Select or insert options...'
                      creatable
                      emptyIndicator={
                        <p className='text-center text-sm'>No results found</p>
                      }
                    />
                  </div>

                  <div className='pt-8'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => removeVariation(variation.id)}
                      disabled={variations.length <= 1}
                      className='text-red-500 hover:text-red-700 hover:bg-red-50'
                    >
                      <Trash2 className='h-5 w-5' />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* --- Bảng biến thể được tạo tự động --- */}
      {variants.length > 0 && productType === 'VARIANT' && (
        <Card className='bg-muted shadow-none'>
          <CardHeader className='border-b'>
            <CardTitle>Variant Combinations</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow className='bg-transparent'>
                  <TableHead className='w-[250px] font-bold'>Variant</TableHead>
                  <TableHead className='font-bold'>Purchase Price</TableHead>
                  <TableHead className='font-bold'>Unit Price</TableHead>
                  <TableHead className='font-bold'>Sku</TableHead>
                  <TableHead className='font-bold'>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((field, index) => {
                  const combination = field.attributes
                    ?.map((attr) => `${attr.name}:${attr.value}`)
                    .join(' | ')
                  return (
                    <TableRow key={field.id} className='bg-transparent'>
                      <TableCell className='font-medium text-primary'>
                        {combination}
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.purchasePrice`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white h-9'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white h-9'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          {...register(`variants.${index}.sku`)}
                          className='bg-white h-9'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.stock`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white h-9'
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ProductVariantForm
