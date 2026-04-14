"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const api_1 = require("../utils/api");
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, api_1.fail)('Validation failed', error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }))));
        }
        next(error);
    }
};
exports.validate = validate;
