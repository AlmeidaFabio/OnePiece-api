import { Request, Response } from "express";
import { ICharacterDTO } from "../../dtos/ICharacterDTO";
import { IImageDTO } from "../../dtos/IImageDTO";
import { CreateCharacterUseCase } from "../../useCases/Character/CreateCharacterUseCase";
import sharp from "sharp";
import { unlink } from 'fs/promises'
interface MulterRequest extends Request {
    file: any;
}

export class CreateCharacterController {
    constructor(private createCharacterUseCase: CreateCharacterUseCase){
        this.create = this.create.bind(this)
    }

    async create(request:MulterRequest, response:Response) {
        const { name, denomination, category, description, devilFruit } = request.body;
        const { filename, fieldname, path } = request.file;
        const token = request.headers.authorization;

        try {
            const data: ICharacterDTO = {
                name,
                denomination,
                category,
                description,
                devilFruit
            }

            if(token) {
                await sharp(path)
                .resize(300)
                .toFormat('jpeg')
                .toFile(`./public/${fieldname}s/${filename}`)

                await unlink(path)
                
                const img: IImageDTO = {
                    url: `${process.env.BASE_URL}:${process.env.PORT}/${fieldname}s/${filename}`,
                }

                const character = await this.createCharacterUseCase.execute(data, img)

                return response.status(200).json(character);
            } else {
                return response.status(400).json({ error: 'Unauthorized!!!' });
            }
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}