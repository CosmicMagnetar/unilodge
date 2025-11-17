import { Router } from 'express';
import { register, login, logout, refreshTokenEndpoint, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh', refreshTokenEndpoint);
router.get('/me', authMiddleware, getMe);

export default router;
