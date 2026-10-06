import { Request, Response } from 'express';
import { GetAdminUseCase } from '../../useCases/Admin/GetAdminUseCase';
import { AppError } from '../../errors/AppError';

export class GetAdminByIdController {
    constructor(private getAdmin: GetAdminUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            if (!request.user?.id) {
                return response.status(401).json({ error: 'Unauthorized' });
            }

            const admin = await this.getAdmin.execute(request.user.id);

            return response.status(200).json({
                admin: {
                    id: admin.id,
                    email: admin.email
                }
            });
        } catch (error) {
            // Admin inexistente vira 404 em vez de 200 com objeto vazio.
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({ error: error.message });
            }

            console.error('❌ Erro ao buscar admin autenticado:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}
