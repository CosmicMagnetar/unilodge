import { Router } from 'express';
import { getBookings, getBooking, createBooking, updateBookingStatus } from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All booking routes require authentication - wrap async middleware
router.use((req, res, next) => {
  authMiddleware(req as any, res, next);
});

router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);

export default router;
