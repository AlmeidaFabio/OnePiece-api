import { ICharacterDTO, ICharacterResponseDTO } from '../../dtos/ICharacterDTO';
import { ICharactersRepository } from '../ICharactersRepository';
import prisma from '../../config/prisma';
import { Character, Prisma } from '@prisma/client';
import { AppError } from '../../errors/AppError';

/** Violação de unicidade (nome de personagem já cadastrado). */
const isUniqueConstraintError = (error: unknown): boolean =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

/**
 * Converte o registro do Prisma para o formato da API.
 *
 * `bounty` é BigInt no banco (o maior valor semeado, 4.048.900.000, não cabe em
 * INTEGER) e number na API. A conversão precisa acontecer aqui: JSON.stringify
 * lança exceção ao encontrar um bigint, então o valor nunca pode escapar do
 * repositório como bigint.
 */
const toResponse = (character: Character): ICharacterResponseDTO => ({
    ...character,
    bounty: Number(character.bounty),
    devilFruit: character.devilFruit || undefined,
    crew: character.crew || undefined,
    image: character.image || undefined
});

export class CharactersRepository implements ICharactersRepository {
    async create(data: ICharacterDTO): Promise<ICharacterResponseDTO> {
        try {
            const character = await prisma.character.create({
                data: {
                    name: data.name,
                    description: data.description,
                    bounty: BigInt(data.bounty),
                    devilFruit: data.devilFruit,
                    crew: data.crew,
                    image: data.image
                }
            });

            return toResponse(character);
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                throw new AppError(`Já existe um personagem com o nome "${data.name}"`, 409);
            }
            throw error;
        }
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
                filters.hasDevilFruit !== undefined ? { devilFruit: filters.hasDevilFruit ? { not: null } : null } : {},
                {
                    bounty: {
                        ...(filters.minBounty !== undefined ? { gte: BigInt(filters.minBounty) } : {}),
                        ...(filters.maxBounty !== undefined ? { lte: BigInt(filters.maxBounty) } : {})
                    }
                }
            ].filter((condition) => {
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
            characters: characters.map(toResponse),
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
                throw new AppError(`Character with ID ${id} not found`, 404);
            }

            return toResponse(character);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2023') {
                    throw new AppError('Invalid ID format', 400);
                }
            }
            throw error;
        }
    }

    async update(id: string, data: Partial<ICharacterDTO>): Promise<ICharacterResponseDTO> {
        try {
            const character = await prisma.character.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    // undefined = não alterar (o Prisma ignora a chave).
                    bounty: data.bounty === undefined ? undefined : BigInt(data.bounty),
                    devilFruit: data.devilFruit,
                    crew: data.crew,
                    image: data.image
                }
            });

            return toResponse(character);
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                throw new AppError(`Já existe um personagem com o nome "${data.name}"`, 409);
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new AppError(`Character with ID ${id} not found`, 404);
            }
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        await prisma.character.delete({
            where: { id }
        });
    }

    async search(filters: { txt: string; page?: number; limit?: number }): Promise<{
        characters: ICharacterResponseDTO[];
        total: number;
        page: number;
        limit: number;
    }> {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;

        const where: Prisma.CharacterWhereInput = {
            OR: [
                { name: { contains: filters.txt, mode: 'insensitive' as const } },
                { description: { contains: filters.txt, mode: 'insensitive' as const } },
                { crew: { contains: filters.txt, mode: 'insensitive' as const } },
                { devilFruit: { contains: filters.txt, mode: 'insensitive' as const } }
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
            characters: characters.map(toResponse),
            total,
            page,
            limit
        };
    }
}
