import { Request, Response } from 'express';
import { CreateCharacterUseCase } from '../../useCases/Character/CreateCharacterUseCase';
import { CreateCharacterDTO } from '../../validations/characterValidations';
import { ICharacterDTO } from '../../dtos/ICharacterDTO';
import { AppError } from '../../errors/AppError';
import { buildImageUrl, deleteCharacterImage, saveCharacterImage } from '../../utils/characterImage';

export class CreateCharacterController {
    constructor(private createCharacterUseCase: CreateCharacterUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        // Guardado para limpar a imagem caso a criação falhe depois de gravá-la.
        let savedImageUrl: string | undefined;

        try {
            const { name, description, bounty, devilFruit, crew, image } = request.body as CreateCharacterDTO;
            const file = request.file;

            // Os valores já chegam validados e convertidos pelo middleware.
            // `bounty` é opcional porque recompensa só existe para procurados:
            // ausente vira 0, ou seja, "sem recompensa conhecida".
            const data: ICharacterDTO = {
                name,
                description,
                bounty: bounty ?? 0,
                devilFruit,
                crew,
                image
            };

            if (file) {
                const filename = await saveCharacterImage(file);
                data.image = buildImageUrl(request, filename);
                savedImageUrl = data.image;
            }

            const character = await this.createCharacterUseCase.execute(data);

            return response.status(201).json({
                status: 'success',
                data: character
            });
        } catch (error) {
            // Não deixa imagem órfã em public/images se o INSERT falhar (ex.: nome duplicado).
            if (savedImageUrl) {
                await deleteCharacterImage(savedImageUrl);
            }

            if (error instanceof AppError) {
                return response.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }

            console.error('❌ Erro ao criar personagem:', error);
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}
