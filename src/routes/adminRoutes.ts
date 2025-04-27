import { Router } from 'express';
import { Auth } from '../middlewares/Auth';
import { authAdminController, createAdminController } from '../controllers/Admin';

const router = Router();
const auth = new Auth();

// Public routes
router.post('/auth', authAdminController.handle);
router.post('/', createAdminController.handle);

// Protected routes
router.get('/profile', auth.private, (req, res) => {
    return res.json({ message: 'Admin profile' });
});

export default router; 