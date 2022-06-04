import { Request, Response } from "express";
import { ListCharactersUseCase } from "../../useCases/Character/ListCharactersUseCase";

export class ListCharactersController {
    constructor(private listCharaterUseCase: ListCharactersUseCase){
        this.listCharacters = this.listCharacters.bind(this)
    }

    async listCharacters(request:Request, response:Response) {
        const { page = 1, limit = 16 } = request.query;

        try {
            const res = await this.listCharaterUseCase.execute(page.toString(), limit.toString());

            return response.status(200).json({
                characters: res.data,
                totalPages: Math.ceil(res.count / parseInt(limit.toString())),
                page

            })
        } catch (error) {
            return response.status(400).json({error: error.message})
        }
    }
}