
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room';
import { connectDB } from '../config/database';

dotenv.config();

const universities = [
    'Harvard University',
    'MIT',
    'Stanford University',
    'UCLA',
    'Yale University',
    'Princeton University'
];

const roomTypes = ['Single', 'Double', 'Suite'];

const amenitiesList = [
    'WiFi', 'AC', 'Heater', 'Kitchen', 'Laundry', 'Gym', 'Pool', 'Parking', 'TV', 'Study Desk'
];

const generateRooms = () => {
    const rooms = [];
    let count = 1;

    for (const uni of universities) {
        // Create 8-12 rooms per university
        const numRooms = Math.floor(Math.random() * 5) + 8;

        for (let i = 0; i < numRooms; i++) {
            const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
            const price = type === 'Single' ? 800 + Math.floor(Math.random() * 400) :
                type === 'Double' ? 500 + Math.floor(Math.random() * 300) :
                    1200 + Math.floor(Math.random() * 800);

            // Random amenities (3-6)
            const amenities = [];
            const shuffledAmenities = [...amenitiesList].sort(() => 0.5 - Math.random());
            const numAmenities = Math.floor(Math.random() * 4) + 3;
            for (let j = 0; j < numAmenities; j++) {
                amenities.push(shuffledAmenities[j]);
            }

            rooms.push({
                roomNumber: `${100 + count}`,
                type,
                price,
                description: `A comfortable ${type.toLowerCase()} room at ${uni}. Perfect for students and visiting faculty.`,
                isAvailable: true,
                amenities,
                imageUrl: `/images/rooms/${type.toLowerCase()}-1.jpg`, // Use generated images
                university: uni,
                capacity: type === 'Single' ? 1 : type === 'Double' ? 2 : 4,
                approvalStatus: 'approved'
            });
            count++;
        }
    }
    return rooms;
};

const seedRooms = async () => {
    try {
        await connectDB();

        console.log('Clearing existing rooms...');
        await Room.deleteMany({});

        console.log('Seeding new rooms...');
        const rooms = generateRooms();
        await Room.insertMany(rooms);

        console.log(`Successfully seeded ${rooms.length} rooms.`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding rooms:', error);
        process.exit(1);
    }
};

seedRooms();
