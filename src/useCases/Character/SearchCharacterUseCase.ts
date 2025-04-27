import { ICharactersRepository } from "../../repositories/ICharactersRepository";

export class SearchCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(txt: string) {
        const result = await this.charactersRepository.search(txt).catch(error => error)

        return result
    }
}