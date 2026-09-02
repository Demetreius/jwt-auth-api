import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responses.utils.js';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return sendError(res, 401, 'Access token missing or malformed', 'UNAUTHORIZED');
  }

  const jwtSecret = process.env.JWT_SECRET!;

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return sendError(res, 403, 'Invalid or expired token', 'INVALID_TOKEN');
    }

    const payload = decoded as { userId?: string; id?: string };
    req.user = { 
      id: payload.userId || payload.id!
    };
    next();
  });
};