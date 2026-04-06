import { z } from 'zod'

export const brandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  logoUrl: z.string().nullable().default(null),
  isActive: z.boolean().default(true),
})

export type BrandSchemaType = z.infer<typeof brandSchema>
