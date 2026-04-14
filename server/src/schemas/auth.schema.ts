import { z } from 'zod'

export const registerSchema = z.object({
    email: z.string().refine(
        (val) => /\S+@\S+\.\S+/.test(val),
        { message: "Invalid email" }),
    password: z.string().min(4).max(50),
    name: z.string().min(2).max(60),
});

export const loginSchema = z.object({
    email: z.string().refine(
        (val) => /\S+@\S+\.\S+/.test(val),
        { message: "Invalid email" }),
    password: z.string().min(4).max(50)
}); 