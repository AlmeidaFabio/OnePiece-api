import { Request, Response } from "express";
import { GetAdminUseCase } from "../../useCases/Admin/GetAdminUseCase";

export class GetAdminByIdController {
    constructor(private getAdmin: GetAdminUseCase) {
        this.handle = this.handle.bind(this)
    }

    async handle(request: Request, response: Response) {
        try {
            if (!request.user?.id) {
                return response.status(401).json({ error: "Unauthorized" });
            }

            const admin = await this.getAdmin.execute(request.user.id);

            return response.status(200).json({
                admin: {
                    id: admin.id,
                    email: admin.email
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({
                    error: error.message
                });
            }
            return response.status(400).json({
                error: 'Unknown error'
            });
        }
    }
}