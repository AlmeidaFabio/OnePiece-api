import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ALGORITHM, JWT_SECRET } from '../config/auth';

export class Auth {
    private = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token not provided' });
        }

        const [, token] = authHeader.split(' ');

        try {
            // JWT_SECRET vem validado no boot (src/config/auth.ts): não existe mais
            // fallback para 'default-secret'. O algoritmo é fixado para que um token
            // não possa ser aceito por confusão de algoritmo.
            const decoded = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] }) as {
                id: string;
                email: string;
            };
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ error: 'Token invalid' });
        }
    };
}
