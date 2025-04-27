import { AdminsRepository } from "../../repositories/implementations/AdminsRepository";
import { GetAdminUseCase } from "../../useCases/Admin/GetAdminUseCase";
import { CreateAdminUseCase } from "../../useCases/Admin/CreateAdminUseCase";
import { AuthAdminController } from "./AuthAdminController";
import { CreateAdminController } from "./CreateAdminController";
import { GetAdminByIdController } from "./GetAdminByIdController";

const adminsRepository = new AdminsRepository();

const createAdminUseCase = new CreateAdminUseCase(adminsRepository);
const createAdminController = new CreateAdminController(createAdminUseCase);

const authAdminController = new AuthAdminController(adminsRepository);

const getAdminUseCase = new GetAdminUseCase(adminsRepository);
const getAdminController = new GetAdminByIdController(getAdminUseCase);

export { createAdminController, authAdminController, getAdminController };