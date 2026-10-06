import { Request, Response } from 'express';
import { SearchCharacterUseCase } from '../../useCases/Character/SearchCharacterUseCase';
import { SearchCharactersDTO } from '../../validations/characterValidations';
import { AppError } from '../../errors/AppError';

export class SearchCharacterController {
    constructor(private searchCharacterUseCase: SearchCharacterUseCase) {
        this.search = this.search.bind(this);
    }

    async search(request: Request, response: Response) {
        try {
            // Já validado e convertido por validateRequest(searchCharactersSchema, 'query').
            const filters = request.query as unknown as SearchCharactersDTO;

            const result = await this.searchCharacterUseCase.execute(filters);

            // Sem resultados é 200 com lista vazia. Antes era 404, o que confundia
            // "nenhum resultado" com "rota inexistente" e não combinava com a
            // paginação — pedir uma página além do fim também devolvia 404.
            return response.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }

            console.error('❌ Erro na busca de personagens:', error);
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}
