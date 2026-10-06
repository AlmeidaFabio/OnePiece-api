import { ICharactersRepository } from '../../repositories/ICharactersRepository';
import { AppError } from '../../errors/AppError';

export class GetCharacterByIdUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(id: string) {
        try {
            // O repositório lança AppError 404 quando não existe; repassamos o
            // status em vez de reescrever a mensagem e perder o código.
            const character = await this.charactersRepository.findById(id);

            return {
                status: 'success',
                data: character
            };
        } catch (error) {
            if (error instanceof AppError) throw error;

            if (error instanceof Error) {
                throw new Error(`Failed to get character: ${error.message}`, { cause: error });
            }
            throw new Error('Failed to get character: Unknown error', { cause: error });
        }
    }
}
