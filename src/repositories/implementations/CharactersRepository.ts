import { ICharacterDTO, ICharacterResponseDTO, ICharacterImageDTO, ICharacterImageResponseDTO } from "../../dtos/ICharacterDTO";
import { ICharactersRepository } from "../ICharactersRepository";
import { unlink } from 'fs/promises';
import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export class CharactersRepository implements ICharactersRepository {
    async create(data: ICharacterDTO): Promise<ICharacterResponseDTO> {
        const character = await prisma.character.create({
            data: {
                name: data.name,
                description: data.description,
                bounty: data.bounty,
                devilFruit: data.devilFruit,
                crew: data.crew,
                image: data.image
            }
        });

        return {
            ...character,
            devilFruit: character.devilFruit || undefined,
            crew: character.crew || undefined,
            image: character.image || undefined
        };
    }

    async findAll(filters: {
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
    }> {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;

        const where: Prisma.CharacterWhereInput = {
            AND: [
                filters.name ? { name: { contains: filters.name, mode: 'insensitive' as const } } : {},
                filters.crew ? { crew: { contains: filters.crew, mode: 'insensitive' as const } } : {},
                filters.hasDevilFruit !== undefined 
                    ? { devilFruit: filters.hasDevilFruit ? { not: null } : null }
                    : {},
                {
                    bounty: {
                        ...(filters.minBounty ? { gte: filters.minBounty } : {}),
                        ...(filters.maxBounty ? { lte: filters.maxBounty } : {})
                    }
                }
            ].filter(condition => {
                if (Object.keys(condition).length === 0) return false;
                if (condition.bounty && Object.keys(condition.bounty).length === 0) return false;
                return true;
            })
        };

        const total = await prisma.character.count({ where });
        const characters = await prisma.character.findMany({
            where,
            orderBy: {
                name: 'asc'
            },
            skip,
            take: limit
        });

        return {
            characters: characters.map(char => ({
                ...char,
                devilFruit: char.devilFruit || undefined,
                crew: char.crew || undefined,
                image: char.image || undefined
            })),
            total,
            page,
            limit
        };
    }

    async findById(id: string): Promise<ICharacterResponseDTO> {
        try {
            const character = await prisma.character.findUnique({
                where: { id }
            });

            if (!character) {
                throw new Error(`Character with ID ${id} not found`);
            }

            return {
                ...character,
                devilFruit: character.devilFruit || undefined,
                crew: character.crew || undefined,
                image: character.image || undefined
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2023') {
                    throw new Error('Invalid ID format');
                }
            }
            throw error;
        }
    }

    async update(id: string, data: Partial<ICharacterDTO>): Promise<ICharacterResponseDTO> {
        const character = await prisma.character.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                bounty: data.bounty,
                devilFruit: data.devilFruit,
                crew: data.crew,
                image: data.image
            }
        });

        return {
            ...character,
            devilFruit: character.devilFruit || undefined,
            crew: character.crew || undefined,
            image: character.image || undefined
        };
    }

    async delete(id: string): Promise<void> {
        await prisma.character.delete({
            where: { id }
        });
    }

    async addImage(characterId: string, image: ICharacterImageDTO): Promise<ICharacterImageResponseDTO> {
        const newImage = await prisma.image.create({
            data: {
                url: image.url,
                characterId
            }
        });

        return newImage;
    }

    async removeImage(imageId: string): Promise<void> {
        const image = await prisma.image.findUnique({
            where: { id: imageId }
        });

        if (image) {
            await unlink(image.url);
            await prisma.image.delete({
                where: { id: imageId }
            });
        }
    }

    async search(txt: string): Promise<{
        characters: ICharacterResponseDTO[];
        total: number;
        page: number;
        limit: number;
    }> {
        const page = 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const where: Prisma.CharacterWhereInput = {
            OR: [
                { name: { contains: txt, mode: 'insensitive' as const } },
                { description: { contains: txt, mode: 'insensitive' as const } },
                { crew: { contains: txt, mode: 'insensitive' as const } },
                { devilFruit: { contains: txt, mode: 'insensitive' as const } }
            ]
        };

        const [characters, total] = await Promise.all([
            prisma.character.findMany({
                where,
                orderBy: {
                    name: 'asc'
                },
                skip,
                take: limit
            }),
            prisma.character.count({ where })
        ]);

        return {
            characters: characters.map(char => ({
                ...char,
                devilFruit: char.devilFruit || undefined,
                crew: char.crew || undefined,
                image: char.image || undefined
            })),
            total,
            page,
            limit
        };
    }
}