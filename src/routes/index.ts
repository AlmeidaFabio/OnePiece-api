import { Router } from "express";
import multer from 'multer';
import { Auth } from '../middlewares/Auth'
import UploadImage from '../middlewares/UploadImage'
import { authAdminController, createAdminController } from "../controllers/Admin";
import { createCharactterController, deleteCharacterController, editCharacterController, getCharacterByIdController, listCharactersController, searchCharacterController } from "../controllers/Character";
import { HomeController } from "../controllers/HomeController";

const auth = new Auth();

const router = Router();

router.get('/', new HomeController().home)

router.post('/admin', auth.private, createAdminController.create)
router.post('/admin/signin', authAdminController.login)

router.post('/character', auth.private, multer(UploadImage).single("image"), createCharactterController.create)
router.get('/characters', listCharactersController.listCharacters)
router.get('/character/:id', getCharacterByIdController.getCharacterById)
router.put('/character/:id', auth.private, multer(UploadImage).single("image"), editCharacterController.editCharacter)
router.delete('/character/:id', auth.private, deleteCharacterController.deleteCharacter)
router.get('/search', searchCharacterController.search)

export { router }