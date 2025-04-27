import { Request, Response } from "express";
import { GetCharacterByIdUseCase } from "../../useCases/Character/GetCharacterByIdUseCase";

export class GetCharacterByIdController {
    constructor(private getCharacterByIdUseCase: GetCharacterByIdUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            const id = request.params.id;

            if (!id) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Character ID is required'
                });
            }

            const result = await this.getCharacterByIdUseCase.execute(id);

            return response.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    return response.status(404).json({
                        status: 'error',
                        message: error.message
                    });
                }
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