import { ICharacterDTO } from "../../dtos/ICharacterDTO";
import { IImageDTO } from "../../dtos/IImageDTO";
import { IListCharacterResponseDTO } from "../../dtos/IListCharacterResponseDTO";
import { ICharactersRepository } from "../ICharactersRepositorry";
import { unlink } from 'fs/promises'
import prisma from "../../config/prisma";

export class CharactersRepository implements ICharactersRepository {
    async create(data: ICharacterDTO, img: IImageDTO): Promise<any> {
        const character = await prisma.character.create({
            data: {
                name: data.name,
                denomination: data.denomination,
                category: data.category,
                description: data.description,
                devilFruit: data.devilFruit,
                images: {
                    create: {
                        url: img.url
                    }
                }
            },
            include: {
                images: true
            }
        });

        return character;
    }

    async read(page?: string, limit?: string): Promise<IListCharacterResponseDTO> {
        const skip = page ? (parseInt(page) - 1) * parseInt(limit || '10') : 0;
        const take = limit ? parseInt(limit) : 10;

        const [characters, count] = await Promise.all([
            prisma.character.findMany({
                include: {
                    images: true
                },
                orderBy: {
                    name: 'asc'
                },
                skip,
                take
            }),
            prisma.character.count()
        ]);

        return {
            data: characters,
            count
        };
    }

    async getById(id: string): Promise<any> {
        const character = await prisma.character.findUnique({
            where: { id },
            include: {
                images: true
            }
        });

        return character;
    }

    async update(id: string, data: ICharacterDTO, img?: IImageDTO): Promise<void> {
        await prisma.character.update({
            where: { id },
            data: {
                name: data.name,
                denomination: data.denomination,
                category: data.category,
                description: data.description,
                devilFruit: data.devilFruit
            }
        });

        if (img) {
            const oldImage = await prisma.image.findFirst({
                where: { characterId: id }
            });

            if (oldImage) {
                await unlink(oldImage.url);
                await prisma.image.delete({
                    where: { id: oldImage.id }
                });
            }

            await prisma.image.create({
                data: {
                    url: img.url,
                    characterId: id
                }
            });
        }
    }

    async delete(id: string): Promise<void> {
        const image = await prisma.image.findFirst({
            where: { characterId: id }
        });

        if (image) {
            await unlink(image.url);
            await prisma.image.delete({
                where: { id: image.id }
            });
        }

        await prisma.character.delete({
            where: { id }
        });
    }

    async search(text: string): Promise<any[]> {
        const characters = await prisma.character.findMany({
            where: {
                name: {
                    contains: text,
                    mode: 'insensitive'
                }
            },
            include: {
                images: true
            }
        });

        return characters;
    }
}