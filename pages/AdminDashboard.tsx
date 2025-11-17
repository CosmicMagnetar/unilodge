import React, { useState, useEffect } from 'react';
import { User, Room, Booking } from '../types.ts';
import { api } from '../services/api.ts';
import { Card } from './ui.tsx';
import { PriceSuggestionTool } from './PriceSuggestionTool.tsx';
import AiAgentChat  from './AiAgentChat.tsx';

export type AdminDashboardProps = { 
    user: User; 
    rooms: Room[]; 
    bookings: Booking[]; 
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, rooms, bookings }) => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [wardens, setWardens] = useState<User[]>([]);
    const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
    const [activeTab, setActiveTab] = useState<'wardens' | 'rooms' | 'payments'>('wardens');

    useEffect(() => {
        api.getAnalytics()
            .then(data => setAnalytics(data))
            .catch(err => console.error('Failed to load analytics:', err));
        
        // Fetch wardens
        // some builds of `api` may not expose a dedicated getWardens method, so cast to any and provide a fallback
        if ((api as any).getWardens) {
            (api as any).getWardens()
                .then((data: User[]) => setWardens(data))
                .catch((err: any) => console.error('Failed to load wardens:', err));
        } else if ((api as any).getUsers) {
            // fallback to a generic getUsers endpoint if available
            (api as any).getUsers({ role: 'warden' })
                .then((data: User[]) => setWardens(data))
                .catch((err: any) => console.error('Failed to load wardens via getUsers:', err));
        } else {
            // no API available for wardens; initialize empty to avoid runtime errors
            setWardens([]);
        }
        
        // Fetch pending rooms
        if ((api as any).getPendingRooms) {
            (api as any).getPendingRooms()
                .then((data: Room[]) => setPendingRooms(data))
                .catch((err: any) => console.error('Failed to load pending rooms:', err));
        } else if ((api as any).getRooms) {
            // fallback to generic getRooms with status filter if available
            (api as any).getRooms({ status: 'pending' })
                .then((data: Room[]) => setPendingRooms(data))
                .catch((err: any) => console.error('Failed to load pending rooms via getRooms:', err));
        } else {
            // no API available for pending rooms; initialize empty to avoid runtime errors
            setPendingRooms([]);
        }
    }, [bookings]);

    const handleApproveRoom = async (roomId: string) => {
        try {
            if ((api as any).approveRoom) {
                await (api as any).approveRoom(roomId);
            }
            setPendingRooms(prev => prev.filter(r => r.id !== roomId));
        } catch (err) {
            console.error('Failed to approve room:', err);
        }
    };

    const handleRejectRoom = async (roomId: string) => {
        try {
            if ((api as any).rejectRoom) {
                await (api as any).rejectRoom(roomId);
            }
            setPendingRooms(prev => prev.filter(r => r.id !== roomId));
        } catch (err) {
            console.error('Failed to reject room:', err);
        }
    };

    const getPaymentStatus = (booking: Booking) => {
        return booking.paymentStatus || 'pending';
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-green-600 bg-green-50';
            case 'pending': return 'text-yellow-600 bg-yellow-50';
            case 'failed': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <>
         <div className="bg-brand-blue py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-light-text/80 mt-1">Tools to manage bookings and pricing.</p>
            </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {analytics && (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                        <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                        <p className="text-3xl font-bold text-dark-text mt-2">${analytics.totalRevenue?.toLocaleString() || 0}</p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
                        <p className="text-3xl font-bold text-dark-text mt-2">{analytics.occupancyRate?.toFixed(1) || 0}%</p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                        <p className="text-3xl font-bold text-dark-text mt-2">{analytics.totalBookings || 0}</p>
                    </Card>
                </div>
            )}

            {/* Management Section */}
            <Card className="p-6 mb-8">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('wardens')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'wardens'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Wardens Management
                        </button>
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'rooms'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Room Approvals
                            {pendingRooms.length > 0 && (
                                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                                    {pendingRooms.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'payments'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Payment Status
                        </button>
                    </nav>
                </div>

                {/* Wardens Tab */}
                {activeTab === 'wardens' && (
                    <div>
                        <h2 className="text-xl font-bold text-dark-text mb-4">Wardens List</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {wardens.map((warden) => (
                                        <tr key={warden.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{warden.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warden.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warden.building || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                                <button className="text-red-600 hover:text-red-900">Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Room Approvals Tab */}
                {activeTab === 'rooms' && (
                    <div>
                        <h2 className="text-xl font-bold text-dark-text mb-4">Pending Room Approvals</h2>
                        {pendingRooms.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No pending rooms for approval</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingRooms.map((room) => (
                                    <Card key={room.id} className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-dark-text">{room.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                                                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                                                    <span>Type: {room.type}</span>
                                                    <span>Price: ${room.price}/month</span>
                                                    <span>Building: {room.building}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 ml-4">
                                                <button
                                                    onClick={() => handleApproveRoom(room.id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRoom(room.id)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div>
                        <h2 className="text-xl font-bold text-dark-text mb-4">Payment Status Overview</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map((booking) => {
                                        const status = getPaymentStatus(booking);
                                        return (
                                            <tr key={booking.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.id.slice(0, 8)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.studentName || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.roomTitle || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${booking.amount || 0}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(status)}`}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Card>

            <div className="mt-8 grid lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-1 space-y-8">
                    <PriceSuggestionTool />
                </div>
                <div className="lg:col-span-2">
                    <AiAgentChat userRole={user.role} />
                </div>
            </div>
        </div>
        </>
    );
};