import 'dotenv/config';
import { testDatabaseUrl } from './testDatabase';

/**
 * Roda antes de qualquer import da aplicação, porque `src/config/prisma.ts` lê
 * DATABASE_URL no carregamento do módulo. É aqui que a aplicação passa a falar
 * com o banco de testes em vez do de desenvolvimento.
 */
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = testDatabaseUrl();
