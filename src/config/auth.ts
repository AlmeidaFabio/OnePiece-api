import type { SignOptions } from 'jsonwebtoken';
import env from '../utils/env';

/**
 * Configuração de JWT resolvida uma única vez, no carregamento do módulo.
 *
 * Antes cada ponto de uso lia `process.env.JWT_SECRET || 'default-secret'`:
 * se a variável faltasse, a API assinava e verificava sessões com um segredo
 * público e conhecido, sem nenhum aviso. Agora a ausência da variável derruba o
 * boot com mensagem clara e existe um único segredo para as duas operações.
 */
export const JWT_SECRET = env.requireEnv('JWT_SECRET');

/**
 * Validade do token. O `.env` já declarava JWT_EXPIRES_IN, mas o valor era
 * ignorado: havia `'1d'` fixo no controller e `86400` no use case. O padrão
 * `'1d'` preserva o comportamento anterior quando a variável não existe.
 */
export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1d') as SignOptions['expiresIn'];

/** Algoritmo único para assinar e verificar, o que evita confusão de algoritmo. */
export const JWT_ALGORITHM = 'HS256' as const;
