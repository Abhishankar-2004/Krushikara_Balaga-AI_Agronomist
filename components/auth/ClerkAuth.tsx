import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import AuthLoadingScreen from './AuthLoadingScreen';
import { useLanguage } from '../../LanguageContext';
import { DashboardIcon } from '../icons/DashboardIcon';
import ThemeToggle from './ThemeToggle';

type AuthView = 'landing' | 'sign-in' | 'sign-up';

const ClerkAuth: React.FC = () => {
  const [view, setView] = useState<AuthView>('landing');
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { translate } = useLanguage();

  // If user is already signed in, this component shouldn't render
  // but we add this check for safety
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // User is authenticated, the parent component should handle this
      console.log('User is authenticated:', user.emailAddresses[0]?.emailAddress);
    }
  }, [isLoaded, isSignedIn, user]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return <AuthLoadingScreen message="Preparing authentication..." />;
  }

  // Handle different authentication views
  if (view === 'sign-in') {
    return <SignInPage />;
  }

  if (view === 'sign-up') {
    return <SignUpPage />;
  }

  // Landing page view
  const imageUrl = "https://c1.staticflickr.com/9/8179/8048336405_9059b193d2_b.jpg";

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center flex flex-col justify-center items-center text-white relative"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="relative z-10 text-center p-4 max-w-3xl flex flex-col items-center card-enter">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/80 rounded-2xl mb-6 border-2 border-white/20 shadow-lg">
          <DashboardIcon className="w-9 h-9 sm:w-12 sm:h-12 text-white"/>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>
          {translate('landingTitle')}
        </h1>
        <p className="text-lg md:text-xl text-slate-200 mb-10" style={{textShadow: '0 1px 4px rgba(0,0,0,0.7)'}}>
          {translate('landingSubtitle')}
        </p>
        
        {/* Authentication Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setView('sign-in')}
            className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-200"
          >
            {translate('loginButton') || 'Sign In'}
          </button>
          <button
            onClick={() => setView('sign-up')}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border-2 border-white/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-200"
          >
            {translate('signupButton') || 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClerkAuth;