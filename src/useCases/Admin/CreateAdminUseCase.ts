import { IAdminRepository } from '../../repositories/IAdminRepository';
import { IAdminRequestDTO } from '../../dtos/IAdminRequestDTO';

export class CreateAdminUseCase {
    constructor(private adminsRepository: IAdminRepository) {}

    async execute(data: IAdminRequestDTO): Promise<void> {
        const adminExists = await this.adminsRepository.findByEmail(data.email);
        
        if (adminExists) {
            throw new Error('Admin already exists');
        }

        await this.adminsRepository.create(data);
    }
}