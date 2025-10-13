import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import ClerkHeader from './ClerkHeader';
import AppContent from './AppContent';
import ClerkAuth from './auth/ClerkAuth';

/**
 * Simplified App component demonstrating Clerk's prebuilt components
 * This shows the basic pattern of using SignedIn/SignedOut to control content visibility
 */
const SimpleApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header is always visible */}
      <ClerkHeader />
      
      {/* Content changes based on authentication state */}
      <main>
        {/* Show authentication page when user is signed out */}
        <SignedOut>
          <ClerkAuth />
        </SignedOut>

        {/* Show main app content when user is signed in */}
        <SignedIn>
          <AppContent />
        </SignedIn>
      </main>
    </div>
  );
};

export default SimpleApp;