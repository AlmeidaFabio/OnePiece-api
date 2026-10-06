import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { api, disconnect, resetDatabase, seedCharacters } from './helpers';

/**
 * Cobre a validação e a conversão da query string da listagem.
 * Antes o middleware validava req.body numa rota GET: nada disso era aplicado.
 */
describe('validação de query em GET /api/characters', () => {
    beforeEach(async () => {
        await resetDatabase();
        await seedCharacters();
    });

    afterAll(async () => {
        await disconnect();
    });

    const list = (query: string) => api().get(`/api/characters${query}`);

    it('sem filtro devolve todos', async () => {
        const response = await list('');

        expect(response.status).toBe(200);
        expect(response.body.data.pagination.total).toBe(3);
    });

    describe('parâmetros inválidos devolvem 400 com o campo apontado', () => {
        const casos: Array<[string, string]> = [
            ['?page=abc', 'page'],
            ['?page=0', 'page'],
            ['?page=-1', 'page'],
            ['?page=2.5', 'page'],
            ['?limit=abc', 'limit'],
            ['?limit=0', 'limit'],
            ['?limit=101', 'limit'],
            ['?hasDevilFruit=banana', 'hasDevilFruit'],
            ['?minBounty=abc', 'minBounty'],
            ['?minBounty=-5', 'minBounty'],
            ['?name=ab', 'name']
        ];

        it.each(casos)('%s', async (query, campo) => {
            const response = await list(query);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation Error');
            expect(response.body.details.map((d: { path: string }) => d.path)).toContain(campo);
        });
    });

    it('recusa faixa de recompensa invertida', async () => {
        const response = await list('?minBounty=100&maxBounty=50');

        expect(response.status).toBe(400);
        expect(response.body.details[0].message).toContain('maior que a máxima');
    });

    it('parâmetro vazio é tratado como ausente, não como erro', async () => {
        for (const query of ['?name=', '?crew=', '?page=', '?limit=', '?hasDevilFruit=', '?minBounty=']) {
            const response = await list(query);

            expect(response.status, query).toBe(200);
            expect(response.body.data.pagination.total, query).toBe(3);
        }
    });

    it('page não numérico não devolve mais "page": null', async () => {
        const response = await list('?page=abc&limit=1');

        expect(response.status).toBe(400);
        expect(response.body.data).toBeUndefined();
    });

    it('converte hasDevilFruit para boolean de verdade', async () => {
        const comFruta = await list('?hasDevilFruit=true');
        const semFruta = await list('?hasDevilFruit=false');

        // Se a string "false" chegasse ao repositório, ela seria verdadeira e este
        // número seria igual ao de cima.
        expect(comFruta.body.data.pagination.total).toBe(1);
        expect(semFruta.body.data.pagination.total).toBe(2);
    });

    it('não ignora maxBounty igual a 0', async () => {
        const response = await list('?maxBounty=0');

        expect(response.body.data.pagination.total).toBe(1);
        expect(response.body.data.characters[0].name).toBe('Marinha Teste');
    });

    it('filtra por faixa de recompensa', async () => {
        const response = await list('?minBounty=2000000000');

        expect(response.body.data.pagination.total).toBe(1);
        expect(response.body.data.characters[0].bounty).toBe(3000000000);
    });

    it('filtra por crew', async () => {
        const response = await list('?crew=Piratas');

        expect(response.body.data.pagination.total).toBe(2);
    });

    it('pagina corretamente e limita a última página', async () => {
        const primeira = await list('?limit=2&page=1');
        const ultima = await list('?limit=2&page=99');

        expect(primeira.body.data.characters).toHaveLength(2);
        expect(primeira.body.data.pagination.totalPages).toBe(2);
        expect(primeira.body.data.pagination.hasNextPage).toBe(true);

        expect(ultima.body.data.pagination.page).toBe(2);
        expect(ultima.body.data.characters).toHaveLength(1);
    });
});
