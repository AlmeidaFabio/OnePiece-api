import { Request, Response } from "express";
import { IAdminRequestDTO } from "../../dtos/IAdminRequestDTO";
import { AuthAdminUseCase } from "../../useCases/Admin/AuthAdminUseCase";

export class AuthAdminController {
    constructor(private authAdmin: AuthAdminUseCase){
        this.login = this.login.bind(this)
    }

    async login(request:Request, response:Response) {
        const { email, password } = request.body

        const data: IAdminRequestDTO = {
            email, password
        }

        try {
            const loggedAdmin = await this.authAdmin.execute(data)

            return response.status(200).json(loggedAdmin)
        } catch (error) {
            return response.status(400).json(error.message)
        }
    }
}