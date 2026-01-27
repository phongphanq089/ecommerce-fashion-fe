import z from 'zod'

export const signInSchema = z.object({
  email: z.email({ message: 'Email is invalid.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
})

export type SignInSchemaType = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  email: z.email({ message: 'Email is invalid.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
})

export type SignUpSchemaType = z.infer<typeof signUpSchema>
