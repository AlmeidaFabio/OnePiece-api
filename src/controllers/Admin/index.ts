import { AdminsRepository } from "../../repositories/implementations/AdminsRepository.typeorm";
import { AuthAdminUseCase } from "../../useCases/Admin/AuthAdminUseCase";
import { CreateAdminUseCase } from "../../useCases/Admin/CreateAdminUseCase";
import { GetAdminUseCase } from "../../useCases/Admin/GetAdminUseCase";
import { AuthAdminController } from "./AuthAdminController";
import { CreateAdminController } from "./CreateAdminController";
import { GetAdminByIdController } from "./GetAdminByIdController";

const adminsRepository = new AdminsRepository()

const createAdminUseCase = new CreateAdminUseCase(adminsRepository)
const createAdminController = new CreateAdminController(createAdminUseCase)

const authAdminUseCase = new AuthAdminUseCase(adminsRepository)
const authAdminController = new AuthAdminController(authAdminUseCase)

const getAdminUseCase = new GetAdminUseCase(adminsRepository)
const getAdminController = new GetAdminByIdController(getAdminUseCase)

export { createAdminController, authAdminController, getAdminController }