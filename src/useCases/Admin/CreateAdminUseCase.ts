import { IAdminRequestDTO } from "../../dtos/IAdminRequestDTO";
import { IAdminRepository } from "../../repositories/IAdminRepository";

export class CreateAdminUseCase {
    constructor(private adminsRepository: IAdminRepository) {}

    async execute(data: IAdminRequestDTO ) {
        const admin = await this.adminsRepository.findByEmail(data.email)

        if(admin) {
            throw new Error('Admin already exists')
        }

        return await this.adminsRepository.create(data).catch(error => error)
    }
}