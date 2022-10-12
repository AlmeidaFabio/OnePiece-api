import { Request, Response } from "express";
import { DeleteCharacterUseCase } from "../../useCases/Character/DeleteCharacterUseCase";

export class DeleteCharacterController {
    constructor(private deleteCharacterUseCase: DeleteCharacterUseCase) {
        this.deleteCharacter = this.deleteCharacter.bind(this)
    }

    async deleteCharacter(request:Request, response:Response) {
        const id = request.params.id;
        const token = request.headers.authorization;

        try {
            if(token) {
                await this.deleteCharacterUseCase.execute(id)

                return response.status(200).json({message: 'Character successfully deleted'})
            } else {
                return response.status(400).json({ error: 'Unauthorized!!!' })
            }
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    }
}