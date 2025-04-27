import { IAdminRequestDTO } from "../../dtos/IAdminRequestDTO";
import { IAdminRepository } from "../IAdminRepository";
import prisma from "../../config/prisma";
import { Admin } from "@prisma/client";
import { IAdminResponseDTO } from "../../dtos/IAdminResponseDTO";

export class AdminsRepository implements IAdminRepository {
    async create(admin: IAdminRequestDTO): Promise<IAdminResponseDTO> {
        const createdAdmin = await prisma.admin.create({
            data: {
                email: admin.email,
                password: admin.password
            }
        });
        return {
            ...createdAdmin,
            token: '' // Token will be set by the controller
        };
    }

    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await prisma.admin.findUnique({
            where: { email }
        });
        return admin;
    }

    async getAdmin(id: string): Promise<Admin> {
        const admin = await prisma.admin.findUnique({
            where: { id }
        });

        if (!admin) {
            throw new Error("Admin not found");
        }

        return admin;
    }
}