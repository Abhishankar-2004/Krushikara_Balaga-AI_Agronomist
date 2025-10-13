import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { UserProfile } from '../types';
import { UserProfileService } from '../services/userProfileService';
import { MigrationService } from '../services/migrationService';

/**
 * Custom hook for managing user profile with Clerk integration
 */
export const useUserProfile = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize profile when user loads
  useEffect(() => {
    if (isLoaded && user) {
      const userProfile = UserProfileService.fromClerkUser(user);
      setProfile(userProfile);
      
      // Initialize profile metadata if needed
      UserProfileService.initializeProfile(user).catch(console.error);
      
      // Auto-migrate legacy data if available
      MigrationService.autoMigrateUser(user).catch(console.error);
    } else if (isLoaded && !user) {
      setProfile(null);
    }
  }, [user, isLoaded]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (newProfile: UserProfile): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await UserProfileService.updateClerkUser(user, newProfile);
      setProfile(newProfile);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  /**
   * Get profile completion status
   */
  const getProfileCompletion = useCallback(() => {
    if (!user) return { isComplete: false, percentage: 0 };
    
    return {
      isComplete: UserProfileService.isProfileComplete(user),
      percentage: UserProfileService.getProfileCompletionPercentage(user),
    };
  }, [user]);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback(async (preferences: {
    language?: string;
    theme?: string;
    notifications?: boolean;
  }): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await UserProfileService.updateUserPreferences(user, preferences);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  /**
   * Get user preferences
   */
  const getPreferences = useCallback(() => {
    if (!user) return { language: 'en', theme: 'light', notifications: true };
    return UserProfileService.getUserPreferences(user);
  }, [user]);

  /**
   * Clear any errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Profile data
    profile,
    user,
    isLoaded,
    
    // Profile operations
    updateProfile,
    getProfileCompletion,
    
    // Preferences
    updatePreferences,
    getPreferences,
    
    // State
    isUpdating,
    error,
    clearError,
    
    // Computed values
    isProfileComplete: user ? UserProfileService.isProfileComplete(user) : false,
    profileCompletionPercentage: user ? UserProfileService.getProfileCompletionPercentage(user) : 0,
  };
};

export default useUserProfile;