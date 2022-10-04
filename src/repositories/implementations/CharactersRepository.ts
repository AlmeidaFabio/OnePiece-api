import { Like, Repository } from "typeorm";
import { AppDataSource } from "../../database/connections/mysql";
import { ICharacterDTO } from "../../dtos/ICharacterDTO";
import { IImageDTO } from "../../dtos/IImageDTO";
import { IListCharacterResponseDTO } from "../../dtos/IListCharacterResponseDTO";
import { Character } from "../../entities/Character";
import { Image } from "../../entities/Image";
import { ICharactersRepository } from "../ICharactersRepositorry";
import { unlink } from 'fs/promises'

export class CharactersRepository implements ICharactersRepository {
    private charactersRepository: Repository<Character>;
    private imagesRepository: Repository<Image>;

    constructor()  {
        this.charactersRepository = AppDataSource.getRepository(Character)
        this.imagesRepository = AppDataSource.getRepository(Image)
    }

    async create(data: ICharacterDTO, img: IImageDTO): Promise<Character> {
        const character = this.charactersRepository.create({
            name: data.name,
            denomination: data.denomination,
            category: data.category,
            description: data.description,
            devilFruit: data.devilFruit
        })
        
        await this.charactersRepository.save(character)

        const image = this.imagesRepository.create({
            url: img.url,
            characterId: character.id
        })

        await this.imagesRepository.save(image)

        return character
    }

    async read(page?:string, limit?:string): Promise<IListCharacterResponseDTO> {
        const characters: Character[] = await this.charactersRepository.find({
            relations:["image"],
               order: {name: "ASC"},
               take:(parseInt(limit) * 1),
               skip:((parseInt(page) - 1) * parseInt(limit))
        }).catch(error => error)

        const countChars: Character[] = await this.charactersRepository.find()
        const count = countChars.length;

        return {
            data: characters,
            count
        }
    }

    async getById(id: string): Promise<Character> {
        const character = await this.charactersRepository.findOne({
            where:{
                id
            },
            relations: ["image"]
        }).catch(error => error)

        return character
    }

    async update(id: string, data: ICharacterDTO, img?:IImageDTO): Promise<void> {
        await this.charactersRepository.update(id, {
            name: data.name,
            denomination: data.denomination,
            category: data.category,
            description: data.description,
            devilFruit: data.devilFruit
        }).catch(error => error)

        if(img) {
            const oldImage: Image = await this.imagesRepository.findOne({
                where: {
                    characterId: id
                }
            }).catch(error => error)
    
            if(oldImage) {
                await unlink(oldImage.url).catch(error => error)
                await this.imagesRepository.delete(oldImage.id).catch(error => error)
            }
            
            const newImage = this.imagesRepository.create({
                url: img.url,
                characterId: id
            })
    
            await this.imagesRepository.save(newImage)
        }

        return
    }

    async delete(id: string): Promise<void> {
        return await this.charactersRepository.delete(id).catch(error => error)
    }

    async search(text: string): Promise<Character[]> {
        const result = await this.charactersRepository.find({
            where:[{
                name: Like(`%${text}%`)
            }],
            relations:["image"]
        }).catch(error => error)

        return result
    }
}