import z from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, {
    message: 'Category name must be at least 2 characters.',
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.',
  }),
  parentId: z.string().optional().nullable(),
})

export type CategorySchemaType = z.infer<typeof categorySchema>
