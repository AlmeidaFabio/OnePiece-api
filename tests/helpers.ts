import request from 'supertest';
import bcrypt from 'bcrypt';
import { app } from '../src/app';
import prisma from '../src/config/prisma';

export const api = () => request(app);

/** Limpa as tabelas entre testes. `CASCADE` cobre a FK que ainda existir. */
export const resetDatabase = async (): Promise<void> => {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Character", "Admin" RESTART IDENTITY CASCADE');
};

export const disconnect = async (): Promise<void> => {
    await prisma.$disconnect();
};

export const DEFAULT_ADMIN = { email: 'admin@teste.local', password: 'Senha1!' };

export const createAdmin = async (email: string = DEFAULT_ADMIN.email, password: string = DEFAULT_ADMIN.password) => {
    const hash = await bcrypt.hash(password, 10);

    return prisma.admin.create({
        data: { email, password: hash },
        select: { id: true, email: true }
    });
};

/**
 * Cria o admin se ainda não existir e devolve um token válido.
 * A criação é idempotente porque vários testes precisam de token e chamam isto
 * mais de uma vez dentro do mesmo caso.
 */
export const loginAsAdmin = async (
    email: string = DEFAULT_ADMIN.email,
    password: string = DEFAULT_ADMIN.password
): Promise<string> => {
    const existing = await prisma.admin.findUnique({ where: { email }, select: { id: true } });
    if (!existing) {
        await createAdmin(email, password);
    }

    const response = await api().post('/api/admin/auth').send({ email, password });

    if (response.status !== 200) {
        throw new Error(`login falhou (${response.status}): ${JSON.stringify(response.body)}`);
    }

    return response.body.token as string;
};

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export interface CharacterFixtures {
    name?: string;
    description?: string;
    bounty?: number;
    devilFruit?: string;
    crew?: string;
    image?: string;
}

/**
 * Insere direto pelo Prisma: é mais rápido que passar pela API nos testes que
 * não estão exercitando a criação. `bounty` precisa ser BigInt no banco.
 */
export const seedCharacter = async (data: CharacterFixtures = {}) =>
    prisma.character.create({
        data: {
            name: data.name ?? 'Personagem Teste',
            description: data.description ?? 'Descrição de teste com mais de dez caracteres',
            bounty: BigInt(data.bounty ?? 0),
            devilFruit: data.devilFruit,
            crew: data.crew,
            image: data.image
        }
    });

/** Três personagens com perfis diferentes, para os filtros. */
export const seedCharacters = async (): Promise<void> => {
    await seedCharacter({
        name: 'Luffy Teste',
        description: 'Capitão de teste, tem fruta e recompensa alta',
        bounty: 3000000000,
        devilFruit: 'Gomu Gomu no Mi',
        crew: 'Piratas do Chapéu de Palha'
    });
    await seedCharacter({
        name: 'Marinha Teste',
        description: 'Militar de teste, sem fruta e sem recompensa',
        bounty: 0,
        crew: 'Marinha'
    });
    await seedCharacter({
        name: 'Zoro Teste',
        description: 'Espadachim de teste, sem fruta e com recompensa',
        bounty: 1111000000,
        crew: 'Piratas do Chapéu de Palha'
    });
};
