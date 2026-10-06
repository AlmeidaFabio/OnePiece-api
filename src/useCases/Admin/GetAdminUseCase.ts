import { IAdminRepository } from '../../repositories/IAdminRepository';
import { IAdminResponseDTO } from '../../dtos/IAdminResponseDTO';

export class GetAdminUseCase {
    constructor(private adminsRepository: IAdminRepository) {}

    /**
     * Propaga o erro do repositório (AppError 404 quando não existe).
     * Antes o erro era engolido com .catch(error => error) e o controller
     * respondia 200 com um objeto vazio.
     */
    async execute(id: string): Promise<IAdminResponseDTO> {
        return this.adminsRepository.getAdmin(id);
    }
}
