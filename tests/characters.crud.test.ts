import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { api, bearer, disconnect, loginAsAdmin, resetDatabase, seedCharacter } from './helpers';

const UNKNOWN_UUID = '11111111-1111-1111-1111-111111111111';

const novoPersonagem = {
    name: 'Personagem Novo',
    description: 'Descrição de teste com mais de dez caracteres'
};

/**
 * Um único login por arquivo: o rate limit do login é de 10 tentativas, e cada
 * teste autenticando de novo estouraria o limite. O token é stateless, então
 * continua válido mesmo depois do TRUNCATE entre os testes.
 */
let token: string;

describe('CRUD de personagens', () => {
    beforeAll(async () => {
        token = await loginAsAdmin();
    });

    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('criação', () => {
        it('exige autenticação', async () => {
            const response = await api().post('/api/characters').send(novoPersonagem);

            expect(response.status).toBe(401);
        });

        it('aceita personagem sem recompensa (bounty é opcional)', async () => {
            const response = await api().post('/api/characters').set(bearer(token)).send(novoPersonagem);

            expect(response.status).toBe(201);
            expect(response.body.data.bounty).toBe(0);
        });

        it('aceita recompensa acima de 1 bilhão', async () => {
            const response = await api()
                .post('/api/characters')
                .set(bearer(token))
                .send({ ...novoPersonagem, bounty: 3000000000 });

            expect(response.status).toBe(201);
            expect(response.body.data.bounty).toBe(3000000000);
        });

        it('converte bounty enviado como texto em multipart', async () => {
            const response = await api()
                .post('/api/characters')
                .set(bearer(token))
                .field('name', 'Via Multipart')
                .field('description', 'Descrição enviada como formulário multipart')
                .field('bounty', '7500');

            expect(response.status).toBe(201);
            expect(response.body.data.bounty).toBe(7500);
        });

        it('recusa nome duplicado com 409 sem vazar detalhes internos', async () => {
            const token = await loginAsAdmin();
            await seedCharacter({ name: 'Nome Repetido' });

            const response = await api()
                .post('/api/characters')
                .set(bearer(token))
                .send({ ...novoPersonagem, name: 'Nome Repetido' });

            const body = JSON.stringify(response.body);

            expect(response.status).toBe(409);
            expect(body).not.toContain('prisma');
            expect(body).not.toContain('CharactersRepository');
        });

        it('recusa descrição curta com 400', async () => {
            const response = await api()
                .post('/api/characters')
                .set(bearer(token))
                .send({ ...novoPersonagem, description: 'curta' });

            expect(response.status).toBe(400);
            expect(response.body.details[0].path).toBe('description');
        });
    });

    describe('leitura por id', () => {
        it('devolve o personagem', async () => {
            const personagem = await seedCharacter({ name: 'Alvo' });

            const response = await api().get(`/api/characters/${personagem.id}`);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Alvo');
            expect(typeof response.body.data.bounty).toBe('number');
        });

        it('devolve 400 para id malformado (e não 404)', async () => {
            const response = await api().get('/api/characters/nao-e-uuid');

            expect(response.status).toBe(400);
            expect(response.body.details[0].path).toBe('id');
        });

        it('devolve 404 para uuid inexistente', async () => {
            const response = await api().get(`/api/characters/${UNKNOWN_UUID}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toContain('not found');
        });
    });

    describe('atualização e exclusão', () => {
        it('atualiza um personagem existente', async () => {
            const token = await loginAsAdmin();
            const personagem = await seedCharacter({ name: 'Antes' });

            const response = await api()
                .put(`/api/characters/${personagem.id}`)
                .set(bearer(token))
                .send({ name: 'Depois' });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Depois');
        });

        it('devolve 400 para id malformado no PUT', async () => {
            const response = await api()
                .put('/api/characters/nao-e-uuid')
                .set(bearer(token))
                .send({ name: 'Nome Válido' });

            expect(response.status).toBe(400);
        });

        it('devolve 404 ao atualizar id inexistente', async () => {
            const response = await api()
                .put(`/api/characters/${UNKNOWN_UUID}`)
                .set(bearer(token))
                .send({ name: 'Nome Válido' });

            expect(response.status).toBe(404);
        });

        it('exclui e some da listagem', async () => {
            const token = await loginAsAdmin();
            const personagem = await seedCharacter({ name: 'Descartável' });

            const exclusao = await api().delete(`/api/characters/${personagem.id}`).set(bearer(token));
            const leitura = await api().get(`/api/characters/${personagem.id}`);

            expect(exclusao.status).toBe(200);
            expect(leitura.status).toBe(404);
        });
    });

    describe('busca textual', () => {
        beforeEach(async () => {
            await seedCharacter({ name: 'Monkey D. Luffy', description: 'Capitão dos Piratas do Chapéu de Palha' });
            await seedCharacter({ name: 'Roronoa Zoro', description: 'Espadachim dos Piratas do Chapéu de Palha' });
            await seedCharacter({ name: 'Nami', description: 'Navegadora dos Piratas do Chapéu de Palha' });
        });

        it('encontra por trecho', async () => {
            const response = await api().get('/api/characters/search?q=luffy');

            expect(response.status).toBe(200);
            expect(response.body.data.characters).toHaveLength(1);
        });

        it('exige o termo de busca', async () => {
            expect((await api().get('/api/characters/search')).status).toBe(400);
            expect((await api().get('/api/characters/search?q=')).status).toBe(400);
        });

        it('devolve 200 com lista vazia quando não há resultado', async () => {
            const response = await api().get('/api/characters/search?q=zzzznaoexiste');

            expect(response.status).toBe(200);
            expect(response.body.data.characters).toEqual([]);
            expect(response.body.data.pagination.total).toBe(0);
            expect(response.body.data.pagination.totalPages).toBe(1);
        });

        it('pagina os resultados', async () => {
            const primeira = await api().get('/api/characters/search?q=Chapéu&limit=2&page=1');
            const segunda = await api().get('/api/characters/search?q=Chapéu&limit=2&page=2');

            expect(primeira.body.data.characters).toHaveLength(2);
            expect(primeira.body.data.pagination.total).toBe(3);
            expect(primeira.body.data.pagination.totalPages).toBe(2);
            expect(segunda.body.data.characters).toHaveLength(1);
        });

        it('devolve a última página quando a página pedida passa do fim', async () => {
            const response = await api().get('/api/characters/search?q=Chapéu&limit=2&page=99');

            expect(response.body.data.pagination.page).toBe(2);
            expect(response.body.data.characters).toHaveLength(1);
        });

        it('valida a paginação da busca', async () => {
            expect((await api().get('/api/characters/search?q=nami&page=abc')).status).toBe(400);
            expect((await api().get('/api/characters/search?q=nami&limit=101')).status).toBe(400);
        });
    });
});
