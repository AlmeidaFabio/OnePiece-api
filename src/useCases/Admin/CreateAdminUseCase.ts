import { IAdminRepository } from '../../repositories/IAdminRepository';
import { IAdminRequestDTO } from '../../dtos/IAdminRequestDTO';
import { IAdminResponseDTO } from '../../dtos/IAdminResponseDTO';

export class CreateAdminUseCase {
    constructor(private adminsRepository: IAdminRepository) {}

    async execute(data: IAdminRequestDTO): Promise<IAdminResponseDTO> {
        const adminExists = await this.adminsRepository.findByEmail(data.email);
        
        if (adminExists) {
            throw new Error('Admin already exists');
        }

        const admin = await this.adminsRepository.create(data);
        return admin;
    }
}