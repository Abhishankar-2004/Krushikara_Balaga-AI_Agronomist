import React, { useState } from 'react';
import { useLanguage } from '../../LanguageContext';
import { Language } from '../../types';
import { LanguageIcon } from '../icons/LanguageIcon';

interface LanguageToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { language, setLanguage, translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

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

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        aria-label={translate('language')}
        title={translate('language')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <LanguageIcon className={`${iconSizes[size]} transition-transform duration-200 hover:scale-110`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg z-20 border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => handleLanguageChange(Language.EN)}
              className={`
                w-full text-left px-4 py-3 text-sm transition-colors
                ${language === Language.EN 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
              `}
            >
              {translate('english')}
            </button>
            <button
              onClick={() => handleLanguageChange(Language.KN)}
              className={`
                w-full text-left px-4 py-3 text-sm transition-colors
                ${language === Language.KN 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
              `}
            >
              {translate('kannada')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageToggle;