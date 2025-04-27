import { Router } from 'express';
import { Auth } from '../middlewares/Auth';
import { createCharactterController, editCharacterController, getCharacterByIdController, listCharactersController, deleteCharacterController, searchCharacterController } from '../controllers/Character';
import multer from 'multer';
import { validateRequest } from '../middlewares/validateRequest';
import { 
    createCharacterSchema, 
    updateCharacterSchema, 
    getCharactersSchema 
} from '../validations/characterValidations';
import uploadConfig from '../middlewares/UploadImage';

const router = Router();
const auth = new Auth();
const upload = multer(uploadConfig);

// Public routes
router.get('/', validateRequest(getCharactersSchema), listCharactersController.handle);
router.get('/search', searchCharacterController.search);
router.get('/:id', getCharacterByIdController.handle);

// Protected routes
router.post('/', 
    auth.private, 
    upload.single('image'),
    validateRequest(createCharacterSchema),
    createCharactterController.handle
);

router.put('/:id', 
    auth.private, 
    upload.single('image'),
    validateRequest(updateCharacterSchema),
    editCharacterController.handle
);

router.delete('/:id', 
    auth.private,
    deleteCharacterController.handle
);

export default router; 