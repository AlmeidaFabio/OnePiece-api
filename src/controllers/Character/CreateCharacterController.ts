import { Request, Response } from "express";
import { CreateCharacterUseCase } from "../../useCases/Character/CreateCharacterUseCase";
import { CreateCharacterDTO } from '../../validations/characterValidations';
import sharp from "sharp";
import { unlink } from 'fs/promises';
import path from 'path';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export class CreateCharacterController {
    constructor(private createCharacterUseCase: CreateCharacterUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: MulterRequest, response: Response) {
        try {
            const { name, description, bounty, devilFruit, crew } = request.body as CreateCharacterDTO;
            const file = request.file;

            const data: CreateCharacterDTO = {
                name,
                description,
                bounty: Number(bounty),
                devilFruit,
                crew,
                image: undefined
            };

            if (file) {
                // Processa a imagem
                const processedImage = await sharp(file.path)
                    .resize(300)
                    .toFormat('jpeg')
                    .toFile(path.resolve(__dirname, '..', '..', '..', 'public', 'images', file.filename));

                // Remove o arquivo temporário
                await unlink(file.path);

                // Atualiza a URL da imagem
                data.image = `${process.env.BASE_URL}:${process.env.PORT}/images/${file.filename}`;
            }

            const character = await this.createCharacterUseCase.execute(data);

            return response.status(201).json({
                status: 'success',
                data: character
            });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}