import { Request, Response } from "express";
import { EditCharacterUseCase } from "../../useCases/Character/EditCharacterUseCase";
import { ICharacterDTO } from "../../dtos/ICharacterDTO";
import { IImageDTO } from "../../dtos/IImageDTO";
import { CharactersRepository } from "../../repositories/implementations/CharactersRepository";
import sharp from 'sharp';
import { unlink } from 'fs/promises';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export class EditCharacterController {
    constructor(private editCharacterUseCase: EditCharacterUseCase) {
        this.handle = this.handle.bind(this)
    }

    async handle(request:MulterRequest, response:Response) {
        const { id } = request.params;
        const { name, denomination, category, description, devilFruit } = request.body;
        const file = request.file;
        const token = request.headers.authorization;

        try {
            const data: ICharacterDTO = {
                name,
                denomination,
                category,
                description,
                devilFruit
            }

            if(token && file) {
                await sharp(file.path)
                .resize(300)
                .toFormat('jpeg')
                .toFile(`./public/${file.fieldname}s/${file.filename}`)

                await unlink(file.path)
                
                const img: IImageDTO = {
                    url: `${process.env.BASE_URL}:${process.env.PORT}/${file.fieldname}s/${file.filename}`,
                }

                const charactersRepository = new CharactersRepository();
                const editCharacterUseCase = new EditCharacterUseCase(charactersRepository);

                const character = await editCharacterUseCase.execute(id, data, img)

                return response.status(200).json(character);
            } else {
                return response.status(400).json({ error: 'Unauthorized!!!' });
            }
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(400).json({ error: 'Unknown error' });
        }
    }
}