import { ICharactersRepository } from "../../repositories/ICharactersRepository";
import { UpdateCharacterDTO } from "../../validations/characterValidations";

export class EditCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(id: string, data: UpdateCharacterDTO) {
        try {
            // Verifica se o personagem existe
            const existingCharacter = await this.charactersRepository.findById(id);
            if (!existingCharacter) {
                throw new Error('Character not found');
            }

            // Atualiza o personagem
            const updatedCharacter = await this.charactersRepository.update(id, data);

            return {
                status: 'success',
                data: updatedCharacter
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to update character: ${error.message}`);
            }
            throw new Error('Failed to update character: Unknown error');
        }
    }
}