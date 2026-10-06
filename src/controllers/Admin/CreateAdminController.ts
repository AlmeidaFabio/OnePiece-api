import { Request, Response } from 'express';
import { CreateAdminUseCase } from '../../useCases/Admin/CreateAdminUseCase';
import { AppError } from '../../errors/AppError';
import bcrypt from 'bcrypt';

export class CreateAdminController {
    constructor(private createAdminUseCase: CreateAdminUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            const { email, password } = request.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            // `admin` contém apenas { id, email }: o hash nunca volta na resposta.
            const admin = await this.createAdminUseCase.execute({
                email,
                password: hashedPassword
            });

            return response.status(201).json({
                message: 'Admin created successfully',
                admin
            });
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({ error: error.message });
            }

            console.error('❌ Erro ao criar admin:', error);
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}
