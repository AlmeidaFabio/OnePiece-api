import { Request, Response } from 'express';
import { GetCharacterByIdUseCase } from '../../useCases/Character/GetCharacterByIdUseCase';
import { AppError } from '../../errors/AppError';

export class GetCharacterByIdController {
    constructor(private getCharacterByIdUseCase: GetCharacterByIdUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            const id = request.params.id;

            if (!id) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Character ID is required'
                });
            }

            const result = await this.getCharacterByIdUseCase.execute(id);

            return response.status(200).json(result);
        } catch (error) {
            // Antes o status era decidido por error.message.includes('not found').
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }

            console.error('❌ Erro ao buscar personagem:', error);
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}
