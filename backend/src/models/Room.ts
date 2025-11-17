import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  type: 'Single' | 'Double' | 'Suite';
  price: number;
  amenities: string[];
  rating: number;
  imageUrl: string;
  isAvailable: boolean;
  description?: string;
  capacity: number;
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Single', 'Double', 'Suite'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  amenities: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export model - check if it already exists to avoid recompiling
const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
