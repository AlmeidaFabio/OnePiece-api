/**
 * Dados seguros de um Admin para trafegar na camada HTTP.
 *
 * Nunca inclua `password`: o hash bcrypt não pode sair do banco.
 * O token de sessão é responsabilidade do controller de autenticação,
 * não do repositório.
 */
export interface IAdminResponseDTO {
    id: string;
    email: string;
}
