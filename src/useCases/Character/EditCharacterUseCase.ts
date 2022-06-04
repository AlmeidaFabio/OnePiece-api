import { ICharacterDTO } from "../../dtos/ICharacterDTO";
import { IImageDTO } from "../../dtos/IImageDTO";
import { ICharactersRepository } from "../../repositories/ICharactersRepositorry";

export class EditCharacterUseCase {
    constructor(private charactersRepository: ICharactersRepository){}

    async execute(id:string, data:ICharacterDTO, img?:IImageDTO) {
        return await this.charactersRepository.update(id, data, img).catch(error => error)
    }
}