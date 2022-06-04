import { AdminsRepository } from "../../repositories/implementations/AdminsRepository.typeorm";
import { AuthAdminUseCase } from "../../useCases/Admin/AuthAdminUseCase";
import { CreateAdminUseCase } from "../../useCases/Admin/CreateAdminUseCase";
import { AuthAdminController } from "./AuthAdminController";
import { CreateAdminController } from "./CreateAdminController";

const adminsRepository = new AdminsRepository()

const createAdminUseCase = new CreateAdminUseCase(adminsRepository)
const createAdminController = new CreateAdminController(createAdminUseCase)

const authAdminUseCase = new AuthAdminUseCase(adminsRepository)
const authAdminController = new AuthAdminController(authAdminUseCase)

export { createAdminController, authAdminController }