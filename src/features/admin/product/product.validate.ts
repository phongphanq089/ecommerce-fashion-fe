import { z } from 'zod'

export const ProductValidate = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.',
    })
    .optional(),
  slug: z.string().refine((value) => value !== '', {
    message: 'Slug is required',
  }),
  categoryId: z.string().refine((value) => value !== '', {
    message: 'Category is required',
  }),
  brandId: z.string().refine((value) => value !== '', {
    message: 'Brand is required',
  }),
  type: z.enum(['SINGLE', 'VARIANT']).default('SINGLE'),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnailId: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isRefunded: z.boolean().default(false),
  hasWarranty: z.boolean().default(false),
  disableShipping: z.boolean().default(false),
  stock: z.number().default(0).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaImageId: z.string().nullable().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).default('PERCENTAGE'),
  discountValue: z.number().default(0).optional(),
  // .refine((value) => value > 0, {
  //   message: 'Discount value must be greater than 0',
  // }),
  discountStartDate: z.string().nullable().optional(),
  discountEndDate: z.string().nullable().optional(),
  mediaIds: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
  // UI ONLY
  options: z
    .array(
      z.object({
        name: z.string(),
        values: z.array(z.string()),
      }),
    )
    .optional(),
  thumbnail: z.any().optional(),
  media: z.array(z.any()).optional(),
  metaImage: z.any().optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z.string(),
        price: z.number().default(0),
        stock: z.number().default(0),
        purchasePrice: z.number().default(0),
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
