import { Router } from 'express';
import { Auth } from '../middlewares/Auth';
import { authAdminController, createAdminController, getAdminController } from '../controllers/Admin';
import { validateRequest } from '../middlewares/validateRequest';
import { createAdminSchema, authAdminSchema } from '../validations/adminValidations';
import { loginRateLimit } from '../middlewares/rateLimit';

const router = Router();
const auth = new Auth();

// Public routes
// O login precisa ser público: é a única forma de obter o token usado nas rotas protegidas.
// O rate limit por IP dificulta tentativas de força bruta na senha.
router.post('/auth', loginRateLimit, validateRequest(authAdminSchema), authAdminController.handle);

// Protected routes
// Criar admin continua exigindo autenticação (evita que qualquer um se promova a admin).
// O primeiro admin é criado por `npm run admin:create` (src/database/createAdmin.ts).
router.post('/', auth.private, validateRequest(createAdminSchema), createAdminController.handle);
router.get('/profile', auth.private, getAdminController.handle);

export default router;
