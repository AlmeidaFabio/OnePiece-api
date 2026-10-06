import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

/** De onde vem o dado a validar. */
type RequestSource = 'body' | 'query' | 'params';

export const validateRequest = (schema: ZodTypeAny, source: RequestSource = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync(req[source]);

            if (source === 'body') {
                // O resultado do parse é reatribuído ao req.body: sem isso, coerções
                // e defaults do schema seriam descartados e o controller continuaria
                // recebendo os valores crus (ex.: "3000" em multipart/form-data).
                req.body = parsed;
            } else {
                // Em Express 4 `req.query` é um getter do protótipo que reanalisa a
                // URL a cada acesso, então `Object.assign(req.query, parsed)` seria
                // descartado. Definir uma propriedade própria na requisição faz os
                // valores convertidos valerem para os middlewares seguintes.
                Object.defineProperty(req, source, {
                    value: parsed,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }

            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation Error',
                    details: error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};
