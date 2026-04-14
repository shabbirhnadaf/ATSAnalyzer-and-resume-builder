"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeSchema = void 0;
const zod_1 = require("zod");
const experienceSchema = zod_1.z.object({
    company: zod_1.z.string().trim().min(1),
    role: zod_1.z.string().trim().min(1),
    startDate: zod_1.z.string().trim().min(1),
    endDate: zod_1.z.string().trim().optional().default('Present'),
    description: zod_1.z.array(zod_1.z.string().trim()).default([]),
});
const educationSchema = zod_1.z.object({
    institution: zod_1.z.string().trim().min(1),
    degree: zod_1.z.string().trim().min(1),
    startDate: zod_1.z.string().trim().min(1),
    endDate: zod_1.z.string().trim().min(1),
    score: zod_1.z.string().trim().optional().default(''),
});
const projectSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1),
    description: zod_1.z.array(zod_1.z.string().trim()).default([]),
    link: zod_1.z.string().trim().optional().default(''),
});
exports.resumeSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(2).max(120),
    template: zod_1.z.string().trim().min(1),
    personalInfo: zod_1.z.object({
        fullname: zod_1.z.string().trim().min(2),
        email: zod_1.z.string().trim().email({ message: 'Invalid email' }),
        phone: zod_1.z.string().trim().min(6),
        location: zod_1.z.string().trim().min(2),
        linkedin: zod_1.z.string().trim().optional().default(''),
        github: zod_1.z.string().trim().optional().default(''),
        portfolio: zod_1.z.string().trim().optional().default(''),
    }),
    summary: zod_1.z.string().trim().max(1000).default(''),
    skills: zod_1.z.array(zod_1.z.string().trim()).default([]),
    experience: zod_1.z.array(experienceSchema).default([]),
    education: zod_1.z.array(educationSchema).default([]),
    projects: zod_1.z.array(projectSchema).default([]),
    certifications: zod_1.z.array(zod_1.z.string().trim()).default([]),
});
