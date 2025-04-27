import { IAdminRepository } from "../../repositories/IAdminRepository";
import { IAdminRequestDTO } from "../../dtos/IAdminRequestDTO";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from "../../utils/env";

export class AuthAdminUseCase {
    constructor(private adminsRepository: IAdminRepository) {}

    async execute(data: IAdminRequestDTO) {
        const admin = await this.adminsRepository.findByEmail(data.email)

        if(!admin) {
            throw new Error('Admin not exists')
        }

        if(!await bcrypt.compare((data.password).toString(), admin.password)) {
            throw new Error('Invalid password')
        }

        const token = jwt.sign({ id:admin.id }, env.requireEnv('SECRET_KEY'), {
            expiresIn:86400
        })

        return {id: admin.id, token}
    }
}