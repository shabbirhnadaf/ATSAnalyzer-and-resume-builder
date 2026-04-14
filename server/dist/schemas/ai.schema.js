"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillGapSchema = exports.atsAnalysisSchema = exports.buildResumeSchema = exports.tailorResumeSchema = exports.generateProjectSchema = exports.improveExperienceSchema = exports.improveSummarySchema = void 0;
const zod_1 = require("zod");
exports.improveSummarySchema = zod_1.z.object({
    summary: zod_1.z.string().min(20).max(2000),
    jobTitle: zod_1.z.string().min(2).max(120).optional(),
    tone: zod_1.z.enum(['professional', 'confident', 'concise']).optional(),
});
exports.improveExperienceSchema = zod_1.z.object({
    jobTitle: zod_1.z.string().min(2).max(120),
    company: zod_1.z.string().min(2).max(120).optional(),
    bullets: zod_1.z.array(zod_1.z.string().min(3).max(300)).min(1).max(10),
    targetRole: zod_1.z.string().min(2).max(120).optional(),
});
exports.generateProjectSchema = zod_1.z.object({
    projectName: zod_1.z.string().min(2).max(120),
    techStack: zod_1.z.array(zod_1.z.string().min(1).max(50)).min(1).max(12),
    projectType: zod_1.z.string().min(2).max(120).optional(),
    targetRole: zod_1.z.string().min(2).max(120).optional(),
});
exports.tailorResumeSchema = zod_1.z.object({
    resumeText: zod_1.z.string().min(50).max(20000),
    jobDescription: zod_1.z.string().min(50).max(12000),
});
exports.buildResumeSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(160).optional(),
    template: zod_1.z.string().min(2).max(80).optional(),
    mode: zod_1.z.enum(['student', 'professional']).optional(),
    personalInfo: zod_1.z.object({
        fullname: zod_1.z.string().min(2).max(120),
        email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
        phone: zod_1.z.string().min(5).max(30).optional().or(zod_1.z.literal('')),
        location: zod_1.z.string().min(2).max(120).optional().or(zod_1.z.literal('')),
        linkedin: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        github: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        portfolio: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    }),
    targetRole: zod_1.z.string().min(2).max(120),
    yearsOfExperience: zod_1.z.string().min(1).max(50),
    skills: zod_1.z.array(zod_1.z.string().min(1).max(50)).min(1).max(40),
    education: zod_1.z.array(zod_1.z.string().min(2).max(500)).max(12).optional().default([]),
    projects: zod_1.z.array(zod_1.z.string().min(2).max(700)).max(12).optional().default([]),
    workExperience: zod_1.z.array(zod_1.z.string().min(2).max(700)).max(20).optional().default([]),
    certifications: zod_1.z.array(zod_1.z.string().min(2).max(200)).max(20).optional().default([]),
    achievements: zod_1.z.array(zod_1.z.string().min(2).max(200)).max(20).optional().default([]),
    extracurriculars: zod_1.z.array(zod_1.z.string().min(2).max(200)).max(20).optional().default([]),
    coursework: zod_1.z.array(zod_1.z.string().min(2).max(200)).max(20).optional().default([]),
    jobDescription: zod_1.z.string().max(12000).optional(),
});
exports.atsAnalysisSchema = zod_1.z.object({
    resumeText: zod_1.z.string().min(50).max(20000),
    jobDescription: zod_1.z.string().min(50).max(12000),
});
exports.skillGapSchema = zod_1.z.object({
    resumeText: zod_1.z.string().min(50).max(20000),
    targetRole: zod_1.z.string().min(2).max(120).optional(),
    jobDescription: zod_1.z.string().min(50).max(12000).optional(),
});
