export interface ICharacterDTO {
    name: string;
    description: string;
    bounty: number;
    devilFruit?: string;
    crew?: string;
    image?: string;
}

export interface ICharacterResponseDTO extends ICharacterDTO {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICharacterImageDTO {
    url: string;
    characterId: string;
}

export interface ICharacterImageResponseDTO extends ICharacterImageDTO {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}