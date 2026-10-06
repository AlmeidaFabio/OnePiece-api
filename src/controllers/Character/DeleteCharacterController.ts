import { Request, Response } from 'express';
import { DeleteCharacterUseCase } from '../../useCases/Character/DeleteCharacterUseCase';
import { AppError } from '../../errors/AppError';

export class DeleteCharacterController {
    constructor(private deleteCharacterUseCase: DeleteCharacterUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params;

            const result = await this.deleteCharacterUseCase.execute(id);

            return response.status(200).json({
                status: 'success',
                message: result.message
            });
        } catch (error) {
            // Antes o status era decidido por error.message.includes('Character not found').
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }

            console.error('❌ Erro ao excluir personagem:', error);
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}
