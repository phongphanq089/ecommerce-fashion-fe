import { z } from 'zod'

export const ProductValidate = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  slug: z.string().optional(),
  categoryId: z.string().refine((value) => value !== '', {
    message: 'Category is required',
  }),
  brandId: z.string().refine((value) => value !== '', {
    message: 'Brand is required',
  }),
  type: z.enum(['SINGLE', 'VARIANT']).default('SINGLE'),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnailId: z.cuid().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isRefunded: z.boolean().default(false),
  hasWarranty: z.boolean().default(false),
  disableShipping: z.boolean().default(false),
  lowStockQuantity: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaImageId: z.cuid().nullable().optional(),
  discountType: z.enum(['PERCENTAGE', 'FLAT']).default('PERCENTAGE'),
  discountValue: z.number().default(0).optional(),
  // .refine((value) => value > 0, {
  //   message: 'Discount value must be greater than 0',
  // }),
  discountStartDate: z.string().nullable().optional(),
  discountEndDate: z.string().nullable().optional(),
  mediaIds: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
  variants: z
    .array(
      z.object({
        sku: z.string(),
        price: z.number().default(0),
        stock: z.number().default(0),
        purchasePrice: z.number().default(0),
        lowStockQuantity: z.number().optional(),
        attributes: z.array(
          z.object({
            name: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
    .optional(),
  unit: z.string().optional(),
  condition: z.string().optional(),
})

export type ProductSchemaType = z.infer<typeof ProductValidate>
