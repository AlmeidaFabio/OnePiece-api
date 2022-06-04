import { IAdminRequestDTO } from "../dtos/IAdminRequestDTO";
import { Admin } from "../entities/Admin";

export interface IAdminRepository {
    create(admin: IAdminRequestDTO): Promise<void>;
    findByEmail(email:string): Promise<Admin>;
}