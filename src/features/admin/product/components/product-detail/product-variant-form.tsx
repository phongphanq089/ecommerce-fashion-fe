import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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

interface Variation {
  id: number
  name: string
  values: Option[]
}

interface GeneratedVariant {
  combination: string
  purchasePrice: string
  unitPrice: string
  sku: string
  quantity: string
}

const INITIAL_ATTRIBUTE_OPTIONS: Record<string, Option[]> = {
  Colors: [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
  ],
  Size: [
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' },
  ],
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
  const {
    fields: variants,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: 'variants',
  })

  const productType = watch('type')

  const [attributeOptions, setAttributeOptions] = useState<
    Record<string, Option[]>
  >(INITIAL_ATTRIBUTE_OPTIONS)

  const [variations, setVariations] = useState<Variation[]>([
    { id: 1, name: 'Colors', values: [] },
  ])

  useEffect(() => {
    if (productType === 'VARIANT') {
      const optionValues = variations.map((v) => v.values)
      const optionNames = variations.map((v) => v.name)

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
            sku: `-${skuSuffix}`,
            price: 0,
            stock: 0,
            purchasePrice: 0,
            lowStockQuantity: 0,
            attributes,
          }
        })
        replace(newVariants)
      }
    } else if (productType === 'SINGLE' && variants.length === 0) {
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
  }, [variations, productType, replace, variants.length])

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), name: '', values: [] }])
  }

  const removeVariation = (id: number) => {
    setVariations(variations.filter((v) => v.id !== id))
  }

  const handleVariationNameChange = (id: number, newName: string) => {
    setVariations(
      variations.map((v) => (v.id === id ? { ...v, name: newName } : v)),
    )
  }

  // --- CẬP NHẬT: Logic xử lý khi giá trị của MultipleSelector thay đổi ---
  const handleVariationValuesChange = (id: number, newValues: Option[]) => {
    let variationName = ''

    setVariations(
      variations.map((v) => {
        if (v.id === id) {
          variationName = v.name
          return { ...v, values: newValues }
        }
        return v
      }),
    )

    // 2. Cập nhật "danh sách có sẵn" (attributeOptions)
    // Nếu thuộc tính này có tên
    if (variationName) {
      // Lấy danh sách các lựa chọn hiện có cho thuộc tính này
      const currentOptions = attributeOptions[variationName] || []
      const newOptionsToAdd: Option[] = []

      // Lọc ra những lựa chọn "mới" (được tạo ra)
      newValues.forEach((option) => {
        if (!currentOptions.some((o) => o.value === option.value)) {
          newOptionsToAdd.push(option)
        }
      })

      // Nếu có lựa chọn mới, cập nhật state attributeOptions
      if (newOptionsToAdd.length > 0) {
        setAttributeOptions((prev) => ({
          ...prev,
          [variationName]: [...currentOptions, ...newOptionsToAdd],
        }))
      }
    }
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
            <div className='grid grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Purchase Price</Label>
              <Input
                type='number'
                {...register(`variants.${0}.purchasePrice`, {
                  valueAsNumber: true,
                })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Unit Price</Label>
              <Input
                type='number'
                {...register(`variants.${0}.price`, { valueAsNumber: true })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-[150px_1fr] items-center gap-4'>
              <Label>Quantity</Label>
              <Input
                type='number'
                {...register(`variants.${0}.stock`, { valueAsNumber: true })}
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-[150px_1fr] items-center gap-4'>
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
            <CardHeader>
              <CardTitle>Product Variation</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {variations.map((variation) => (
                <div
                  key={variation.id}
                  className='grid grid-cols-[150px_1fr_auto] items-center gap-4'
                >
                  <Input
                    value={variation.name}
                    placeholder='Attribute (e.g., Size)'
                    onChange={(e) =>
                      handleVariationNameChange(variation.id, e.target.value)
                    }
                    className='font-semibold bg-white'
                  />
                  <MultipleSelector
                    className='bg-white dark:bg-accent'
                    value={variation.values}
                    onChange={(options) =>
                      handleVariationValuesChange(variation.id, options)
                    }
                    defaultOptions={attributeOptions[variation.name] || []}
                    placeholder='Select or insert options...'
                    creatable
                    emptyIndicator={
                      <p className='text-center text-sm'>No results found</p>
                    }
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => removeVariation(variation.id)}
                    disabled={variations.length <= 1}
                  >
                    <Trash2 className='h-4 w-4 text-red-500' />
                  </Button>
                </div>
              ))}
              <Button variant='outline' onClick={addVariation}>
                Add another option
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* --- Bảng biến thể được tạo tự động --- */}
      {variants.length > 0 && productType === 'VARIANT' && (
        <Card className='bg-muted shadow-none'>
          <CardHeader>
            <CardTitle>Product Price And Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[200px]'>Variant</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Sku</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((field, index) => {
                  const combination = field.attributes
                    ?.map((attr) => `${attr.name}:${attr.value}`)
                    .join(' | ')
                  return (
                    <TableRow key={field.id}>
                      <TableCell className='font-medium'>
                        {combination}
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.purchasePrice`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          {...register(`variants.${index}.sku`)}
                          className='bg-white'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          {...register(`variants.${index}.stock`, {
                            valueAsNumber: true,
                          })}
                          className='bg-white'
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
