import { Request, Response } from 'express';
import { DeleteCharacterUseCase } from '../../useCases/Character/DeleteCharacterUseCase';

export class DeleteCharacterController {
    constructor(private deleteCharacterUseCase: DeleteCharacterUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params;

            // Executa o caso de uso
            const result = await this.deleteCharacterUseCase.execute(id);

            // Retorna a resposta de sucesso
            return response.status(200).json({
                status: 'success',
                message: result.message
            });
        } catch (error) {
            if (error instanceof Error) {
                // Trata erros específicos
                if (error.message.includes('Character not found')) {
                    return response.status(404).json({
                        status: 'error',
                        message: error.message
                    });
                }
                if (error.message.includes('Failed to delete character')) {
                    return response.status(400).json({
                        status: 'error',
                        message: error.message
                    });
                }
            }
            // Erro genérico
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}