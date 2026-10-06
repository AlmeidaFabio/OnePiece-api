/**
 * Resolve a URL do banco de testes.
 *
 * Por padrão deriva da DATABASE_URL acrescentando `_test` ao nome do banco
 * (onepiece -> onepiece_test), para os testes NUNCA escreverem no banco de
 * desenvolvimento. TEST_DATABASE_URL sobrepõe, se você quiser apontar para outro.
 */
export const testDatabaseUrl = (): string => {
    if (process.env.TEST_DATABASE_URL) {
        return process.env.TEST_DATABASE_URL;
    }

    const base = process.env.DATABASE_URL;
    if (!base) {
        throw new Error(
            'Defina DATABASE_URL (ou TEST_DATABASE_URL) para rodar os testes. ' +
                'O banco de testes é criado automaticamente a partir dela.'
        );
    }

    const url = new URL(base);
    url.pathname = `${url.pathname}_test`;
    return url.toString();
};

/** Nome do banco de testes, usado no CREATE DATABASE. */
export const testDatabaseName = (testUrl: string): string => new URL(testUrl).pathname.replace(/^\//, '');

/** Conexão no banco de manutenção: é nele que se cria outro banco. */
export const maintenanceDatabaseUrl = (testUrl: string): string => {
    const url = new URL(testUrl);
    url.pathname = '/postgres';
    return url.toString();
};
