import { Character } from "@prisma/client";
import { ICharacterDTO } from "../dtos/ICharacterDTO";
import { IImageDTO } from "../dtos/IImageDTO";
import { IListCharacterResponseDTO } from "../dtos/IListCharacterResponseDTO";


export interface ICharactersRepository {
    create(character: ICharacterDTO, image: IImageDTO): Promise<Character>;
    read(page?:string, limit?:string): Promise<IListCharacterResponseDTO>;
    getById(id: string): Promise<Character>;
    update(id:string, data: ICharacterDTO, image?:IImageDTO): Promise<void>;
    delete(id:string): Promise<void>;
    search(text: string): Promise<Character[]>;
}