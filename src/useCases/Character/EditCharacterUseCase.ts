import { ICharactersRepository } from '../../repositories/ICharactersRepository';
import { UpdateCharacterDTO } from '../../validations/characterValidations';
import { AppError } from '../../errors/AppError';
import { deleteCharacterImage } from '../../utils/characterImage';

export class EditCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(id: string, data: UpdateCharacterDTO) {
        try {
            // findById lança AppError 404 quando não existe (antes devolvia null
            // e a checagem seguinte era inalcançável).
            const existingCharacter = await this.charactersRepository.findById(id);

            const updatedCharacter = await this.charactersRepository.update(id, data);

            // Imagem trocada: remove o arquivo antigo para não deixar órfão.
            if (data.image && existingCharacter.image && existingCharacter.image !== data.image) {
                await deleteCharacterImage(existingCharacter.image);
            }

            return {
                status: 'success',
                data: updatedCharacter
            };
        } catch (error) {
            if (error instanceof AppError) throw error;

            if (error instanceof Error) {
                throw new Error(`Failed to update character: ${error.message}`, { cause: error });
            }
            throw new Error('Failed to update character: Unknown error', { cause: error });
        }
    }
}
