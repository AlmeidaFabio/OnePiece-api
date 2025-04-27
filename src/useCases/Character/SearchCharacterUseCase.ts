import { ICharactersRepository } from "../../repositories/ICharactersRepository";

export class SearchCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(txt: string) {
        try {
            if (!txt || txt.trim().length === 0) {
                throw new Error('Search text is required');
            }

            const result = await this.charactersRepository.search(txt);

            return {
                status: 'success',
                data: {
                    characters: result.characters,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        totalPages: Math.ceil(result.total / result.limit),
                        hasNextPage: result.page < Math.ceil(result.total / result.limit),
                        hasPreviousPage: result.page > 1,
                        nextPage: result.page < Math.ceil(result.total / result.limit) ? result.page + 1 : null,
                        previousPage: result.page > 1 ? result.page - 1 : null
                    }
                }
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to search characters: ${error.message}`);
            }
            throw new Error('Failed to search characters: Unknown error');
        }
    }
}