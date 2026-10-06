import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import { api, bearer, createAdmin, DEFAULT_ADMIN, disconnect, loginAsAdmin, resetDatabase } from './helpers';

const GHOST_ADMIN_ID = '11111111-1111-1111-1111-111111111111';
const BCRYPT_HASH = /\$2[aby]\$/;

/** Converte JWT_EXPIRES_IN ('1d', '12h', '3600') em segundos. */
const expiresInSeconds = (value: string): number => {
    const unit = value.slice(-1);
    const amount = parseInt(value, 10);

    if (unit === 'd') return amount * 86400;
    if (unit === 'h') return amount * 3600;
    if (unit === 'm') return amount * 60;
    return amount;
};

describe('autenticação de admin', () => {
    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        await disconnect();
    });

    it('o login é público e devolve o token junto com o admin', async () => {
        await createAdmin();

        const response = await api().post('/api/admin/auth').send(DEFAULT_ADMIN);

        expect(response.status).toBe(200);
        expect(typeof response.body.token).toBe('string');
        expect(response.body.admin).toEqual({ id: expect.any(String), email: DEFAULT_ADMIN.email });
    });

    it('a resposta do login não expõe o hash da senha', async () => {
        await createAdmin();

        const response = await api().post('/api/admin/auth').send(DEFAULT_ADMIN);

        expect(response.body.admin.password).toBeUndefined();
        expect(JSON.stringify(response.body)).not.toMatch(BCRYPT_HASH);
    });

    it('rejeita senha incorreta', async () => {
        await createAdmin();

        const response = await api()
            .post('/api/admin/auth')
            .send({ ...DEFAULT_ADMIN, password: 'Errada1!' });

        expect(response.status).toBe(401);
    });

    it('o token emitido respeita JWT_EXPIRES_IN', async () => {
        await createAdmin();

        const response = await api().post('/api/admin/auth').send(DEFAULT_ADMIN);
        const payload = jwt.decode(response.body.token) as { iat: number; exp: number };

        expect(payload.exp - payload.iat).toBe(expiresInSeconds(process.env.JWT_EXPIRES_IN ?? '1d'));
    });

    it('a criação de admin exige autenticação', async () => {
        const response = await api().post('/api/admin').send({ email: 'novo@teste.local', password: 'Senha1!' });

        expect(response.status).toBe(401);
    });

    it('a criação de admin devolve apenas id e email', async () => {
        const token = await loginAsAdmin();

        const response = await api()
            .post('/api/admin')
            .set(bearer(token))
            .send({ email: 'novo@teste.local', password: 'Senha1!' });

        expect(response.status).toBe(201);
        expect(Object.keys(response.body.admin).sort()).toEqual(['email', 'id']);
        expect(JSON.stringify(response.body)).not.toMatch(BCRYPT_HASH);
    });

    it('recusa admin duplicado com 409, sem vazar detalhes do Prisma', async () => {
        const token = await loginAsAdmin();

        const response = await api().post('/api/admin').set(bearer(token)).send(DEFAULT_ADMIN);

        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Admin already exists');
        expect(JSON.stringify(response.body)).not.toContain('prisma');
    });

    it('rotas protegidas exigem token', async () => {
        const response = await api().get('/api/admin/profile');

        expect(response.status).toBe(401);
    });

    it('devolve o admin autenticado no profile', async () => {
        const token = await loginAsAdmin();

        const response = await api().get('/api/admin/profile').set(bearer(token));

        expect(response.status).toBe(200);
        expect(response.body.admin.email).toBe(DEFAULT_ADMIN.email);
    });

    it('devolve 404 (e não 200 com objeto vazio) para token de admin inexistente', async () => {
        const token = jwt.sign({ id: GHOST_ADMIN_ID, email: 'ghost@teste.local' }, process.env.JWT_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1h'
        });

        const response = await api().get('/api/admin/profile').set(bearer(token));

        expect(response.status).toBe(404);
        expect(response.body.admin).toBeUndefined();
    });

    it('recusa token assinado com o antigo segredo default-secret', async () => {
        const token = jwt.sign({ id: GHOST_ADMIN_ID, email: 'ghost@teste.local' }, 'default-secret', {
            expiresIn: '1h'
        });

        const response = await api().get('/api/admin/profile').set(bearer(token));

        expect(response.status).toBe(401);
    });

    it('recusa token com algoritmo diferente do fixado', async () => {
        const token = jwt.sign({ id: GHOST_ADMIN_ID, email: 'ghost@teste.local' }, process.env.JWT_SECRET!, {
            algorithm: 'HS384',
            expiresIn: '1h'
        });

        const response = await api().get('/api/admin/profile').set(bearer(token));

        expect(response.status).toBe(401);
    });

    it('recusa token malformado', async () => {
        const response = await api().get('/api/admin/profile').set(bearer('nao-e-um-token'));

        expect(response.status).toBe(401);
    });
});
