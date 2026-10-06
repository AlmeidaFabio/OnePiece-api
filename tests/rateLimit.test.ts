import { afterAll, describe, expect, it } from 'vitest';
import { api, disconnect } from './helpers';

/**
 * Fica em arquivo próprio de propósito: o rate limit guarda o contador em
 * memória, e cada arquivo de teste roda com um registro de módulos isolado —
 * então este teste não interfere nos logins dos outros arquivos.
 */
describe('rate limit do login', () => {
    afterAll(async () => {
        await disconnect();
    });

    it('bloqueia com 429 depois de 10 tentativas e informa o Retry-After', async () => {
        const credenciais = { email: 'ninguem@teste.local', password: 'SenhaErrada1!' };
        const status: number[] = [];

        for (let attempt = 1; attempt <= 11; attempt++) {
            const response = await api().post('/api/admin/auth').send(credenciais);
            status.push(response.status);
        }

        // As 10 primeiras passam pela autenticação (e falham com 401, pois o admin não existe).
        expect(status.slice(0, 10).every((code) => code === 401)).toBe(true);
        expect(status[10]).toBe(429);

        const bloqueado = await api().post('/api/admin/auth').send(credenciais);
        expect(bloqueado.status).toBe(429);
        expect(bloqueado.body.message).toContain('Muitas tentativas');
        expect(Number(bloqueado.headers['retry-after'])).toBeGreaterThan(0);
    });
});
