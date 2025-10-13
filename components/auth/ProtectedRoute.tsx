import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import ClerkAuth from './ClerkAuth';
import AuthErrorBoundary from './AuthErrorBoundary';
import AuthLoadingScreen from './AuthLoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <AuthErrorBoundary>
      {/* Show loading screen while Clerk is initializing */}
      {!isLoaded && (
        fallback || <AuthLoadingScreen message="Loading authentication..." showProgress={true} />
      )}

      {/* Show authentication if user is not signed in */}
      {isLoaded && (!isSignedIn || !user) && <ClerkAuth />}

      {/* User is authenticated, render the protected content */}
      {isLoaded && isSignedIn && user && <>{children}</>}
    </AuthErrorBoundary>
  );
};

export default ProtectedRoute;