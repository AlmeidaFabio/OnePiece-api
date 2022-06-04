import { CharactersRepository } from "../../repositories/implementations/CharactersRepository";
import { CreateCharacterUseCase } from "../../useCases/Character/CreateCharacterUseCase";
import { DeleteCharacterUseCase } from "../../useCases/Character/DeleteCharacterUseCase";
import { EditCharacterUseCase } from "../../useCases/Character/EditCharacterUseCase";
import { GetCharacterByIdUseCase } from "../../useCases/Character/GetCharacterByIdUseCase";
import { ListCharactersUseCase } from "../../useCases/Character/ListCharactersUseCase";
import { SearchCharacterUseCase } from "../../useCases/Character/SearchCharacterUseCase";
import { CreateCharacterController } from "./CreateCharacterController";
import { DeleteCharacterController } from "./DeleteCharacterController";
import { EditCharacterController } from "./EditCharacterController";
import { GetCharacterByIdController } from "./GetCharacterByIdController";
import { ListCharactersController } from "./ListCharactersController";
import { SearchCharacterController } from "./SearchCharacterController";

const charactersRepository = new CharactersRepository()

const createCharacterUseCase = new CreateCharacterUseCase(charactersRepository)
const createCharactterController = new CreateCharacterController(createCharacterUseCase)

const listCharactersUseCase = new ListCharactersUseCase(charactersRepository)
const listCharactersController = new ListCharactersController(listCharactersUseCase)

const getCharacterByIdUseCase = new GetCharacterByIdUseCase(charactersRepository)
const getCharacterByIdController = new GetCharacterByIdController(getCharacterByIdUseCase)

const editCharacterUseCase = new EditCharacterUseCase(charactersRepository)
const editCharacterController = new EditCharacterController(editCharacterUseCase)

const deleteCharacterUseCase = new DeleteCharacterUseCase(charactersRepository)
const deleteCharacterController = new DeleteCharacterController(deleteCharacterUseCase)

const searchCharacterUseCase = new SearchCharacterUseCase(charactersRepository)
const searchCharacterController = new SearchCharacterController(searchCharacterUseCase)

export {
    createCharactterController,
    listCharactersController,
    getCharacterByIdController,
    editCharacterController,
    deleteCharacterController,
    searchCharacterController
}