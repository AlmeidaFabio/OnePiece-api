import { Request, Response } from "express";
import { Character } from "../../entities/Character";
import { SearchCharacterUseCase } from "../../useCases/Character/SearchCharacterUseCase";

export class SearchCharacterController {
    constructor(private searchCharacterUseCase: SearchCharacterUseCase){
        this.search = this.search.bind(this)
    }
    async search(request:Request, response:Response) {
        const { txt } = request.body

        try {
            const res:Character[] = await this.searchCharacterUseCase.execute(txt)

            if(res.length > 0) {
                return response.status(200).json(res)
            } else {
                return response.status(400).json({error: 'No results found'})
            }
        } catch (error) {
            return response.status(400).json({error: error.message})
        }
    }
}