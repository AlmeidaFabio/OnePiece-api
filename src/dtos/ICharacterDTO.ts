export interface ICharacterDTO {
    name: string;
    description: string;
    /** number na API; o banco guarda como BigInt (o maior bounty passa de 4 bilhões). */
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
