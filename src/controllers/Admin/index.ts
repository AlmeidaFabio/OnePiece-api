import { AdminsRepository } from "../../repositories/implementations/AdminsRepository";
import { GetAdminUseCase } from "../../useCases/Admin/GetAdminUseCase";
import { AuthAdminController } from "./AuthAdminController";
import { CreateAdminController } from "./CreateAdminController";
import { GetAdminByIdController } from "./GetAdminByIdController";

const adminsRepository = new AdminsRepository()

const createAdminController = new CreateAdminController()

const authAdminController = new AuthAdminController()

const getAdminUseCase = new GetAdminUseCase(adminsRepository)
const getAdminController = new GetAdminByIdController(getAdminUseCase)

export { createAdminController, authAdminController, getAdminController }