import { ICharactersRepository } from '../../repositories/ICharactersRepository';
import { SearchCharactersDTO } from '../../validations/characterValidations';
import { AppError } from '../../errors/AppError';

export class SearchCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(filters: SearchCharactersDTO) {
        try {
            const { q, page = 1, limit = 10 } = filters;

            // Defesa redundante: a rota já valida, mas o use case não depende disso.
            if (!q || q.trim().length === 0) {
                throw new AppError('Texto de busca é obrigatório', 400);
            }

            const validatedPage = Math.max(1, Number(page));
            const validatedLimit = Math.min(Math.max(1, Number(limit)), 100);
            const txt = q.trim();

            const search = (targetPage: number) =>
                this.charactersRepository.search({
                    txt,
                    page: targetPage,
                    limit: validatedLimit
                });

            let result = await search(validatedPage);

            // Mesmo cálculo da listagem: totalPages nunca é 0, o que antes acontecia
            // na busca e deixava o contrato diferente do /characters.
            const totalPages = Math.max(1, Math.ceil(result.total / validatedLimit));
            const currentPage = Math.min(validatedPage, totalPages);

            // Página além do fim: refaz a consulta para devolver a última página real.
            if (currentPage !== validatedPage) {
                result = await search(currentPage);
            }

            return {
                status: 'success',
                data: {
                    characters: result.characters,
                    pagination: {
                        total: result.total,
                        page: currentPage,
                        limit: validatedLimit,
                        totalPages,
                        hasNextPage: currentPage < totalPages,
                        hasPreviousPage: currentPage > 1,
                        nextPage: currentPage < totalPages ? currentPage + 1 : null,
                        previousPage: currentPage > 1 ? currentPage - 1 : null
                    }
                }
            };
        } catch (error) {
            if (error instanceof AppError) throw error;

            if (error instanceof Error) {
                throw new Error(`Failed to search characters: ${error.message}`, { cause: error });
            }
            throw new Error('Failed to search characters: Unknown error', { cause: error });
        }
    }
}
