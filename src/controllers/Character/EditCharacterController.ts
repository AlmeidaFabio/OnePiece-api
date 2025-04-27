import { Request, Response } from "express";
import { EditCharacterUseCase } from "../../useCases/Character/EditCharacterUseCase";
import { UpdateCharacterDTO } from "../../validations/characterValidations";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateCharacterSchema } from "../../validations/characterValidations";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export class EditCharacterController {
    constructor(private editCharacterUseCase: EditCharacterUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: MulterRequest, response: Response) {
        try {
            const { id } = request.params;
            const data: UpdateCharacterDTO = request.body;

            // Valida os dados usando o middleware validateRequest
            await validateRequest(updateCharacterSchema)(request, response, () => {});

            // Executa o caso de uso
            const result = await this.editCharacterUseCase.execute(id, data);

            // Retorna a resposta de sucesso
            return response.status(200).json({
                status: 'success',
                data: result.data
            });
        } catch (error) {
            if (error instanceof Error) {
                // Trata erros específicos
                if (error.message.includes('Character not found')) {
                    return response.status(404).json({
                        status: 'error',
                        message: error.message
                    });
                }
                if (error.message.includes('Failed to update character')) {
                    return response.status(400).json({
                        status: 'error',
                        message: error.message
                    });
                }
            }
            // Erro genérico
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}