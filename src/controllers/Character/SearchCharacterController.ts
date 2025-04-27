import { Request, Response } from "express";
import { SearchCharacterUseCase } from "../../useCases/Character/SearchCharacterUseCase";

export class SearchCharacterController {
    constructor(private searchCharacterUseCase: SearchCharacterUseCase) {
        this.search = this.search.bind(this);
    }

    async search(request: Request, response: Response) {
        try {
            const { q } = request.query;

            if (!q) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Search query is required'
                });
            }

            const result = await this.searchCharacterUseCase.execute(q.toString());

            if (result.data.characters.length === 0) {
                return response.status(404).json({
                    status: 'error',
                    message: `No characters found matching "${q}"`
                });
            }

            return response.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('Search text is required')) {
                    return response.status(400).json({
                        status: 'error',
                        message: error.message
                    });
                }
                if (error.message.includes('Failed to search characters')) {
                    return response.status(400).json({
                        status: 'error',
                        message: error.message
                    });
                }
            }
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}