import React, { useState } from 'react';
import { User, Room, Role } from '../types.ts';
import { RoomCard } from './RoomCard.tsx';
import { Card } from './ui.tsx';
import AiAgentChat from './AiAgentChat.tsx';

export type GuestDashboardProps = { 
    user: User; 
    rooms: Room[]; 
    onBook: (roomId: string) => void; 
};

// Sub-components
const FeaturedCard: React.FC<{ imgSrc: string; title: string; subtitle: string }> = ({ imgSrc, title, subtitle }) => (
  <div className="text-center">
    <img src={imgSrc} alt={title} className="w-36 h-36 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md" />
    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; authorImg: string; authorName: string }> = ({ quote, authorImg, authorName }) => (
  <Card className="max-w-lg mx-auto p-6">
    <div className="flex items-start gap-4">
      <img src={authorImg} alt={authorName} className="w-14 h-14 rounded-full object-cover" />
      <div>
        <p className="text-gray-700 italic">"{quote}"</p>
        <p className="font-semibold text-gray-800 mt-3">- {authorName}</p>
      </div>
    </div>
  </Card>
);

export const GuestDashboard: React.FC<GuestDashboardProps> = ({ user, rooms, onBook }) => {
    const [activeFilter, setActiveFilter] = useState('All Rooms');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [roomType, setRoomType] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        university: '',
        visitType: '',
        reason: '',
        startDate: '',
        endDate: ''
    });

    const filters = ['All Rooms', 'Single Room', 'Furnished Options', 'Near Campus'];
    const universities = ['Harvard University', 'MIT', 'Stanford University', 'UCLA', 'Yale University', 'Princeton University'];
    const visitTypes = ['Guest Lecturer', 'Guest Intern', 'Research Collaboration', 'Visiting Faculty', 'Conference Attendee', 'Other'];
    
    const featuredListings = [
        { imgSrc: 'https://images.unsplash.com/photo-1519974749348-7c56d680b18f?q=80&w=200&h=200&fit=crop', title: 'The Village', subtitle: 'Average Rent: $750/month' },
        { imgSrc: 'https://images.unsplash.com/photo-1540518614946-b68b68c04e28?q=80&w=200&h=200&fit=crop', title: 'Shared Apartments', subtitle: 'Average Rent: $500/month' },
        { imgSrc: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=200&h=200&fit=crop', title: 'Near Campus', subtitle: 'Average Rent: $1100/month' },
    ];

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Guest Request Submitted:', requestForm);
        // API call to submit request
        setShowRequestModal(false);
        // Reset form
        setRequestForm({
            university: '',
            visitType: '',
            reason: '',
            startDate: '',
            endDate: ''
        });
    };

    // Filter rooms based on selected criteria
    const filteredRooms = rooms.filter(room => {
        if (!room.isAvailable) return false;
        if (selectedUniversity && room.university !== selectedUniversity) return false;
        if (roomType && room.type !== roomType) return false;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            if (room.price < min || room.price > max) return false;
        }
        if (activeFilter !== 'All Rooms') {
            if (activeFilter === 'Single Room' && room.type !== 'Single') return false;
            if (activeFilter === 'Furnished Options' && !room.furnished) return false;
            if (activeFilter === 'Near Campus' && !room.nearCampus) return false;
        }
        return true;
    });

    return (
        <>
            <AiAgentChat userRole={Role.GUEST} />
            
            {/* Hero Section */}
            <div className="relative h-[400px] bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1560185893-a55d8800b6e2?q=80&w=1920&h=450&fit=crop" 
                    alt="University campus" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60" 
                />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-5xl font-extrabold text-white mb-4 shadow-lg">
                        Welcome, {user.name}!
                    </h1>
                    <p className="text-xl text-white/90 mb-6">Find your perfect campus accommodation</p>
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
                    >
                        Submit Guest Request
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Featured Listings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                    {featuredListings.map(item => (
                        <FeaturedCard key={item.title} {...item} />
                    ))}
                </div>

                {/* Advanced Filters */}
                <Card className="p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Filter & Search</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                            <select
                                value={selectedUniversity}
                                onChange={(e) => setSelectedUniversity(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Universities</option>
                                {universities.map(uni => (
                                    <option key={uni} value={uni}>{uni}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                            <select
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Suite">Suite</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Any Price</option>
                                <option value="0-500">$0 - $500</option>
                                <option value="500-1000">$500 - $1000</option>
                                <option value="1000-1500">$1000 - $1500</option>
                                <option value="1500-5000">$1500+</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedUniversity('');
                                    setRoomType('');
                                    setPriceRange('');
                                    setActiveFilter('All Rooms');
                                }}
                                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Quick Filter Buttons */}
                <div className="flex items-center justify-center space-x-3 mb-10">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                activeFilter === filter 
                                ? 'bg-blue-800 text-white' 
                                : 'bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Available Rooms */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Available Rooms ({filteredRooms.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRooms.map(room => (
                            <RoomCard key={room.id} room={room} onBook={onBook} />
                        ))}
                    </div>
                    {filteredRooms.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No rooms match your criteria. Try adjusting your filters.</p>
                        </div>
                    )}
                </div>

                {/* Testimonials & Partners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Guest Testimonials</h2>
                        <TestimonialCard 
                            quote="As a visiting lecturer, finding accommodation was always stressful. This platform made it seamless!"
                            authorImg="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop"
                            authorName="Dr. Sarah Mitchell"
                        />
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Partner Universities</h2>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            {universities.slice(0, 4).map(uni => (
                                <span key={uni} className="text-sm font-semibold text-gray-500">
                                    {uni}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Guest Request Modal */}
            {showRequestModal && (
                <>
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setShowRequestModal(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Submit Guest Request</h2>
                                    <button
                                        onClick={() => setShowRequestModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleRequestSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            University *
                                        </label>
                                        <select
                                            required
                                            value={requestForm.university}
                                            onChange={(e) => setRequestForm({...requestForm, university: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select University</option>
                                            {universities.map(uni => (
                                                <option key={uni} value={uni}>{uni}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Visit Type *
                                        </label>
                                        <select
                                            required
                                            value={requestForm.visitType}
                                            onChange={(e) => setRequestForm({...requestForm, visitType: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select Visit Type</option>
                                            {visitTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start Date *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={requestForm.startDate}
                                                onChange={(e) => setRequestForm({...requestForm, startDate: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End Date *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={requestForm.endDate}
                                                onChange={(e) => setRequestForm({...requestForm, endDate: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason for Visit *
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={requestForm.reason}
                                            onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                                            placeholder="Please describe the purpose of your visit and any special requirements..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold"
                                        >
                                            Submit Request
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowRequestModal(false)}
                                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </>
    );
};