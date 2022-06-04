import { ICharactersRepository } from "../../repositories/ICharactersRepositorry";

export class ListCharactersUseCase {
    constructor(private charactersRepository: ICharactersRepository) {}

    async execute(page?:string, limit?:string) {
        const res = await this.charactersRepository.read(page, limit).catch(error => error)

        return res
    }
}