import { Request, Response } from "express";
import { AuthAdminUseCase } from "../../useCases/Admin/AuthAdminUseCase";
import { AdminsRepository } from "../../repositories/implementations/AdminsRepository";

export class AuthAdminController {
    async handle(request: Request, response: Response) {
        try {
            const { email, password } = request.body;
            const adminsRepository = new AdminsRepository();
            const authAdminUseCase = new AuthAdminUseCase(adminsRepository);
            const result = await authAdminUseCase.execute({ email, password });
            return response.json(result);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(400).json({ error: 'Unknown error' });
        }
    }
}