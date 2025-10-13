import React from 'react';
import { useTheme, Theme } from '../../ThemeContext';
import { SunIcon } from '../icons/SunIcon';
import { MoonIcon } from '../icons/MoonIcon';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        border-2 border-slate-200 dark:border-slate-700 
        bg-white dark:bg-slate-800 
        text-slate-600 dark:text-slate-300 
        hover:bg-slate-50 dark:hover:bg-slate-700 
        hover:border-slate-300 dark:hover:border-slate-600
        transition-all duration-200 
        flex items-center justify-center
        shadow-sm hover:shadow-md
        ${className}
      `}
      aria-label={theme === Theme.LIGHT ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === Theme.LIGHT ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === Theme.LIGHT ? (
        <MoonIcon className={`${iconSizes[size]} transition-transform duration-200 hover:scale-110`} />
      ) : (
        <SunIcon className={`${iconSizes[size]} transition-transform duration-200 hover:scale-110`} />
      )}
    </button>
  );
};

export default ThemeToggle;