import 'dotenv/config';
import { execFileSync } from 'child_process';
import path from 'path';
import { Client } from 'pg';
import { maintenanceDatabaseUrl, testDatabaseName, testDatabaseUrl } from './testDatabase';

const quoted = (identifier: string) => `"${identifier.replace(/"/g, '""')}"`;

/**
 * Prepara o banco de testes uma vez por execução: cria o banco se não existir e
 * aplica as migrations (`migrate deploy` não precisa de shadow database).
 *
 * O banco NÃO é apagado no fim de propósito: a estrutura fica pronta para a
 * próxima execução e cada teste limpa apenas os dados.
 */
export const setup = async (): Promise<void> => {
    const testUrl = testDatabaseUrl();
    const databaseName = testDatabaseName(testUrl);

    const client = new Client({ connectionString: maintenanceDatabaseUrl(testUrl) });
    await client.connect();
    try {
        const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [databaseName]);

        if (rowCount === 0) {
            await client.query(`CREATE DATABASE ${quoted(databaseName)}`);
            console.log(`✅ banco de testes criado: ${databaseName}`);
        }
    } finally {
        await client.end();
    }

    // Chama o CLI pelo arquivo JS com o próprio node: evita `shell: true`
    // (que gera aviso de segurança do Node) e funciona igual em qualquer sistema.
    const prismaCli = path.resolve('node_modules', 'prisma', 'build', 'index.js');

    execFileSync(process.execPath, [prismaCli, 'migrate', 'deploy'], {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: testUrl }
    });
};
