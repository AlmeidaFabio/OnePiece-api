import { IAdminRequestDTO } from "../../dtos/IAdminRequestDTO";
import { IAdminRepository } from "../IAdminRepository";
import prisma from "../../config/prisma";
import { Admin } from "@prisma/client";

export class AdminsRepository implements IAdminRepository {
    async create(admin: IAdminRequestDTO): Promise<void> {
        await prisma.admin.create({
            data: {
                email: admin.email,
                password: admin.password
            }
        });
    }

    async findByEmail(email: string): Promise<Admin> {
        const admin = await prisma.admin.findUnique({
            where: { email }
        });

        if (!admin) {
            throw new Error("Admin not found");
        }

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