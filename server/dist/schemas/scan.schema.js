"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanSchema = void 0;
const zod_1 = require("zod");
exports.scanSchema = zod_1.z.object({
    resumeId: zod_1.z.string().optional(),
    resumeText: zod_1.z.string().min(50),
    jobDescription: zod_1.z.string().min(50),
    jobTitle: zod_1.z.string().optional().default(''),
    companyName: zod_1.z.string().optional().default(''),
});
