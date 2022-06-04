import { ICharactersRepository } from "../../repositories/ICharactersRepositorry";

export class DeleteCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(id:string) {
        return await this.charactersRepository.delete(id).catch(error => error)
    }
}