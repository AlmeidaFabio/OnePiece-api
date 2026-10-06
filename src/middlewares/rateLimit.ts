import rateLimit from 'express-rate-limit';

/**
 * Limita tentativas de login por IP para dificultar força bruta.
 *
 * Atenção em produção: sem TRUST_PROXY configurado (veja src/app.ts) todas as
 * requisições chegam com o IP do proxy, e o limite passa a valer para o mundo
 * inteiro em vez de por cliente.
 */
export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
    }
});
