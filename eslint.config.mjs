// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        // build/ é artefato, migrations são SQL gerado, node_modules nem se fala.
        ignores: ['build/**', 'node_modules/**', 'prisma/migrations/**', 'public/**']
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    // Desliga as regras de estilo que conflitam com o Prettier: quem cuida de
    // formatação é o Prettier, não o ESLint.
    prettier,

    {
        files: ['**/*.ts'],
        rules: {
            // O projeto usa `any` em pontos de fronteira (adapter do Prisma, erros
            // desconhecidos). Avisar é útil; quebrar o build por isso, não.
            '@typescript-eslint/no-explicit-any': 'warn',

            // Parâmetros e variáveis não usados quase sempre são intencionais em
            // assinaturas de middleware (req, res, next) e em callbacks.
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrors: 'none'
                }
            ]
        }
    },

    {
        // Os testes usam globais do Vitest? Não: importam explicitamente. Mas
        // usam `any` em fixtures e acessam corpos de resposta dinâmicos.
        files: ['tests/**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off'
        }
    }
);
