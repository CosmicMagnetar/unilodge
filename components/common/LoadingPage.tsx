import React from 'react';
import { Shield } from 'lucide-react';

export const LoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 animate-gradient-shift">
      {/* Animated background pattern */}
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with pulse animation */}
        <div className="relative mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 blur-2xl animate-pulse-glow"></div>
          
          {/* Logo container */}
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl animate-float">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
        
        {/* Brand name */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white neon-glow animate-fade-in">
          UniLodge
        </h1>
        
        {/* Loading text with animated dots */}
        <div className="flex items-center space-x-2 text-white/80 text-lg">
          <span>Loading</span>
          <div className="flex space-x-1">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};
