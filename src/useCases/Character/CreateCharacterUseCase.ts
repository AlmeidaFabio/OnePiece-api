import { ICharacterDTO, ICharacterResponseDTO } from '../../dtos/ICharacterDTO';
import { ICharactersRepository } from '../../repositories/ICharactersRepository';
import { AppError } from '../../errors/AppError';

export class CreateCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(data: ICharacterDTO): Promise<ICharacterResponseDTO> {
        try {
            return await this.charactersRepository.create(data);
        } catch (error) {
            // AppError (409 de nome duplicado, por exemplo) sobe com o status correto.
            if (error instanceof AppError) throw error;

            if (error instanceof Error) {
                throw new Error(`Failed to create character: ${error.message}`, { cause: error });
            }
            throw new Error('Failed to create character: Unknown error', { cause: error });
        }
    }
}
