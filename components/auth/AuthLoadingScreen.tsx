import React from 'react';
import { DashboardIcon } from '../icons/DashboardIcon';
import { useLanguage } from '../../LanguageContext';

interface AuthLoadingScreenProps {
  message?: string;
  showProgress?: boolean;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ 
  message,
  showProgress = false 
}) => {
  const { translate } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center p-8 max-w-md">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4 animate-pulse shadow-lg">
            <DashboardIcon className="w-12 h-12 text-white"/>
          </div>
          
          {/* Rotating ring around logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-2xl font-bold text-primary mb-2">
          {translate('headerTitle')}
        </h1>

        {/* Loading Message */}
        <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
          {message || 'Initializing...'}
        </p>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        )}

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Subtle hint */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-8">
          {translate('footerSlogan')}
        </p>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;