import { Router } from "express";
import { Auth } from '../middlewares/Auth'
import { HomeController } from "../controllers/HomeController";
import adminRoutes from './adminRoutes';
import charRoutes from './charRoutes';
import { searchCharacterController } from "../controllers/Character";

const auth = new Auth();

const router = Router();

router.get('/', new HomeController().home)

// Admin routes
router.use('/admin', adminRoutes);

// Character routes
router.use('/characters', charRoutes);

router.get('/search', searchCharacterController.search)

export default router;