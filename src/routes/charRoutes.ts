import { Router } from 'express';
import { Auth } from '../middlewares/Auth';
import { createCharactterController, editCharacterController, getCharacterByIdController, listCharactersController, deleteCharacterController } from '../controllers/Character';
import multer from 'multer';

const router = Router();
const auth = new Auth();
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/', listCharactersController.handle);
router.get('/:id', getCharacterByIdController.handle);

// Protected routes
router.post('/', auth.private, upload.single('image'), createCharactterController.handle);
router.put('/:id', auth.private, upload.single('image'), editCharacterController.handle);
router.delete('/:id', auth.private, deleteCharacterController.handle);

export default router; 