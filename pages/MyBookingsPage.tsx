import React from 'react';
import { Booking } from '../types.ts';
import { Card, Button } from './ui.tsx';

export type MyBookingsPageProps = { 
    bookings: Booking[]; 
    onCancel?: (bookingId: string) => void; 
};

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ bookings, onCancel }) => (
    <>
    {/* This page's blue header will also look out of place. */}
    <div className="bg-brand-blue py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>
            <p className="text-light-text/80 mt-1">Review and manage your upcoming stays.</p>
        </div>
    </div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {bookings.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You have no bookings yet.</p>
            </div>
        ) : (
            <div className="space-y-6">
                {bookings.map(booking => (
                    <Card key={booking.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <img src={booking.room?.imageUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800'} alt="" className="w-full sm:w-48 h-40 object-cover rounded" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-700">{booking.room?.type} Room</p>
                            <h2 className="text-xl font-bold text-dark-text">Room {booking.room?.roomNumber}</h2>
                            <p className="text-gray-600 mt-2"><b>Dates:</b> {new Date(booking.checkInDate).toLocaleDateString()} to {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                            <p className="text-gray-600"><b>Total:</b> ${booking.totalPrice || (booking.room?.price || 0) * Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <span className={`px-3 py-1 text-sm font-semibold w-full text-center sm:w-auto ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                {booking.status}
                            </span>
                            {booking.status === 'Pending' && onCancel && (
                                <Button onClick={() => onCancel(booking.id)} variant="secondary" className="!py-2 !px-4 text-sm header-secondary">Cancel</Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        )}
    </div>
    </>
);