import { z } from 'zod';

// Schema para criação de admin
export const createAdminSchema = z.object({
    email: z.string()
        .email('Email inválido')
        .min(5, 'Email deve ter no mínimo 5 caracteres')
        .max(100, 'Email deve ter no máximo 100 caracteres'),
    password: z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .max(100, 'Senha deve ter no máximo 100 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 
            'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial')
});

// Schema para autenticação de admin
export const authAdminSchema = z.object({
    email: z.string()
        .email('Email inválido')
        .min(5, 'Email deve ter no mínimo 5 caracteres')
        .max(100, 'Email deve ter no máximo 100 caracteres'),
    password: z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .max(100, 'Senha deve ter no máximo 100 caracteres')
});

// Schema para busca de admin por ID
export const getAdminByIdSchema = z.object({
    id: z.string()
        .uuid('ID inválido')
});

// Tipos inferidos dos schemas
export type CreateAdminDTO = z.infer<typeof createAdminSchema>;
export type AuthAdminDTO = z.infer<typeof authAdminSchema>;
export type GetAdminByIdDTO = z.infer<typeof getAdminByIdSchema>; 