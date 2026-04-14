import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  selectedTemplate: z.string().trim().min(1).default('modern'),
  phone: z.string().trim().optional().default(''),
  location: z.string().trim().optional().default(''),
  linkedin: z.string().trim().optional().default(''),
  github: z.string().trim().optional().default(''),
  portfolio: z.string().trim().optional().default(''),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(4),
  newPassword: z.string().min(4),
});