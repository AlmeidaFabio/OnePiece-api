import { Request, Response } from "express";
import { Character } from "../../entities/Character";
import { SearchCharacterUseCase } from "../../useCases/Character/SearchCharacterUseCase";

export class SearchCharacterController {
    constructor(private searchCharacterUseCase: SearchCharacterUseCase){
        this.search = this.search.bind(this)
    }
    async search(request:Request, response:Response) {
        const { txt = '' } = request.query

        try {
            const res:Character[] = await this.searchCharacterUseCase.execute(txt.toString())

            return response.status(200).json(res)
            
        } catch (error) {
            return response.status(400).json({error: error.message})
        }
    }
}