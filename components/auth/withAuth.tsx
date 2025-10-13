import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import ClerkAuth from './ClerkAuth';
import { DashboardIcon } from '../icons/DashboardIcon';
import Spinner from '../common/Spinner';

/**
 * Higher-order component that wraps a component with authentication protection
 * @param WrappedComponent - The component to protect
 * @param options - Configuration options
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    requireEmailVerification?: boolean;
  }
) {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    // Show loading while Clerk is initializing
    if (!isLoaded) {
      return options?.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 animate-pulse">
              <DashboardIcon className="w-9 h-9 text-white"/>
            </div>
            <Spinner />
            <p className="text-slate-600 dark:text-slate-400 mt-4 font-medium">
              Loading...
            </p>
          </div>
        </div>
      );
    }

    // Check authentication
    if (!isSignedIn || !user) {
      return <ClerkAuth />;
    }

    // Check email verification if required
    if (options?.requireEmailVerification && user.emailAddresses[0]?.verification?.status !== 'verified') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4">
              <DashboardIcon className="w-9 h-9 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Email Verification Required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please verify your email address to access this feature. Check your inbox for a verification email.
            </p>
            <button
              onClick={() => user.emailAddresses[0]?.prepareVerification({ strategy: 'email_code' })}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
            >
              Resend Verification Email
            </button>
          </div>
        </div>
      );
    }

    // User is authenticated and verified, render the component
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

export default withAuth;