import { Request, Response } from 'express';
import { ListCharactersUseCase } from '../../useCases/Character/ListCharactersUseCase';
import { GetCharactersDTO } from '../../validations/characterValidations';
import { AppError } from '../../errors/AppError';

export class ListCharactersController {
    constructor(private listCharactersUseCase: ListCharactersUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            // Já validado e convertido por validateRequest(getCharactersSchema, 'query'):
            // os números chegam como number e hasDevilFruit como boolean.
            const filters = request.query as unknown as GetCharactersDTO;

            const result = await this.listCharactersUseCase.execute(filters);

            return response.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }

            // Falha de banco é 500: antes qualquer erro virava 400, atribuindo ao
            // cliente um problema do servidor.
            console.error('❌ Erro ao listar personagens:', error);
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}
