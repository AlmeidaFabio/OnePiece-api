import { Request, Response } from "express";
import { GetAdminUseCase } from "../../useCases/Admin/GetAdminUseCase";

export class GetAdminByIdController {
    constructor(private getAdmin: GetAdminUseCase) {
        this.getAdminById = this.getAdminById.bind(this)
    }

    async getAdminById(request:Request, response:Response) {
        const id = request.params.id;

        try {
            const admin = await this.getAdmin.execute(id);

            return response.status(200).json(admin);
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).send({
                    error: error.message
                });
            }
            return response.status(400).send({
                error: 'Unknown error'
            });
        }
    }
}