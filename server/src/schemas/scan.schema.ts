import { z } from "zod";

export const scanSchema = z.object({
    resumeId: z.string().optional(),
    resumeText: z.string().min(50),
    jobDescription: z.string().min(50),
    jobTitle: z.string().optional().default(''),
    companyName: z.string().optional().default(''),
})