import { Router } from "express";
import { authAdminController, createAdminController } from "../controllers/Admin";
import { Auth } from '../middlewares/Auth'
import multer from 'multer';
import UploadImage from '../middlewares/UploadImage'
import { createCharactterController, deleteCharacterController, editCharacterController, getCharacterByIdController, listCharactersController, searchCharacterController } from "../controllers/Character";

const auth = new Auth();

const router = Router();

router.post('/admin', auth.private, createAdminController.create)
router.post('/admin/signin', authAdminController.login)

router.post('/character', auth.private, multer(UploadImage).single("image"), createCharactterController.create)
router.get('/characters', listCharactersController.listCharacters)
router.get('/character/:id', getCharacterByIdController.getCharacterById)
router.put('/character/:id', auth.private, multer(UploadImage).single("image"), editCharacterController.editCharacter)
router.delete('/character/:id', auth.private, deleteCharacterController.deleteCharacter)
router.get('/search', searchCharacterController.search)

export { router }