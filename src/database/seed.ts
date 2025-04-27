import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const characters = [
    {
        name: "Monkey D. Luffy",
        description: "Capitão dos Piratas do Chapéu de Palha. Comedor da Gomu Gomu no Mi, uma Akuma no Mi do tipo Paramecia que o transforma em um Homem-Borracha. Seu sonho é se tornar o Rei dos Piratas.",
        bounty: 3000000000,
        devilFruit: "Gomu Gomu no Mi",
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Monkey_D._Luffy"
    },
    {
        name: "Roronoa Zoro",
        description: "Espadachim dos Piratas do Chapéu de Palha. Usa o estilo de três espadas e sonha em se tornar o maior espadachim do mundo.",
        bounty: 1111000000,
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Roronoa_Zoro"
    },
    {
        name: "Nami",
        description: "Navegadora dos Piratas do Chapéu de Palha. Especialista em navegação e meteorologia, sonha em desenhar um mapa completo do mundo.",
        bounty: 366000000,
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Nami"
    },
    {
        name: "Usopp",
        description: "Atirador dos Piratas do Chapéu de Palha. Especialista em sniping e inventor, sonha em se tornar um bravo guerreiro do mar.",
        bounty: 500000000,
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Usopp"
    },
    {
        name: "Sanji",
        description: "Cozinheiro dos Piratas do Chapéu de Palha. Especialista em artes marciais usando apenas as pernas, sonha em encontrar o All Blue.",
        bounty: 1032000000,
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Sanji"
    },
    {
        name: "Tony Tony Chopper",
        description: "Médico dos Piratas do Chapéu de Palha. Comedor da Hito Hito no Mi, uma Akuma no Mi que o transforma em um humano. Sonha em se tornar um médico capaz de curar qualquer doença.",
        bounty: 1000,
        devilFruit: "Hito Hito no Mi",
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Tony_Tony_Chopper"
    },
    {
        name: "Nico Robin",
        description: "Arqueóloga dos Piratas do Chapéu de Palha. Comedora da Hana Hana no Mi, que permite criar partes do corpo em qualquer superfície. Última sobrevivente da Ilha Ohara.",
        bounty: 930000000,
        devilFruit: "Hana Hana no Mi",
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Nico_Robin"
    },
    {
        name: "Franky",
        description: "Carpinteiro dos Piratas do Chapéu de Palha. Ciborgue que construiu o Thousand Sunny. Sonha em ver o navio navegar pelo mundo inteiro.",
        bounty: 394000000,
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Franky"
    },
    {
        name: "Brook",
        description: "Músico dos Piratas do Chapéu de Palha. Comedor da Yomi Yomi no Mi, que o trouxe de volta à vida como um esqueleto. Sonha em reencontrar Laboon.",
        bounty: 383000000,
        devilFruit: "Yomi Yomi no Mi",
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Brook"
    },
    {
        name: "Jinbe",
        description: "Timoneiro dos Piratas do Chapéu de Palha. Ex-Shichibukai e ex-capitão dos Piratas do Sol. Especialista em karatê dos homens-peixe.",
        bounty: 1100000000,
        crew: "Piratas do Chapéu de Palha",
        image: "https://onepiece.fandom.com/wiki/Jinbe"
    }
];

async function main() {
    console.log('Iniciando seed do banco de dados...');

    // Limpa a tabela de personagens
    await prisma.character.deleteMany();

    // Insere os personagens
    for (const character of characters) {
        await prisma.character.create({
            data: character
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