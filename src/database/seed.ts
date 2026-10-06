import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { characters } from './data/characters';

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Iniciando seed do banco de dados...');

    // Insere novos personagens ou atualiza os existentes (sem apagar os demais)
    for (const character of characters) {
        // bounty é BigInt no banco e as fichas que não declaram recompensa não
        // devem sobrescrever o valor existente: por isso a chave é omitida em vez
        // de virar 0 (o default do banco só se aplica na criação).
        const data = character.bounty === undefined ? character : { ...character, bounty: BigInt(character.bounty) };

        await prisma.character.upsert({
            where: { name: character.name },
            update: data,
            create: data
        });
    }

    console.log('Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('Erro durante o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
