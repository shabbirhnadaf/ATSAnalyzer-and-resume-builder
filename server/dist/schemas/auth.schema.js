"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().refine((val) => /\S+@\S+\.\S+/.test(val), { message: "Invalid email" }),
    password: zod_1.z.string().min(4).max(50),
    name: zod_1.z.string().min(2).max(60),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().refine((val) => /\S+@\S+\.\S+/.test(val), { message: "Invalid email" }),
    password: zod_1.z.string().min(4).max(50)
});
