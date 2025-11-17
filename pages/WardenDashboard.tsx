import React from 'react';
import { User, Booking, Role } from '../types.ts';
import { Card } from './ui.tsx';
import  AiAgentChat  from './AiAgentChat.tsx';
import { Button } from './ui.tsx';

export type WardenDashboardProps = {
    user: User;
    bookings: Booking[];
    onCheckIn: (bookingId: string) => void;
    onCheckOut: (bookingId: string) => void;
};

// Helper to format date/time
const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString();
};

export const WardenDashboard: React.FC<WardenDashboardProps> = ({ user, bookings, onCheckIn, onCheckOut }) => {
    
    // Wardens only care about Confirmed, CheckedIn, or CheckedOut bookings
    const relevantBookings = bookings.filter(b => 
        b.status === 'Confirmed' || b.status === 'CheckedIn' || b.status === 'CheckedOut'
    );

    return (
        <>
         <div className="bg-brand-blue py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white">Warden Dashboard</h1>
                <p className="text-light-text/80 mt-1">Manage guest check-ins and check-outs.</p>
            </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
                
                {/* Main Content: Booking List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-dark-text">Guest Management</h2>
                    {relevantBookings.length === 0 ? (
                        <Card className="p-6 text-center text-gray-500">
                            No active bookings to manage.
                        </Card>
                    ) : (
                        relevantBookings.map(booking => (
                            <Card key={booking.id} className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    {/* Booking Info */}
                                    <div className="flex-1">
                                        <p className="text-xl font-bold text-dark-text">
                                            {booking.user?.name || 'Guest'} - Room {booking.room?.roomNumber}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Dates:</span> {new Date(booking.checkInDate).toLocaleDateString()} to {new Date(booking.checkOutDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Email:</span> {booking.user?.email || 'N/A'}
                                        </p>
                                    </div>
                                    
                                    {/* Status & Actions */}
                                    <div className="flex flex-col items-start sm:items-end gap-2">
                                        <span className={`px-3 py-1 text-sm font-semibold w-full text-center sm:w-auto ${
                                            booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                            booking.status === 'CheckedIn' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                        
                                        {/* Action Buttons */}
                                        {booking.status === 'Confirmed' && (
                                            <Button onClick={() => onCheckIn(booking.id)} variant="primary" className="!px-4 !py-2 header-primary w-full sm:w-auto">Check In</Button>
                                        )}
                                        {booking.status === 'CheckedIn' && (
                                            <Button onClick={() => onCheckOut(booking.id)} variant="secondary" className="!px-4 !py-2 header-secondary w-full sm:w-auto">Check Out</Button>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Check-in/Out Times */}
                                {booking.status === 'CheckedIn' || booking.status === 'CheckedOut' ? (
                                    <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-700 space-y-1">
                                        <p><span className="font-semibold">Checked In:</span> {formatDateTime(booking.actualCheckIn)}</p>
                                        <p><span className="font-semibold">Checked Out:</span> {formatDateTime(booking.actualCheckOut)}</p>
                                    </div>
                                ) : null}
                            </Card>
                        ))
                    )}
                </div>
                
                {/* Sidebar: AI Chat */}
                <div className="lg:col-span-1">
                     <AiAgentChat userRole={Role.WARDEN} />
                </div>

            </div>
        </div>
        </>
    );
};