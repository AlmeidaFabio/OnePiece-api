import { z } from 'zod';

// Schema para criação de personagem
export const createCharacterSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    description: z.string()
        .min(10, 'Descrição deve ter no mínimo 10 caracteres')
        .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
    bounty: z.number()
        .min(0, 'Recompensa não pode ser negativa')
        .max(1000000000, 'Recompensa muito alta'),
    devilFruit: z.string()
        .min(3, 'Nome da Akuma no Mi deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da Akuma no Mi deve ter no máximo 100 caracteres')
        .optional(),
    crew: z.string()
        .min(3, 'Nome da tripulação deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da tripulação deve ter no máximo 100 caracteres')
        .optional(),
    image: z.string()
        .url('URL da imagem inválida')
        .optional()
});

// Schema para atualização de personagem
export const updateCharacterSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .optional(),
    description: z.string()
        .min(10, 'Descrição deve ter no mínimo 10 caracteres')
        .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
        .optional(),
    bounty: z.number()
        .min(0, 'Recompensa não pode ser negativa')
        .max(1000000000, 'Recompensa muito alta')
        .optional(),
    devilFruit: z.string()
        .min(3, 'Nome da Akuma no Mi deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da Akuma no Mi deve ter no máximo 100 caracteres')
        .optional(),
    crew: z.string()
        .min(3, 'Nome da tripulação deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da tripulação deve ter no máximo 100 caracteres')
        .optional(),
    image: z.string()
        .url('URL da imagem inválida')
        .optional()
});

// Schema para busca de personagem por ID
export const getCharacterByIdSchema = z.object({
    id: z.string()
        .uuid('ID inválido')
        .min(1, 'ID é obrigatório')
});

// Schema para busca de personagens com filtros
export const getCharactersSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .optional(),
    crew: z.string()
        .min(3, 'Nome da tripulação deve ter no mínimo 3 caracteres')
        .max(100, 'Nome da tripulação deve ter no máximo 100 caracteres')
        .optional(),
    hasDevilFruit: z.boolean()
        .optional(),
    minBounty: z.number()
        .min(0, 'Recompensa mínima não pode ser negativa')
        .optional(),
    maxBounty: z.number()
        .min(0, 'Recompensa máxima não pode ser negativa')
        .optional(),
    page: z.number()
        .min(1, 'Página deve ser maior que 0')
        .optional(),
    limit: z.number()
        .min(1, 'Limite deve ser maior que 0')
        .max(100, 'Limite máximo é 100')
        .optional()
});

// Tipos inferidos dos schemas
export type CreateCharacterDTO = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterDTO = z.infer<typeof updateCharacterSchema>;
export type GetCharacterByIdDTO = z.infer<typeof getCharacterByIdSchema>;
export type GetCharactersDTO = z.infer<typeof getCharactersSchema>; 