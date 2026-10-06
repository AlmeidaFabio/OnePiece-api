import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        // Um único banco compartilhado: rodar arquivos em paralelo causaria
        // interferência entre eles (um truncando o que o outro acabou de criar).
        fileParallelism: false,
        setupFiles: ['tests/setup/setupEnv.ts'],
        globalSetup: ['tests/setup/globalSetup.ts'],
        hookTimeout: 60000,
        testTimeout: 30000
    }
});
