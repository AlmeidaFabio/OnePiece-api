import { Request, Response } from "express";
import { CreateAdminUseCase } from "../../useCases/Admin/CreateAdminUseCase";
import bcrypt from 'bcrypt';

export class CreateAdminController {
    constructor(private createAdminUseCase: CreateAdminUseCase) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            const { email, password } = request.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const admin = await this.createAdminUseCase.execute({ 
                email, 
                password: hashedPassword 
            });
            
            return response.status(201).json({ 
                message: 'Admin created successfully',
                admin
            });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(400).json({ error: 'Unknown error' });
        }
    }
}