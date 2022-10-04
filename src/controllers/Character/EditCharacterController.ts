import { Request, Response } from "express";
import { ICharacterDTO } from "../../dtos/ICharacterDTO";
import { IImageDTO } from "../../dtos/IImageDTO";
import { EditCharacterUseCase } from "../../useCases/Character/EditCharacterUseCase";
import sharp from "sharp";
import { unlink } from 'fs/promises'

interface MulterRequest extends Request {
    file: any;
}

export class EditCharacterController {
    constructor(private editCharacterUseCase: EditCharacterUseCase)
    {
        this.editCharacter = this.editCharacter.bind(this)
    }

    async editCharacter(request:MulterRequest, response:Response) {
        const { name, denomination, category, description, devilfruit } = request.body;
        const id = request.params.id;
        const token = request.headers.authorization;

        const data: ICharacterDTO = {
            name,
            denomination,
            category,
            description,
            devilFruit: devilfruit
        }

        try {
            if(token) {
                if(request.file) {
                    const { filename, fieldname, path } = request.file;

                    await sharp(path)
                    .resize(300)
                    .toFormat('jpeg')
                    .toFile(`./public/${fieldname}s/${filename}`)

                    await unlink(path)
                    
                    const img: IImageDTO = {
                        url: `${process.env.BASE_URL}:${process.env.PORT}/${fieldname}s/${filename}`,
                    }
                    
                    await this.editCharacterUseCase.execute(id, data, img)

                    return response.status(201).json({message: 'Character successfully updated'});
                } else {
                    await this.editCharacterUseCase.execute(id, data)

                    return response.status(201).json({message: 'Character successfully updated'});
                }

            } else {
                return response.status(400).json({ error: 'Unauthorized!!!' });
            }
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}