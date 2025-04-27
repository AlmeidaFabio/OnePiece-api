import { ICharactersRepository } from "../../repositories/ICharactersRepository";
import { GetCharactersDTO } from "../../validations/characterValidations";

export class ListCharactersUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(filters: GetCharactersDTO) {
        try {
            const { name, crew, hasDevilFruit, minBounty, maxBounty, page = 1, limit = 10 } = filters;

            const validatedPage = Math.max(1, Number(page));
            const validatedLimit = Math.min(Math.max(1, Number(limit)), 100);

            const result = await this.charactersRepository.findAll({
                name,
                crew,
                hasDevilFruit: undefined,
                minBounty,
                maxBounty,
                page: validatedPage,
                limit: validatedLimit
            });

            const totalPages = Math.max(1, Math.ceil(result.total / validatedLimit));
            const currentPage = Math.min(validatedPage, totalPages);

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
            if (error instanceof Error) {
                throw new Error(`Failed to list characters: ${error.message}`);
            }
            throw new Error('Failed to list characters: Unknown error');
        }
    }
}