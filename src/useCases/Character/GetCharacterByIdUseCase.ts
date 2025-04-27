import { ICharactersRepository } from "../../repositories/ICharactersRepository";

export class GetCharacterByIdUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(id: string) {
        try {
            const character = await this.charactersRepository.findById(id);

            if (!character) {
                throw new Error('Character not found');
            }

            return {
                status: 'success',
                data: character
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get character: ${error.message}`);
            }
            throw new Error('Failed to get character: Unknown error');
        }
    }
}