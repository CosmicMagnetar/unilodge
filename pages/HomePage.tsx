import React, { useState } from 'react';
import { Card } from './ui.tsx';

// --- New sub-components for the new Homepage ---
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
// --- End new sub-components ---

export type HomePageProps = {}; // No longer needs rooms, loading, or onBook

export const HomePage: React.FC<HomePageProps> = () => {
    const [activeFilter, setActiveFilter] = useState('Single Room');
    const filters = ['Single Room', 'Furnished Options', 'Near Campus'];

    // Placeholder data for the new UI elements
    const featuredListings = [
        { imgSrc: 'https://images.unsplash.com/photo-1519974749348-7c56d680b18f?q=80&w=200&h=200&fit=crop', title: 'The Village', subtitle: 'Average Rent: $750/month' },
        { imgSrc: 'https://images.unsplash.com/photo-1540518614946-b68b68c04e28?q=80&w=200&h=200&fit=crop', title: 'Shared Apartments', subtitle: 'Average Rent: $500/month' },
        { imgSrc: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=200&h=200&fit=crop', title: 'Near Campus', subtitle: 'Average Rent: $1100/month' },
    ];
    
    const universityPartners = ['Harvard', 'MIT', 'Stanford', 'UCLA']; // Using text as logo placeholders

    return (
        <div className="bg-gray-50">
            {/* 1. Hero Section */}
            <div className="relative h-[450px] bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1560185893-a55d8800b6e2?q=80&w=1920&h=450&fit=crop" 
                    alt="University students" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60" 
                />
                <div className="relative z-10 h-full flex items-center justify-center">
                    <h1 className="text-5xl font-extrabold text-white text-center shadow-lg">
                        Unlock Your University Experience
                    </h1>
                </div>
            </div>

            {/* 2. Main Content Area */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Filter Buttons */}
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

                {/* Featured Listings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                    {featuredListings.map(item => (
                        <FeaturedCard key={item.title} {...item} />
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Student Testimonials */}
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Student Testimonials</h2>
                        <TestimonialCard 
                            quote="Found my perfect place in a week. The platform made it so easy to filter and find exactly what I needed near campus."
                            authorImg="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop"
                            authorName="Sarah J."
                        />
                    </div>

                    {/* Featured University Partners */}
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                         <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Featured University Partners</h2>
                        <div className="flex flex-wrap items-center justify-center gap-8">
                            {universityPartners.map(uni => (
                                <span key={uni} className="text-lg font-semibold text-gray-500 grayscale opacity-80">
                                    {uni}
                                </span>
                            ))}
                        </div>
                         <h2 className="text-2xl font-bold text-gray-800 my-8 text-center">More Partners</h2>
                        <div className="text-center">
                            <a href="#" className="text-blue-600 hover:underline">@stanfordbps</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Nav */}
                <div className="flex items-center justify-center space-x-8 mt-16 py-8 border-t border-gray-200">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">About Us</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Safety</a>
                    {/* Add social icons here if needed */}
                </div>
            </div>
        </div>
    );
};