import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { api, disconnect, resetDatabase, seedCharacters } from './helpers';

describe('base da API', () => {
    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await disconnect();
    });

    it('responde a home renderizada', async () => {
        const response = await api().get('/api');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('text/html');
    });

    it('lista personagens do banco de testes', async () => {
        await seedCharacters();

        const response = await api().get('/api/characters');

        expect(response.status).toBe(200);
        expect(response.body.data.pagination.total).toBe(3);
    });

    it('devolve 404 em JSON para rota inexistente', async () => {
        const response = await api().get('/api/rota-que-nao-existe');

        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body.message).toContain('not found');
    });

    it('aplica os cabeçalhos de segurança do helmet', async () => {
        const response = await api().get('/api/characters');

        expect(response.headers['x-content-type-options']).toBe('nosniff');
        expect(response.headers['content-security-policy']).toBeDefined();
        expect(response.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });

    it('responde 400 em JSON (não HTML) para corpo JSON inválido', async () => {
        const response = await api().post('/api/admin/auth').set('Content-Type', 'application/json').send('{quebrado');

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(JSON.stringify(response.body)).not.toContain('body-parser');
    });
});
