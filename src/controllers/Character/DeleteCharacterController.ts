import { Request, Response } from 'express';
import { DeleteCharacterUseCase } from '../../useCases/Character/DeleteCharacterUseCase';

export class DeleteCharacterController {
    constructor(private deleteCharacterUseCase: DeleteCharacterUseCase) {
        this.handle = this.handle.bind(this)
    }

    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const token = request.headers.authorization;

        try {
            if(token) {
                await this.deleteCharacterUseCase.execute(id);

                return response.status(200).json({ message: 'Character successfully deleted' });
            } else {
                return response.status(400).json({ error: 'Unauthorized!!!' });
            }
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(400).json({ error: 'Unknown error' });
        }
    }
}