import { ICharactersRepository } from '../../repositories/ICharactersRepository';
import { AppError } from '../../errors/AppError';
import { deleteCharacterImage } from '../../utils/characterImage';

export class DeleteCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(id: string) {
        try {
            // Lança AppError 404 quando o personagem não existe.
            const existingCharacter = await this.charactersRepository.findById(id);

            await this.charactersRepository.delete(id);

            // Remove também o arquivo da imagem: antes ficava órfão em public/images.
            await deleteCharacterImage(existingCharacter.image);

            return {
                status: 'success',
                message: 'Character deleted successfully'
            };
        } catch (error) {
            if (error instanceof AppError) throw error;

            if (error instanceof Error) {
                throw new Error(`Failed to delete character: ${error.message}`, { cause: error });
            }
            throw new Error('Failed to delete character: Unknown error', { cause: error });
        }
    }
}
