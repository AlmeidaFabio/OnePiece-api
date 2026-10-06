/**
 * Ficha usada pelo seed.
 *
 * `bounty` é opcional de propósito: recompensa só existe para procurados, então
 * 37 das 67 fichas (Marinha, Governo Mundial, CP0 e civis) não têm valor. Quando
 * o campo é omitido, o seed não toca no que já está gravado — o default 0 do
 * banco só se aplica na criação. Ou seja: 0 significa "sem recompensa conhecida",
 * e não "recompensa igual a zero".
 *
 * `image` não faz parte da ficha: a imagem de um personagem vem do upload em
 * POST/PUT /api/characters, que grava o arquivo em public/images e monta a URL.
 * O seed antes trazia páginas da wiki do Fandom nesse campo, que não são imagens.
 *
 * `crew` usa sempre o nome canônico da organização. Qualificadores como
 * "(SWORD)", "(aposentado)", "(falecido)" ou "CP9 (ex)" ficam na descrição.
 */
export interface SeedCharacter {
    name: string;
    description: string;
    bounty?: number;
    devilFruit?: string;
    crew?: string;
}

export const characters: SeedCharacter[] = [
    {
        name: 'Monkey D. Luffy',
        description:
            'Capitão dos Piratas do Chapéu de Palha. Comedor da Gomu Gomu no Mi, uma Akuma no Mi do tipo Paramecia que o transforma em um Homem-Borracha. Seu sonho é se tornar o Rei dos Piratas.',
        bounty: 3000000000,
        devilFruit: 'Gomu Gomu no Mi',
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Roronoa Zoro',
        description:
            'Espadachim dos Piratas do Chapéu de Palha. Usa o estilo de três espadas e sonha em se tornar o maior espadachim do mundo.',
        bounty: 1111000000,
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Nami',
        description:
            'Navegadora dos Piratas do Chapéu de Palha. Especialista em navegação e meteorologia, sonha em desenhar um mapa completo do mundo.',
        bounty: 366000000,
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Usopp',
        description:
            'Atirador dos Piratas do Chapéu de Palha. Especialista em sniping e inventor, sonha em se tornar um bravo guerreiro do mar.',
        bounty: 500000000,
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Sanji',
        description:
            'Cozinheiro dos Piratas do Chapéu de Palha. Especialista em artes marciais usando apenas as pernas, sonha em encontrar o All Blue.',
        bounty: 1032000000,
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Tony Tony Chopper',
        description:
            'Médico dos Piratas do Chapéu de Palha. Comedor da Hito Hito no Mi, uma Akuma no Mi que o transforma em um humano. Sonha em se tornar um médico capaz de curar qualquer doença.',
        bounty: 1000,
        devilFruit: 'Hito Hito no Mi',
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Nico Robin',
        description:
            'Arqueóloga dos Piratas do Chapéu de Palha. Comedora da Hana Hana no Mi, que permite criar partes do corpo em qualquer superfície. Última sobrevivente da Ilha Ohara.',
        bounty: 930000000,
        devilFruit: 'Hana Hana no Mi',
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Franky',
        description:
            'Carpinteiro dos Piratas do Chapéu de Palha. Ciborgue que construiu o Thousand Sunny. Sonha em ver o navio navegar pelo mundo inteiro.',
        bounty: 394000000,
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Brook',
        description:
            'Músico dos Piratas do Chapéu de Palha. Comedor da Yomi Yomi no Mi, que o trouxe de volta à vida como um esqueleto. Sonha em reencontrar Laboon.',
        bounty: 383000000,
        devilFruit: 'Yomi Yomi no Mi',
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Jinbe',
        description:
            'Timoneiro dos Piratas do Chapéu de Palha. Ex-Shichibukai e ex-capitão dos Piratas do Sol. Especialista em karatê dos homens-peixe.',
        bounty: 1100000000,
        crew: 'Piratas do Chapéu de Palha'
    },
    {
        name: 'Marshall D. Teach',
        description:
            "Conhecido como 'Barba Negra', é o capitão dos Piratas do Barba Negra e um dos Quatro Imperadores do Mar. Único conhecido na história a possuir duas Devil Fruits simultaneamente: a Yami Yami no Mi e a Gura Gura no Mi.",
        bounty: 3996000000,
        devilFruit: 'Yami Yami no Mi',
        crew: 'Piratas do Barba Negra'
    },
    {
        name: 'Shanks',
        description:
            "Conhecido como 'Shanks o Ruivo', é o capitão dos Piratas do Ruivo e um dos Quatro Imperadores do Mar. Ex-membro dos Piratas do Roger e responsável por entregar o chapéu de palha a Luffy.",
        bounty: 4048900000,
        crew: 'Piratas do Ruivo'
    },
    {
        name: 'Buggy',
        description:
            "Conhecido como 'Buggy, o Palhaço', é o líder de fachada do Cross Guild (formado também por Crocodile e Mihawk) e reconhecido pelo Governo Mundial como um dos Quatro Imperadores. Ex-membro dos Piratas do Roger.",
        bounty: 3189000000,
        devilFruit: 'Bara Bara no Mi',
        crew: 'Cross Guild'
    },
    {
        name: 'Trafalgar D. Water Law',
        description:
            "Conhecido como 'Law, o Cirurgião da Morte', é o capitão dos Piratas do Coração e ex-Corsário. Aliado de longa data de Luffy, ajudou a derrotar Doflamingo, Kaidou e Big Mom.",
        bounty: 3000000000,
        devilFruit: 'Ope Ope no Mi',
        crew: 'Piratas do Coração'
    },
    {
        name: 'Eustass "Captain" Kid',
        description:
            'Capitão dos Piratas Kid, membro da Pior Geração. Aliou-se a Law para derrotar Big Mom durante o Raid em Onigashima.',
        bounty: 3000000000,
        devilFruit: 'Jiki Jiki no Mi',
        crew: 'Piratas Kid'
    },
    {
        name: 'Jewelry Bonney',
        description:
            "Capitã dos Piratas Bonney, conhecida como 'Big Eater'. Única mulher entre a Pior Geração. Filha biológica de 'Bartholomew' Kuma.",
        bounty: 320000000,
        devilFruit: 'Toshi Toshi no Mi',
        crew: 'Piratas Bonney'
    },
    {
        name: 'Capone "Gang" Bege',
        description:
            'Capitão dos Piratas Fire Tank, ex-chefe de uma das Cinco Famílias do West Blue. Pode transformar seu corpo em uma fortaleza móvel.',
        bounty: 350000000,
        devilFruit: 'Shiro Shiro no Mi',
        crew: 'Piratas Fire Tank'
    },
    {
        name: 'Scratchmen Apoo',
        description:
            'Capitão dos Piratas On Air, ex-espião infiltrado dos Piratas Besta a serviço de Kaidou. Transforma partes do corpo em instrumentos musicais para atacar.',
        bounty: 350000000,
        devilFruit: 'Oto Oto no Mi',
        crew: 'Piratas On Air'
    },
    {
        name: 'Basil Hawkins',
        description:
            "Capitão dos Piratas Hawkins, conhecido como 'Mago'. Usa cartas de tarô para prever o futuro e transfere dano recebido para bonecos de palha feitos de vítimas.",
        bounty: 320000000,
        devilFruit: 'Wara Wara no Mi',
        crew: 'Piratas Hawkins'
    },
    {
        name: 'X Drake',
        description:
            'Capitão dos Piratas Drake, ex-Contra-Almirante da Marinha e membro infiltrado do SWORD. Pode se transformar em um Alossauro.',
        bounty: 222000000,
        devilFruit: 'Ryu Ryu no Mi, Model: Alossauro',
        crew: 'Piratas Drake'
    },
    {
        name: 'Killer',
        description:
            "Imediato dos Piratas Kid, conhecido como 'Soldado Massacre'. Luta com um par de foices giratórias e não possui Devil Fruit.",
        bounty: 200000000,
        crew: 'Piratas Kid'
    },
    {
        name: 'Urouge',
        description:
            "Capitão dos Piratas Monge Caído, conhecido como 'Monge Louco'. Sua Devil Fruit converte dano recebido em força física, mas seu nome oficial nunca foi revelado.",
        bounty: 108000000,
        devilFruit: 'Desconhecida (Paramecia)',
        crew: 'Piratas Monge Caído'
    },
    {
        name: 'Imu',
        description:
            "Conhecido como 'Imu-sama', é a autoridade secreta máxima do mundo, ocupante do Trono Vazio em Mary Geoise. Governa acima até mesmo dos Cinco Anciãos, e sua existência é o maior segredo do Governo Mundial.",
        crew: 'Governo Mundial'
        // bounty, devilFruit e image omitidos: não revelados oficialmente até o momento
    },
    {
        name: 'Jaygarcia Saturn',
        description:
            'Ex-membro dos Cinco Anciãos, Deus Guerreiro da Ciência e Defesa. Morto pelo próprio Imu no fim do Incidente de Egghead após falhar em conter a situação. Sucedido por Figarland Garling.',
        devilFruit: 'Desconhecida (Zoan Mítica - forma: Gyuki)',
        crew: 'Governo Mundial'
    },
    {
        name: 'Marcus Mars',
        description:
            'Membro dos Cinco Anciãos, Deus Guerreiro do Meio Ambiente. Responsável por ordenar a destruição de Ohara e por controlar a censura de informações sobre o Século Vazio.',
        devilFruit: 'Desconhecida (Zoan Mítica - forma: Itsumade)',
        crew: 'Governo Mundial'
    },
    {
        name: 'Topman Warcury',
        description:
            'Membro dos Cinco Anciãos, Deus Guerreiro da Justiça. Representa o sistema de recompensas e o controle do mundo pirata por parte do Governo Mundial.',
        devilFruit: 'Desconhecida (Zoan Mítica - forma: Fengxi)',
        crew: 'Governo Mundial'
    },
    {
        name: 'Ethanbaron V. Nusjuro',
        description:
            'Membro dos Cinco Anciãos, Deus Guerreiro das Finanças. Carrega uma espada identificada como a lendária Shodai Kitetsu.',
        devilFruit: 'Desconhecida (Zoan Mítica - forma: Bakotsu)',
        crew: 'Governo Mundial'
    },
    {
        name: 'Shepherd Ju Peter',
        description:
            'Membro dos Cinco Anciãos, Deus Guerreiro da Agricultura. Conhecido por sua disposição em ordenar execuções imediatas como forma de controle pelo medo.',
        devilFruit: 'Desconhecida (Zoan Mítica - forma: Sandworm)',
        crew: 'Governo Mundial'
    },
    {
        name: 'Sengoku',
        description:
            'Ex-Almirante de Frota da Marinha, liderou a corporação durante a Era de Ouro da Pirataria e a Guerra de Marineford.',
        devilFruit: 'Hito Hito no Mi, Model: Daibutsu',
        crew: 'Marinha'
    },
    {
        name: 'Monkey D. Garp',
        description:
            "Vice-Almirante conhecido como 'O Herói da Marinha' por capturar o Rei dos Piratas Gol D. Roger. Avô de Luffy e mentor de Koby e Helmeppo.",
        crew: 'Marinha'
    },
    {
        name: 'Sakazuki',
        description:
            "Conhecido como 'Akainu', é o atual Almirante de Frota da Marinha, conhecido por sua justiça absoluta e métodos extremamente brutais.",
        devilFruit: 'Magu Magu no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Borsalino',
        description:
            "Conhecido como 'Kizaru', é um dos Almirantes da Marinha, famoso por sua velocidade da luz e atitude descontraída mesmo em combate.",
        devilFruit: 'Pika Pika no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Issho',
        description:
            "Conhecido como 'Fujitora', é um dos Almirantes da Marinha. Cego, mas extremamente perceptivo, busca um conceito de justiça mais flexível.",
        devilFruit: 'Zushi Zushi no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Aramaki',
        description:
            "Conhecido como 'Ryokugyu', é um dos Almirantes da Marinha, capaz de transformar matéria orgânica ao redor em madeira e vegetação.",
        devilFruit: 'Mori Mori no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Smoker',
        description:
            'Vice-Almirante da Marinha, rival antigo de Luffy desde Loguetown. Capaz de gerar e manipular fumaça.',
        devilFruit: 'Moku Moku no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Tsuru',
        description: 'Vice-Almirante veterana da Marinha, avó de Kujaku. Capaz de gerar ondas sonoras devastadoras.',
        devilFruit: 'Goe Goe no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Momonga',
        description:
            'Vice-Almirante da Marinha, participou da Guerra de Marineford e de operações contra os Piratas do Chapéu de Palha.',
        crew: 'Marinha'
    },
    {
        name: 'Doll',
        description:
            'Vice-Almirante da Marinha, capaz de manipular cores para alterar as propriedades físicas de objetos e pessoas.',
        devilFruit: 'Iro Iro no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Gion',
        description: "Conhecida como 'Momousagi', é uma Vice-Almirante da Marinha e hábil espadachim.",
        crew: 'Marinha'
    },
    {
        name: 'Tokikake',
        description: "Conhecido como 'Chaton', é um Vice-Almirante da Marinha.",
        crew: 'Marinha'
    },
    {
        name: 'Koby',
        description:
            "Capitão da Marinha e membro do SWORD, conhecido como 'O Herói' após o Incidente do Porto Rocky. Treinado por Garp, foi o primeiro amigo de viagem de Luffy.",
        crew: 'Marinha'
    },
    {
        name: 'Helmeppo',
        description:
            'Tenente-Comandante da Marinha e membro do SWORD. Filho do ex-Capitão Morgan, foi treinado por Garp ao lado de Koby.',
        crew: 'Marinha'
    },
    {
        name: 'Hibari',
        description:
            'Comandante da Marinha e membro do SWORD. Atiradora de elite, utiliza balas especiais como as Flower Bullets.',
        crew: 'Marinha'
    },
    {
        name: 'Prince Grus',
        description:
            'Contra-Almirante da Marinha e membro do SWORD, capaz de criar e controlar argila para moldar armas e soldados.',
        devilFruit: 'Gunyo Gunyo no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Kujaku',
        description:
            'Contra-Almirante da Marinha, neta de Tsuru e membro do SWORD. Capaz de controlar objetos e seres com chicotes.',
        devilFruit: 'Muchi Muchi no Mi',
        crew: 'Marinha'
    },
    {
        name: 'Rob Lucci',
        description:
            "Agente mascarado do CP0, conhecido como 'Arma do Massacre'. Ex-membro mais forte da história do CP9, infiltrou-se em Water 7 por 5 anos para obter os planos do Pluton.",
        devilFruit: 'Neko Neko no Mi, Model: Leopardo',
        crew: 'CP0'
    },
    {
        name: 'Kaku',
        description:
            'Agente mascarado do CP0, braço-direito de Lucci e ex-membro do CP9. Mestre espadachim e usuário avançado de Rankyaku.',
        devilFruit: 'Ushi Ushi no Mi, Model: Girafa',
        crew: 'CP0'
    },
    {
        name: 'Stussy',
        description:
            'Clone da Buckingham Stussy original, ex-membro dos Piratas Rocks. Atuava como agente tripla a serviço de Vegapunk dentro do CP0. Traiu Lucci e Kaku em Egghead e foi morta por Lucci logo em seguida.',
        crew: 'CP0'
    },
    {
        name: 'Guernica',
        description:
            'Agente mascarado do CP0. Recebeu ordens dos Cinco Anciãos para eliminar Luffy durante o Raid em Onigashima, mas foi morto por Kaidou ao interferir na luta.',
        crew: 'CP0'
    },
    {
        name: 'Joseph',
        description:
            'Agente mascarado do CP0, membro da Tribo dos Braços Longos. Desapareceu durante a Operação em Wano após contato com os Piratas Big Mom; seu paradeiro é desconhecido até hoje.',
        crew: 'CP0'
    },
    {
        name: 'Kalifa',
        description:
            'Única mulher do CP9 original, ex-secretária disfarçada de Iceberg em Water 7. Após a derrota em Enies Lobby, voltou a servir o Governo Mundial como agente não-mascarada do CP0.',
        devilFruit: 'Awa Awa no Mi',
        crew: 'CP0'
    },
    {
        name: 'Blueno',
        description:
            'Ex-membro do CP9, disfarçado de barman em Water 7 por anos. Hoje atua como agente não-mascarado do CP0.',
        devilFruit: 'Doa Doa no Mi',
        crew: 'CP0'
    },
    {
        name: 'Jabra',
        description:
            'Ex-membro do CP9, um dos mais fortes fisicamente do grupo original. Hoje atua como agente não-mascarado do CP0.',
        devilFruit: 'Inu Inu no Mi, Model: Lobo',
        crew: 'CP0'
    },
    {
        name: 'Kumadori',
        description:
            'Ex-membro do CP9, mestre do Life Return apesar de não possuir Devil Fruit. Hoje atua como agente não-mascarado do CP0.',
        crew: 'CP0'
    },
    {
        name: 'Fukurou',
        description:
            'Ex-membro do CP9, responsável por avaliar o nível de força (Doriki) dos outros agentes. Não possui Devil Fruit. Hoje atua como agente não-mascarado do CP0.',
        crew: 'CP0'
    },
    {
        name: 'Spandam',
        description:
            'Ex-chefe do CP9, filho de Spandine. Apesar de não dominar o Rokushiki, utilizava a espada Funkfreed e algemas de Kairoseki. Perdeu autoridade após o fracasso em Enies Lobby.',
        crew: 'Governo Mundial'
    },
    {
        name: 'Monkey D. Dragon',
        description:
            "Líder Supremo do Exército Revolucionário, conhecido como 'O Pior Criminoso do Mundo'. Pai de Luffy e filho de Garp. Seus poderes permanecem um mistério.",
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Sabo',
        description:
            "Chefe de Gabinete do Exército Revolucionário, conhecido como 'Imperador das Chamas'. Irmão de juramento de Luffy e Ace, herdou a Mera Mera no Mi após a morte de Ace.",
        bounty: 602000000,
        devilFruit: 'Mera Mera no Mi',
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Emporio Ivankov',
        description:
            'Comandante do Exército G (Grand Line) e um dos fundadores do Exército Revolucionário. Rainha das Okamas de Kamabakka, capaz de manipular hormônios.',
        bounty: 100000000,
        devilFruit: 'Horu Horu no Mi',
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Bartholomew Kuma',
        description:
            'Ex-Shichibukai e membro fundador do Exército Revolucionário, pai adotivo de Jewelry Bonney. Foi resgatado de Mary Geoise por seus companheiros e segue vivo, com o corpo reparado.',
        bounty: 296000000,
        devilFruit: 'Nikyu Nikyu no Mi',
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Karasu',
        description:
            'Comandante do Exército do Norte. Capaz de se transformar em fuligem e assumir a forma de um bando de corvos para combate e reconhecimento.',
        bounty: 400000000,
        devilFruit: 'Susu Susu no Mi',
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Belo Betty',
        description:
            'Comandante do Exército do Leste, sucessora de Ginny. Capaz de inspirar coragem e força em civis através de sua Devil Fruit.',
        bounty: 457000000,
        devilFruit: 'Kobu Kobu no Mi',
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Morley',
        description:
            'Comandante do Exército do Oeste, uma giganta okama. Capaz de moldar e escavar terra como se fosse argila.',
        bounty: 293000000,
        devilFruit: 'Oshi Oshi no Mi',
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Lindbergh',
        description:
            'Comandante do Exército do Sul, membro da tribo Mink. Inventor habilidoso e atirador de elite, não possui Devil Fruit.',
        bounty: 316000000,
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Koala',
        description:
            'Oficial do Exército Revolucionário, ex-escrava resgatada por Fisher Tiger. Especialista em Fish-Man Karate, treinada por Jinbe.',
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Hack',
        description: 'Oficial do Exército Revolucionário e instrutor de Fish-Man Karate, ex-membro dos Piratas do Sol.',
        crew: 'Exército Revolucionário'
    },
    {
        name: 'Inazuma',
        description:
            'Vice-Comandante do Exército G, ex-membro dos Piratas Kuja. Capaz de cortar e remodelar matéria sólida, incluindo o próprio corpo.',
        bounty: 100000000,
        devilFruit: 'Choki Choki no Mi',
        crew: 'Exército Revolucionário'
    }
];
