import { ICharacterDTO, ICharacterResponseDTO } from "../../dtos/ICharacterDTO";
import { ICharactersRepository } from "../../repositories/ICharactersRepository";

export class CreateCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(data: ICharacterDTO): Promise<ICharacterResponseDTO> {
        try {
           
            const character = await this.charactersRepository.create(data);

            return character;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create character: ${error.message}`);
            }
            throw new Error("Failed to create character: Unknown error");
        }
    }
}