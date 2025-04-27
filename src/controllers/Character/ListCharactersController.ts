import { Request, Response } from "express";
import { ListCharactersUseCase } from "../../useCases/Character/ListCharactersUseCase";
import { GetCharactersDTO } from "../../validations/characterValidations";

export class ListCharactersController {
    constructor(private listCharactersUseCase: ListCharactersUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            const filters: GetCharactersDTO = {
                name: request.query.name as string,
                crew: request.query.crew as string,
                hasDevilFruit: request.query.hasDevilFruit === 'true',
                minBounty: request.query.minBounty ? Number(request.query.minBounty) : undefined,
                maxBounty: request.query.maxBounty ? Number(request.query.maxBounty) : undefined,
                page: request.query.page ? Number(request.query.page) : undefined,
                limit: request.query.limit ? Number(request.query.limit) : undefined
            };

            const result = await this.listCharactersUseCase.execute(filters);

            return response.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({
                    status: 'error',
                    message: error.message
                });
            }
            return response.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}