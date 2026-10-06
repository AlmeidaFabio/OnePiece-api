import { Request, Response } from 'express';
import { EditCharacterUseCase } from '../../useCases/Character/EditCharacterUseCase';
import { UpdateCharacterDTO } from '../../validations/characterValidations';
import { AppError } from '../../errors/AppError';
import { buildImageUrl, deleteCharacterImage, saveCharacterImage } from '../../utils/characterImage';

export class EditCharacterController {
    constructor(private editCharacterUseCase: EditCharacterUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        let savedImageUrl: string | undefined;

        try {
            const { id } = request.params;

            // A validação já rodou no middleware da rota (e converter os tipos).
            // Antes este controller chamava validateRequest manualmente com um next
            // vazio: quando a validação falhava, o middleware respondia 400 e o
            // handler tentava responder de novo (ERR_HTTP_HEADERS_SENT).
            const data: UpdateCharacterDTO = { ...request.body };

            if (request.file) {
                const filename = await saveCharacterImage(request.file);
                data.image = buildImageUrl(request, filename);
                savedImageUrl = data.image;
            }

            const result = await this.editCharacterUseCase.execute(id, data);

            return response.status(200).json({
                status: 'success',
                data: result.data
            });
        } catch (error) {
            // O arquivo novo é descartado; a imagem antiga continua válida.
            if (savedImageUrl) {
                await deleteCharacterImage(savedImageUrl);
            }

            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }

            console.error('❌ Erro ao atualizar personagem:', error);
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}
