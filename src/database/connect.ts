import prisma from '../config/prisma';

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Verifica a conectividade com o banco e só retorna quando ela funciona.
 *
 * Usa o mesmo PrismaClient da aplicação. Antes existia aqui um segundo pool do
 * driver `pg` — com uma função `query()` que nenhum arquivo chamava — e a
 * verificação não era aguardada: o servidor subia, aceitava requisições e
 * respondia erro a cada uma enquanto o banco estava fora. No caminho de falha
 * final o flag `isConnecting` ficava preso em `true`, impedindo novas tentativas.
 *
 * Lança se não conseguir conectar em todas as tentativas: quem chama decide
 * encerrar o processo, em vez de servir tráfego quebrado.
 */
export const connectDB = async (): Promise<void> => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            // Query trivial: confirma que a conexão funciona de fato, e não apenas
            // que o client foi instanciado.
            await prisma.$queryRaw`SELECT 1`;
            console.log('✅ PostgreSQL conectado com sucesso!');
            return;
        } catch (error) {
            const detail = error instanceof Error ? error.message : String(error);

            if (attempt === MAX_ATTEMPTS) {
                throw new Error(`Não foi possível conectar ao PostgreSQL após ${MAX_ATTEMPTS} tentativas: ${detail}`, {
                    cause: error
                });
            }

            console.warn(
                `⚠️ Falha ao conectar ao PostgreSQL (tentativa ${attempt}/${MAX_ATTEMPTS}). Tentando novamente em ${RETRY_DELAY_MS / 1000}s...`
            );
            await sleep(RETRY_DELAY_MS);
        }
    }
};
