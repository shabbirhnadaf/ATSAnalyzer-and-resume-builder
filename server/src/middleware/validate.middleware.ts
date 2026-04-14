import { ZodObject, ZodError } from 'zod';
import { Response, Request, NextFunction } from 'express';
import { fail } from '../utils/api';

export const validate = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if(error instanceof ZodError) {
            return res.status(400).json(fail('Validation failed', error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }))))
        }
        next(error);
    }
}