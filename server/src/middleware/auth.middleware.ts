import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/api';
import { verifyToken } from '../utils/tokens';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json(fail('Unauthorized'));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json(fail('Invalid or expired token'));
  }
}