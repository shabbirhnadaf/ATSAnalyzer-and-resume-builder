import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/api';

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).json(fail(err.message || 'Internal server error'));
}