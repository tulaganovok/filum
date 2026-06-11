import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.email('Invalid email address').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const signUpFormSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters long'),
  email: z.email('Invalid email address').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long').trim(),
})
