
import React from 'react';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  className = '', 
  size = 'md',
  color = 'border-white'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8'
  };

  return (
    <div 
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${color} ${className}`}
    />
  );
};

export default Spinner;
