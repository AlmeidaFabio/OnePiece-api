import { ICharacterDTO, ICharacterResponseDTO } from '../dtos/ICharacterDTO';

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
    search(filters: { txt: string; page?: number; limit?: number }): Promise<{
        characters: ICharacterResponseDTO[];
        total: number;
        page: number;
        limit: number;
    }>;
}
