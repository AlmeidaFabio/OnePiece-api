import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Valida apenas o corpo da requisição
            await schema.parseAsync(req.body);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation Error',
                    details: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}; 