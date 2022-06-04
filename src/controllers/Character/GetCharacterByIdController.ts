import { Request, Response } from "express";
import { GetCharacterByIdUseCase } from "../../useCases/Character/GetCharacterByIdUseCase";

export class GetCharacterByIdController {
    constructor(private getCharacterByIdUseCase: GetCharacterByIdUseCase){
        this.getCharacterById = this.getCharacterById.bind(this)
    }

    async getCharacterById(request:Request, response:Response) {
        const id = request.params.id

        try {
            const character = await this.getCharacterByIdUseCase.execute(id)

            if(character) {
                return response.status(200).json(character)
            } else {
                return response.status(400).json({error: 'Character not exists'})
            }
        } catch (error) {
            return response.status(400).json({error: error.message})
        }
    }
}