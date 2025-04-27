import { Router } from 'express';
import { Auth } from '../middlewares/Auth';
import { authAdminController, createAdminController, getAdminController } from '../controllers/Admin';
import { validateRequest } from '../middlewares/validateRequest';
import { createAdminSchema, authAdminSchema } from '../validations/adminValidations';

const router = Router();
const auth = new Auth();

// Public routes
router.post('/auth', validateRequest(authAdminSchema), authAdminController.handle);
router.post('/', validateRequest(createAdminSchema), createAdminController.handle);

// Protected routes
router.get('/profile', auth.private, getAdminController.handle);

export default router; 