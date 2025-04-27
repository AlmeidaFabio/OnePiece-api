import { IAdminRequestDTO } from "../dtos/IAdminRequestDTO";
import { Admin } from "@prisma/client";
import { IAdminResponseDTO } from "../dtos/IAdminResponseDTO";


export interface IAdminRepository {
    create(admin: IAdminRequestDTO): Promise<IAdminResponseDTO>;
    findByEmail(email: string): Promise<Admin | null>;
    getAdmin(id: string): Promise<Admin>;
}