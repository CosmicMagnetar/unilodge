import { Router } from 'express';
import { getRooms, getRoom, createRoom, updateRoom, deleteRoom } from '../controllers/roomController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoom);
router.post('/', authMiddleware, adminOnly, createRoom);
router.put('/:id', authMiddleware, adminOnly, updateRoom);
router.delete('/:id', authMiddleware, adminOnly, deleteRoom);

export default router;
