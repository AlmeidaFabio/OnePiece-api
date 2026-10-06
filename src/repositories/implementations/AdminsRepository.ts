import { IAdminRequestDTO } from '../../dtos/IAdminRequestDTO';
import { IAdminRepository } from '../IAdminRepository';
import prisma from '../../config/prisma';
import { Admin } from '@prisma/client';
import { IAdminResponseDTO } from '../../dtos/IAdminResponseDTO';
import { AppError } from '../../errors/AppError';

/** Campos seguros para devolver na camada HTTP: o hash da senha nunca sai daqui. */
const publicAdminFields = { id: true, email: true } as const;

export class AdminsRepository implements IAdminRepository {
    async create(admin: IAdminRequestDTO): Promise<IAdminResponseDTO> {
        return prisma.admin.create({
            data: {
                email: admin.email,
                password: admin.password
            },
            select: publicAdminFields
        });
    }

    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await prisma.admin.findUnique({
            where: { email }
        });
        return admin;
    }

    async getAdmin(id: string): Promise<IAdminResponseDTO> {
        const admin = await prisma.admin.findUnique({
            where: { id },
            select: publicAdminFields
        });

        if (!admin) {
            throw new AppError('Admin not found', 404);
        }

        return admin;
    }
}
