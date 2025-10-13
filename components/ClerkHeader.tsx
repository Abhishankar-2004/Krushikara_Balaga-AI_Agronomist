import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { DashboardIcon } from './icons/DashboardIcon';
import ThemeToggle from './auth/ThemeToggle';
import LanguageToggle from './auth/LanguageToggle';

/**
 * Header component using Clerk's prebuilt components
 * Demonstrates the basic usage of SignedIn, SignedOut, SignInButton, and UserButton
 */
const ClerkHeader: React.FC = () => {
  const { translate } = useLanguage();

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* App Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <DashboardIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-primary">
              {translate('headerTitle')}
            </h1>
          </div>

          {/* Navigation and Auth Controls */}
          <div className="flex items-center gap-4">
            {/* Theme and Language Controls */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {/* Clerk Authentication Components */}
            <div className="flex items-center gap-3">
              {/* Show Sign In button when user is signed out */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                    {translate('loginButton') || 'Sign In'}
                  </button>
                </SignInButton>
              </SignedOut>

              {/* Show User Button when user is signed in */}
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full border-2 border-primary/20 hover:border-primary/40 transition-colors",
                      userButtonPopoverCard: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl",
                      userButtonPopoverActionButton: "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg",
                      userButtonPopoverActionButtonText: "text-sm font-medium",
                      userButtonPopoverFooter: "hidden" // Hide the footer if you want
                    }
                  }}
                  userProfileMode="modal"
                  afterSignOutUrl="/"
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClerkHeader;