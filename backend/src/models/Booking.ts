import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  roomId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  totalPrice: number;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending',
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
BookingSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 });
BookingSchema.index({ userId: 1 });

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
