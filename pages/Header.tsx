import React from 'react';
import { Shield, Search, Heart, Home } from 'lucide-react';

type Role = 'ADMIN' | 'WARDEN' | 'STUDENT';

const Role = {
  ADMIN: 'ADMIN' as Role,
  WARDEN: 'WARDEN' as Role,
  STUDENT: 'STUDENT' as Role
};

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type HeaderProps = {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

const Header = ({ user, onNavigate, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white border-b-2 border-gray-100 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="bg-gradient-to-r from-blue-900 to-blue-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">UniLodge</span>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Find your ideal campus room..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          {/* Right Actions (with Auth Logic) */}
          <div className="flex items-center space-x-5">
            {user ? (
              // AUTHENTICATED STATE
              <>
                 <a 
                   href="#" 
                   onClick={(e) => { 
                     e.preventDefault(); 
                     onNavigate(user.role === Role.ADMIN ? 'admin-dashboard' : user.role === Role.WARDEN ? 'warden-dashboard' : 'guest-dashboard'); 
                   }} 
                   className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
                 >
                   Dashboard
                 </a>
                 <a 
                   href="#" 
                   onClick={(e) => { 
                     e.preventDefault(); 
                     onNavigate('my-bookings'); 
                   }} 
                   className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
                 >
                   My Bookings
                 </a>
                 <span className="text-sm text-gray-500 hidden md:block">Hi, {user.name}</span>
                 <button 
                   onClick={onLogout} 
                   className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg"
                 >
                   Logout
                 </button>
              </>
            ) : (
              // LOGGED-OUT STATE
              <>
                <a href="#" className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
                  <Heart className="h-5 w-5 mr-1" />
                  Saved Rooms
                </a>
                <a href="#" className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
                  <Home className="h-5 w-5 mr-1" />
                  Homes
                </a>
                <button 
                  onClick={() => onNavigate('login')} 
                  className="px-6 py-2 bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-lg hover:from-blue-800 hover:to-blue-500 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  List a Room
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;