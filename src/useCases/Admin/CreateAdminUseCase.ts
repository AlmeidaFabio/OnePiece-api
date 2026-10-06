import { IAdminRepository } from '../../repositories/IAdminRepository';
import { IAdminRequestDTO } from '../../dtos/IAdminRequestDTO';
import { IAdminResponseDTO } from '../../dtos/IAdminResponseDTO';
import { AppError } from '../../errors/AppError';

export class CreateAdminUseCase {
    constructor(private adminsRepository: IAdminRepository) {}

    async execute(data: IAdminRequestDTO): Promise<IAdminResponseDTO> {
        const adminExists = await this.adminsRepository.findByEmail(data.email);

        if (adminExists) {
            throw new AppError('Admin already exists', 409);
        }

        return this.adminsRepository.create(data);
    }
}
