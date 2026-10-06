import { Router } from 'express';
import { HomeController } from '../controllers/HomeController';
import adminRoutes from './adminRoutes';
import charRoutes from './charRoutes';

const router = Router();

router.get('/', new HomeController().home);

// Admin routes
// O middleware de autenticação NÃO é aplicado ao prefixo inteiro: cada rota
// protegida declara auth.private individualmente em adminRoutes.ts. Aplicá-lo
// aqui exigia token no próprio /admin/auth (login), tornando o login impossível.
router.use('/admin', adminRoutes);

// Character routes
router.use('/characters', charRoutes);

export default router;
