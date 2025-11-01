import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ProductSchema, ProductSchemaType } from '../schema/product.schema'

export function useProductHookForm(defaultValues?: Partial<ProductSchemaType>) {
  return useForm<ProductSchemaType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      ...defaultValues,
    },
  })
}
