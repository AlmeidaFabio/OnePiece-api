import { Router } from 'express';
import { Auth } from '../middlewares/Auth';
import {
    createCharactterController,
    editCharacterController,
    getCharacterByIdController,
    listCharactersController,
    deleteCharacterController,
    searchCharacterController
} from '../controllers/Character';
import multer from 'multer';
import { validateRequest } from '../middlewares/validateRequest';
import {
    createCharacterSchema,
    updateCharacterSchema,
    getCharactersSchema,
    getCharacterByIdSchema,
    searchCharactersSchema
} from '../validations/characterValidations';
import uploadConfig from '../middlewares/UploadImage';

const router = Router();
const auth = new Auth();
const upload = multer(uploadConfig);

// Public routes
router.get('/', validateRequest(getCharactersSchema, 'query'), listCharactersController.handle);
// /search precisa vir antes de /:id, senão "search" seria tratado como um ID.
router.get('/search', validateRequest(searchCharactersSchema, 'query'), searchCharacterController.search);
router.get('/:id', validateRequest(getCharacterByIdSchema, 'params'), getCharacterByIdController.handle);

// Protected routes
router.post(
    '/',
    auth.private,
    upload.single('image'),
    validateRequest(createCharacterSchema),
    createCharactterController.handle
);

// A validação do ID vem antes do upload: um ID malformado não chega a
// processar imagem nenhuma.
router.put(
    '/:id',
    auth.private,
    validateRequest(getCharacterByIdSchema, 'params'),
    upload.single('image'),
    validateRequest(updateCharacterSchema),
    editCharacterController.handle
);

router.delete(
    '/:id',
    auth.private,
    validateRequest(getCharacterByIdSchema, 'params'),
    deleteCharacterController.handle
);

export default router;
