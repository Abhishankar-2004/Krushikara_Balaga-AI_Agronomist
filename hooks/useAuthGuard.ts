import { useAuth, useUser } from '@clerk/clerk-react';
import { UserProfile } from '../types';

export interface AuthGuardState {
  isLoaded: boolean;
  isSignedIn: boolean;
  isAuthenticated: boolean;
  user: any;
  userProfile: UserProfile | null;
  isEmailVerified: boolean;
  hasRequiredProfile: boolean;
}

export interface AuthGuardOptions {
  requireEmailVerification?: boolean;
  requireProfileCompletion?: boolean;
  requiredFields?: (keyof UserProfile)[];
}

/**
 * Custom hook for authentication guards and user state management
 */
export const useAuthGuard = (options: AuthGuardOptions = {}): AuthGuardState => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Create user profile from Clerk data
  const userProfile: UserProfile | null = user ? {
    name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
    email: user.emailAddresses[0]?.emailAddress || '',
    location: (user.unsafeMetadata?.location as string) || '',
  } : null;

  // Check email verification status
  const isEmailVerified = user?.emailAddresses[0]?.verification?.status === 'verified';

  // Check if required profile fields are completed
  const hasRequiredProfile = (() => {
    if (!userProfile || !options.requiredFields) return true;
    
    return options.requiredFields.every(field => {
      const value = userProfile[field];
      return value !== undefined && value !== null && value !== '';
    });
  })();

  // Overall authentication status
  const isAuthenticated = isLoaded && isSignedIn && !!user &&
    (!options.requireEmailVerification || isEmailVerified) &&
    (!options.requireProfileCompletion || hasRequiredProfile);

  return {
    isLoaded,
    isSignedIn: isSignedIn || false,
    isAuthenticated,
    user,
    userProfile,
    isEmailVerified,
    hasRequiredProfile,
  };
};

/**
 * Hook for getting user permissions and roles
 */
export const useUserPermissions = () => {
  const { user } = useUser();

  const hasRole = (role: string): boolean => {
    const roles = user?.publicMetadata?.roles as string[] | undefined;
    return roles?.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    const permissions = user?.publicMetadata?.permissions as string[] | undefined;
    return permissions?.includes(permission) || false;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin') || hasRole('administrator');
  };

  const isModerator = (): boolean => {
    return hasRole('moderator') || isAdmin();
  };

  return {
    hasRole,
    hasPermission,
    isAdmin,
    isModerator,
    roles: (user?.publicMetadata?.roles as string[]) || [],
    permissions: (user?.publicMetadata?.permissions as string[]) || [],
  };
};

export default useAuthGuard;