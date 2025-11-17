import { Request, Response } from 'express';
import Room from '../models/Room';

export const getRooms = async (req: Request, res: Response) => {
  try {
    const { type, minPrice, maxPrice, available } = req.query;
    
    const query: any = {};
    
    if (type) {
      query.type = type;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    const rooms = await Room.find(query).sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Get reviews for this room
    const Review = (await import('../models/Review')).default;
    const reviews = await Review.find({ roomId: id }).populate('userId', 'name');
    
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : room.rating;

    res.json({ 
      ...room.toObject(), 
      rating: avgRating, 
      reviews: reviews.map(r => ({
        id: r._id.toString(),
        rating: r.rating,
        comment: r.comment,
        user: r.userId,
        createdAt: r.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { roomNumber, type, price, amenities, description, capacity, imageUrl } = req.body;

    if (!roomNumber || !type || !price) {
      return res.status(400).json({ error: 'Room number, type, and price are required' });
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(409).json({ error: 'Room number already exists' });
    }

    const newRoom = new Room({
      roomNumber,
      type,
      price: Number(price),
      amenities: amenities || [],
      description: description || '',
      capacity: capacity || 1,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800',
      rating: 0,
      isAvailable: true,
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error: any) {
    console.error('Create room error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Room number already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(updatedRoom);
  } catch (error: any) {
    console.error('Update room error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Room number already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
