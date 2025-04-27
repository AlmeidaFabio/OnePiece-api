import { Request, Response } from "express";
import { ListCharactersUseCase } from "../../useCases/Character/ListCharactersUseCase";

export class ListCharactersController {
    constructor(private listCharactersUseCase: ListCharactersUseCase) {
        this.handle = this.handle.bind(this)
    }

    async handle(request:Request, response:Response) {
        try {
            const characters = await this.listCharactersUseCase.execute();

            return response.status(200).json(characters);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(400).json({ error: 'Unknown error' });
        }
    }
}