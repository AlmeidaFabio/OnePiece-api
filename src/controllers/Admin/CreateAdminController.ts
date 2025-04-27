import { Request, Response } from "express";
import { CreateAdminUseCase } from "../../useCases/Admin/CreateAdminUseCase";
import { AdminsRepository } from "../../repositories/implementations/AdminsRepository";
import bcrypt from 'bcrypt';

export class CreateAdminController {
    async handle(request: Request, response: Response) {
        try {
            const { email, password } = request.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const adminsRepository = new AdminsRepository();
            const createAdminUseCase = new CreateAdminUseCase(adminsRepository);
            await createAdminUseCase.execute({ email, password: hashedPassword });
            return response.status(201).json({ message: 'Admin created successfully' });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(400).json({ error: 'Unknown error' });
        }
    }
}