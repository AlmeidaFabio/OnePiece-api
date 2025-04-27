import { ICharactersRepository } from "../../repositories/ICharactersRepository";

export class DeleteCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(id: string) {
        try {
            // Verifica se o personagem existe
            const existingCharacter = await this.charactersRepository.findById(id);
            if (!existingCharacter) {
                throw new Error('Character not found');
            }

            // Deleta o personagem
            await this.charactersRepository.delete(id);

            return {
                status: 'success',
                message: 'Character deleted successfully'
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to delete character: ${error.message}`);
            }
            throw new Error('Failed to delete character: Unknown error');
        }
    }
}