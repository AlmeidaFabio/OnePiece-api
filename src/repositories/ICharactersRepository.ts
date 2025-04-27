import { ICharacterDTO, ICharacterResponseDTO, ICharacterImageDTO, ICharacterImageResponseDTO } from "../dtos/ICharacterDTO";

export interface ICharactersRepository {
    create(character: ICharacterDTO): Promise<ICharacterResponseDTO>;
    findAll(filters: {
        name?: string;
        crew?: string;
        hasDevilFruit?: boolean;
        minBounty?: number;
        maxBounty?: number;
        page?: number;
        limit?: number;
    }): Promise<{
        characters: ICharacterResponseDTO[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<ICharacterResponseDTO>;
    update(id: string, data: Partial<ICharacterDTO>): Promise<ICharacterResponseDTO>;
    delete(id: string): Promise<void>;
    addImage(characterId: string, image: ICharacterImageDTO): Promise<ICharacterImageResponseDTO>;
    removeImage(imageId: string): Promise<void>;
    search(txt: string): Promise<{
        characters: ICharacterResponseDTO[];
        total: number;
        page: number;
        limit: number;
    }>;
}