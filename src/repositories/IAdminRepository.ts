import { IAdminRequestDTO } from "../dtos/IAdminRequestDTO";
import { Admin } from "@prisma/client";


export interface IAdminRepository {
    create(admin: IAdminRequestDTO): Promise<void>;
    findByEmail(email:string): Promise<Admin>;
    getAdmin(id:string):Promise<Admin>;
}