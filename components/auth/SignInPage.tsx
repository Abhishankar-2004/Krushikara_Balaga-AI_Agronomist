import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useLanguage } from '../../LanguageContext';
import { DashboardIcon } from '../icons/DashboardIcon';
import ThemedClerkComponent from './ThemedClerkComponent';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

const SignInPage: React.FC = () => {
  const { translate } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Theme and Language Toggles */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        {/* App Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 transition-transform hover:scale-105">
            <DashboardIcon className="w-9 h-9 text-white"/>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            {translate('headerTitle')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {translate('landingSubtitle')}
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="flex justify-center">
          <ThemedClerkComponent>
            <SignIn 
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
            />
          </ThemedClerkComponent>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;