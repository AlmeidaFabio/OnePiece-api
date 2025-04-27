import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class Auth {
    private = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token not provided" });
        }

        const [, token] = authHeader.split(' ');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { id: string; email: string };
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ error: "Token invalid" });
        }
    }
}