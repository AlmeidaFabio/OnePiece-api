import { Repository } from "typeorm";
import { AppDataSource } from "../../database/connections/mysql";
import { IAdminRequestDTO } from "../../dtos/IAdminRequestDTO";
import { Admin } from "../../entities/Admin";
import { IAdminRepository } from "../IAdminRepository";

export class AdminsRepository implements IAdminRepository {
    private adminsRepository: Repository<Admin>;

    constructor() {
        this.adminsRepository = AppDataSource.getRepository(Admin)
    }

    async create(admin: IAdminRequestDTO): Promise<void> {
        const newAdmin = this.adminsRepository.create({
            email: admin.email,
            password: admin.password
        })

        await this.adminsRepository.save(newAdmin)

        return
    }

    async findByEmail(email: string) {
        const admin = await this.adminsRepository.findOne({
            where:{
                email
            }
        })

        return admin
    }

    async getAdmin(id:string) {
        const admin = await this.adminsRepository.findOne({
            where: {
                id
            }
        })

        return admin;
    }
}