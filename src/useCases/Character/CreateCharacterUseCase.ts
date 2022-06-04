import { ICharacterDTO } from "../../dtos/ICharacterDTO";
import { IImageDTO } from "../../dtos/IImageDTO";
import { ICharactersRepository } from "../../repositories/ICharactersRepositorry";

export class CreateCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository){}

    async execute(data:ICharacterDTO, image:IImageDTO) {
        return await this.charactersRepository.create(data, image).catch(error => error)
    }
}