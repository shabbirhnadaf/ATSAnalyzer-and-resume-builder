"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(80),
    email: zod_1.z.string().trim().email(),
    selectedTemplate: zod_1.z.string().trim().min(1).default('modern'),
    phone: zod_1.z.string().trim().optional().default(''),
    location: zod_1.z.string().trim().optional().default(''),
    linkedin: zod_1.z.string().trim().optional().default(''),
    github: zod_1.z.string().trim().optional().default(''),
    portfolio: zod_1.z.string().trim().optional().default(''),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(4),
    newPassword: zod_1.z.string().min(4),
});
