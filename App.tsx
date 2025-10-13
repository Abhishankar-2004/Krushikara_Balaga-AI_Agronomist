import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import ClerkHeader from './components/ClerkHeader';
import AppContent from './components/AppContent';
import ClerkAuth from './components/auth/ClerkAuth';

/**
 * Main App component using Clerk's prebuilt components
 * Uses SignedIn/SignedOut to control content visibility
 */
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header with Clerk components - always visible */}
      <ClerkHeader />
      
      {/* Content changes based on authentication state */}
      <main>
        {/* Show authentication when user is signed out */}
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

export default App;