import { Request, Response } from "express";
import { GetCharacterByIdUseCase } from "../../useCases/Character/GetCharacterByIdUseCase";

export class GetCharacterByIdController {
    constructor(private getCharacterByIdUseCase: GetCharacterByIdUseCase) {
        this.handle = this.handle.bind(this)
    }

    async handle(request:Request, response:Response) {
        const { id } = request.params;

        try {
            const character = await this.getCharacterByIdUseCase.execute(id);

            return response.status(200).json(character);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(400).json({ error: 'Unknown error' });
        }
    }
}