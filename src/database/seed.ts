import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { characters } from "./data/characters";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Iniciando seed do banco de dados...');

    // Insere novos personagens ou atualiza os existentes (sem apagar os demais)
    for (const character of characters) {
        await prisma.character.upsert({
            where: { name: character.name },
            update: character,
            create: character
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