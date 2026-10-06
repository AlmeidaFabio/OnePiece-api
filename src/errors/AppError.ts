/**
 * Erro de domínio com status HTTP associado.
 *
 * Use nas camadas de repositório/use case e deixe propagar: o handler global
 * (src/app.ts) e os controllers convertem em resposta JSON com o status certo,
 * sem depender de comparar strings de mensagem.
 */
export class AppError extends Error {
    readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
