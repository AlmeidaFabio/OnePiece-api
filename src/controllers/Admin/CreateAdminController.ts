import { Request, Response } from "express";
import { CreateAdminUseCase } from "../../useCases/Admin/CreateAdminUseCase";
import bcrypt from 'bcrypt';

export class CreateAdminController {
    constructor(private createAdmin: CreateAdminUseCase) {
        this.create = this.create.bind(this)
    }

    async create(request:Request, response:Response) {
        const { email, password } = request.body
        const hash = await bcrypt.hash(password.toString(), 10);
        const token = request.headers.authorization

        try {
            if(token) {
                await this.createAdmin.execute({
                    email,
                    password: hash
                })
    
                return response.status(201).send('New Admin successfully creaetd');
            } else {
                return response.status(400).json({error:'not allowed'})
            }
        } catch (error) {
            return response.status(400).send({
                error: error.message
            });
        }
    }
}