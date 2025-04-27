import { ICharactersRepository } from "../../repositories/ICharactersRepository";

export class GetCharacterByIdUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(id:string) {
        const character = await this.charactersRepository.getById(id).catch(error => error);

        return character
    }
}