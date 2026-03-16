import { z } from 'zod'

export const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
})

export type CollectionSchemaType = z.infer<typeof collectionSchema>
