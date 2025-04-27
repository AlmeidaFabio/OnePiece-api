import { Router } from "express";
import { Auth } from '../middlewares/Auth'
import { HomeController } from "../controllers/HomeController";
import adminRoutes from './adminRoutes';
import charRoutes from './charRoutes';

const auth = new Auth();

const router = Router();

router.get('/', new HomeController().home)

// Admin routes
router.use('/admin', auth.private, adminRoutes);

// Character routes
router.use('/characters', charRoutes);

export default router;