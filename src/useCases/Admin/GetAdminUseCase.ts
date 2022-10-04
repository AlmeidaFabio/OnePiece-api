import { IAdminRepository } from "../../repositories/IAdminRepository";

export class GetAdminUseCase {
    constructor(private adminsRepository: IAdminRepository) {}

    async execute(id:string) {
        return await this.adminsRepository.getAdmin(id).catch(error => error)
    }
}