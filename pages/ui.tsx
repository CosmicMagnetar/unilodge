import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }> = ({ className, variant = 'primary', ...props }) => {
  const baseClasses = "px-6 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-sm";
  const variantClasses = {
    // These colors are from the OLD theme. The new image has different styles.
    // 'primary' in the image is a dark blue, 'secondary' is a light border.
    primary: 'text-dark-text bg-accent hover:bg-accent-hover focus:ring-accent', // Old style
    secondary: 'text-light-text bg-transparent hover:bg-white/10 focus:ring-white border border-white/50', // Old style
  };
  // Let's create NEW styles for the header button to match the image
  if (className?.includes('header-primary')) {
    return <button className={`px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 ${className}`} {...props} />
  }
  if (className?.includes('header-secondary')) {
     return <button className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 ${className}`} {...props} />
  }
  
  return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={`block w-full px-4 py-3 bg-white border border-subtle-border placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm text-dark-text transition-shadow ${className}`}
    {...props}
  />
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className }) => (
    <div className={`bg-white border border-subtle-border overflow-hidden ${className}`}>{children}</div>
);