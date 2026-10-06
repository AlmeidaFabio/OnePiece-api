import { z } from 'zod';

/**
 * Converte para número os valores que chegam como texto.
 *
 * Dois casos motivam isto: multipart/form-data entrega tudo como string ("3000")
 * e a query string também (?page=2). Devolve o valor cru quando não é
 * conversível, para que a mensagem de erro continue sendo a do próprio schema.
 *
 * O schema interno é recebido por parâmetro para que QUEM CHAMA decida se o campo
 * é obrigatório. Atenção: o `.optional()` precisa estar no schema interno, não
 * fora do preprocess — do contrário o `undefined` produzido aqui chega ao schema
 * de dentro e vira erro "Required" em vez de "campo ausente".
 */
const coercedNumber = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((value) => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string') {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? value : parsed;
        }
        return value;
    }, schema);

/**
 * Na query string tudo chega como texto: ?hasDevilFruit=false precisa virar o
 * booleano false, senão a string "false" seria tratada como verdadeira.
 * Qualquer outro valor (ex.: "banana") é repassado para o schema reprovar.
 */
const coercedBoolean = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((value) => {
        if (value === undefined || value === null || value === '') return undefined;
        if (typeof value === 'string') {
            const normalized = value.toLowerCase();
            if (normalized === 'true') return true;
            if (normalized === 'false') return false;
        }
        return value;
    }, schema);

/** Trata ?name= (vazio) como "sem filtro" em vez de erro de tamanho mínimo. */
const blankToUndefined = (value: unknown) => (value === '' ? undefined : value);

/**
 * Teto de recompensa. O banco guarda BigInt, mas a API expõe number, então o
 * limite é o maior inteiro exato do JavaScript (2^53 - 1).
 *
 * O teto anterior era 1.000.000.000, abaixo de 9 fichas já semeadas — a maior é a
 * do Shanks, 4.048.900.000 — o que as tornava impossíveis de recriar ou atualizar
 * pela API.
 */
const MAX_BOUNTY = Number.MAX_SAFE_INTEGER;

/** Texto opcional de query string, com os limites declarados na mensagem. */
const queryText = (min: number, max: number, label: string) =>
    z.preprocess(
        blankToUndefined,
        z
            .string()
            .min(min, `${label} deve ter no mínimo ${min} caracteres`)
            .max(max, `${label} deve ter no máximo ${max} caracteres`)
            .optional()
    );

// Schema para criação de personagem
export const createCharacterSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
    description: z
        .string()
        .min(10, 'Descrição deve ter no mínimo 10 caracteres')
        .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
    // Opcional: recompensa só existe para procurados. Personagens da Marinha,
    // Governo Mundial e CP0 não têm valor, e antes a API os rejeitava como
    // "Required" mesmo existindo 37 fichas assim semeadas.
    bounty: coercedNumber(
        z
            .number({ invalid_type_error: 'Recompensa deve ser um número' })
            .min(0, 'Recompensa não pode ser negativa')
            .max(MAX_BOUNTY, 'Recompensa muito alta')
            .optional()
    ),
    devilFruit: z
        .string()
        .min(3, 'Nome da Akuma no Mi deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da Akuma no Mi deve ter no máximo 100 caracteres')
        .optional(),
    crew: z
        .string()
        .min(3, 'Nome da tripulação deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da tripulação deve ter no máximo 100 caracteres')
        .optional(),
    image: z.string().url('URL da imagem inválida').optional()
});

// Schema para atualização de personagem
export const updateCharacterSchema = z.object({
    name: z
        .string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .optional(),
    description: z
        .string()
        .min(10, 'Descrição deve ter no mínimo 10 caracteres')
        .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
        .optional(),
    bounty: coercedNumber(
        z
            .number({ invalid_type_error: 'Recompensa deve ser um número' })
            .min(0, 'Recompensa não pode ser negativa')
            .max(MAX_BOUNTY, 'Recompensa muito alta')
            .optional()
    ),
    devilFruit: z
        .string()
        .min(3, 'Nome da Akuma no Mi deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da Akuma no Mi deve ter no máximo 100 caracteres')
        .optional(),
    crew: z
        .string()
        .min(3, 'Nome da tripulação deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da tripulação deve ter no máximo 100 caracteres')
        .optional(),
    image: z.string().url('URL da imagem inválida').optional()
});

// Schema para busca de personagem por ID
export const getCharacterByIdSchema = z.object({
    id: z.string().uuid('ID inválido').min(1, 'ID é obrigatório')
});

// Schema da busca textual, aplicado à query string.
// Tem a mesma paginação da listagem para que os dois endpoints compartilhem
// o mesmo contrato de resposta.
export const searchCharactersSchema = z.object({
    q: z.preprocess(
        blankToUndefined,
        z
            .string({
                required_error: 'Texto de busca é obrigatório',
                invalid_type_error: 'Texto de busca deve ser um texto'
            })
            .min(1, 'Texto de busca é obrigatório')
            .max(100, 'Texto de busca deve ter no máximo 100 caracteres')
    ),
    page: coercedNumber(
        z
            .number({ invalid_type_error: 'Página deve ser um número' })
            .int('Página deve ser um número inteiro')
            .min(1, 'Página deve ser maior que 0')
            .optional()
    ),
    limit: coercedNumber(
        z
            .number({ invalid_type_error: 'Limite deve ser um número' })
            .int('Limite deve ser um número inteiro')
            .min(1, 'Limite deve ser maior que 0')
            .max(100, 'Limite máximo é 100')
            .optional()
    )
});

// Schema para busca de personagens com filtros.
// Aplicado à query string (validateRequest(getCharactersSchema, 'query')), por
// isso todo campo numérico passa por coerção: na URL chega como texto.
// Parâmetro vazio (?name=, ?page=) é tratado como filtro ausente, não como erro.
export const getCharactersSchema = z
    .object({
        name: queryText(3, 100, 'Nome'),
        crew: queryText(3, 100, 'Nome da tripulação'),
        hasDevilFruit: coercedBoolean(
            z.boolean({ invalid_type_error: 'hasDevilFruit deve ser true ou false' }).optional()
        ),
        minBounty: coercedNumber(
            z
                .number({ invalid_type_error: 'Recompensa mínima deve ser um número' })
                .min(0, 'Recompensa mínima não pode ser negativa')
                .optional()
        ),
        maxBounty: coercedNumber(
            z
                .number({ invalid_type_error: 'Recompensa máxima deve ser um número' })
                .min(0, 'Recompensa máxima não pode ser negativa')
                .optional()
        ),
        page: coercedNumber(
            z
                .number({ invalid_type_error: 'Página deve ser um número' })
                .int('Página deve ser um número inteiro')
                .min(1, 'Página deve ser maior que 0')
                .optional()
        ),
        limit: coercedNumber(
            z
                .number({ invalid_type_error: 'Limite deve ser um número' })
                .int('Limite deve ser um número inteiro')
                .min(1, 'Limite deve ser maior que 0')
                .max(100, 'Limite máximo é 100')
                .optional()
        )
    })
    .refine(
        (data) => data.minBounty === undefined || data.maxBounty === undefined || data.minBounty <= data.maxBounty,
        {
            message: 'Recompensa mínima não pode ser maior que a máxima',
            path: ['minBounty']
        }
    );

// Tipos inferidos dos schemas
export type CreateCharacterDTO = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterDTO = z.infer<typeof updateCharacterSchema>;
export type GetCharacterByIdDTO = z.infer<typeof getCharacterByIdSchema>;
export type GetCharactersDTO = z.infer<typeof getCharactersSchema>;
export type SearchCharactersDTO = z.infer<typeof searchCharactersSchema>;
