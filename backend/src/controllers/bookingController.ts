import { Response } from 'express';
import Booking from '../models/Booking';
import Room from '../models/Room';
import User from '../models/User';
import { AuthRequest } from '../types';

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const query: any = {};
    
    // If not admin, only show user's bookings
    if (req.user?.role !== 'ADMIN') {
      query.userId = req.user?.id;
    }

    const bookings = await Booking.find(query)
      .populate('roomId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings.map(b => ({
      id: b._id.toString(),
      roomId: b.roomId._id.toString(),
      userId: b.userId._id.toString(),
      checkInDate: b.checkInDate,
      checkOutDate: b.checkOutDate,
      status: b.status,
      totalPrice: b.totalPrice,
      createdAt: b.createdAt,
      room: b.roomId,
      user: req.user?.role === 'ADMIN' ? {
        id: (b.userId as any)._id.toString(),
        name: (b.userId as any).name,
        email: (b.userId as any).email,
      } : undefined,
    })));
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('roomId')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (req.user?.role !== 'ADMIN' && (booking.userId as any)._id.toString() !== req.user?.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: booking._id.toString(),
      roomId: booking.roomId._id.toString(),
      userId: booking.userId._id.toString(),
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      status: booking.status,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt,
      room: booking.roomId,
      user: req.user?.role === 'ADMIN' ? {
        id: (booking.userId as any)._id.toString(),
        name: (booking.userId as any).name,
        email: (booking.userId as any).email,
      } : undefined,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'Room ID, check-in, and check-out dates are required' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.isAvailable) {
      return res.status(400).json({ error: 'Room is not available' });
    }

    // Check for date conflicts
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkIn >= checkOut) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      roomId,
      status: { $ne: 'Cancelled' },
      $or: [
        {
          checkInDate: { $lte: checkIn },
          checkOutDate: { $gt: checkIn }
        },
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gte: checkOut }
        },
        {
          checkInDate: { $gte: checkIn },
          checkOutDate: { $lte: checkOut }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Room is already booked for these dates' });
    }

    // Calculate total price
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    const newBooking = new Booking({
      roomId,
      userId: req.user!.id,
      checkInDate,
      checkOutDate,
      status: 'Pending',
      totalPrice,
    });

    await newBooking.save();
    await newBooking.populate('roomId');
    
    res.status(201).json({
      id: newBooking._id.toString(),
      roomId: newBooking.roomId._id.toString(),
      userId: newBooking.userId.toString(),
      checkInDate: newBooking.checkInDate,
      checkOutDate: newBooking.checkOutDate,
      status: newBooking.status,
      totalPrice: newBooking.totalPrice,
      createdAt: newBooking.createdAt,
      room: newBooking.roomId,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Only admin can update status, or users can cancel their own bookings
    if (req.user?.role !== 'ADMIN' && (status !== 'Cancelled' || booking.userId.toString() !== req.user?.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    booking.status = status as any;
    await booking.save();
    
    await booking.populate('roomId');
    
    res.json({
      id: booking._id.toString(),
      roomId: booking.roomId._id.toString(),
      userId: booking.userId.toString(),
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      status: booking.status,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt,
      room: booking.roomId,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
