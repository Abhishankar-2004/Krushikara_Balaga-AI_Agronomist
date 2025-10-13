import type { UserResource } from '@clerk/types';
import { UserProfile } from '../types';

/**
 * Service for managing user profile data with Clerk metadata
 */
export class UserProfileService {
  /**
   * Convert Clerk user to UserProfile format
   */
  static fromClerkUser(user: UserResource): UserProfile {
    return {
      name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      email: user.emailAddresses[0]?.emailAddress || '',
      location: (user.unsafeMetadata?.location as string) || '',
    };
  }

  /**
   * Update Clerk user with profile data
   */
  static async updateClerkUser(user: UserResource, profile: UserProfile): Promise<void> {
    try {
      // Update basic user info
      const nameParts = profile.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await user.update({
        firstName,
        lastName,
      });

      // Update metadata with agricultural-specific fields
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          location: profile.location,
          profileCompleted: true,
          lastUpdated: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  /**
   * Check if user profile is complete
   */
  static isProfileComplete(user: UserResource): boolean {
    const profile = this.fromClerkUser(user);
    const hasBasicInfo = !!(
      profile.name && 
      profile.name !== 'User' && 
      profile.email && 
      profile.location
    );
    
    return hasBasicInfo; // For now, only require basic info
  }

  /**
   * Get profile completion percentage
   */
  static getProfileCompletionPercentage(user: UserResource): number {
    const profile = this.fromClerkUser(user);
    let completed = 0;
    const total = 6; // name, email, location, email verification, farming type, experience

    // Basic fields (required)
    if (profile.name && profile.name !== 'User') completed++;
    if (profile.email) completed++;
    if (profile.location) completed++;
    if (user.emailAddresses[0]?.verification?.status === 'verified') completed++;
    
    // Agricultural fields (optional but contribute to completion)
    if (user.unsafeMetadata?.farmingType) completed++;
    if (user.unsafeMetadata?.experienceLevel) completed++;

    return Math.round((completed / total) * 100);
  }

  /**
   * Initialize user profile with default values if needed
   */
  static async initializeProfile(user: UserResource): Promise<void> {
    try {
      // Only initialize if metadata doesn't exist
      if (!user.unsafeMetadata?.profileInitialized) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            location: '',
            profileInitialized: true,
            createdAt: new Date().toISOString(),
          }
        });
      }
    } catch (error) {
      console.error('Error initializing user profile:', error);
    }
  }

  /**
   * Sync profile data from legacy storage (for migration)
   */
  static async syncFromLegacyData(user: UserResource, legacyData: any): Promise<void> {
    try {
      if (legacyData && typeof legacyData === 'object') {
        const profile: UserProfile = {
          name: legacyData.name || user.fullName || 'User',
          email: user.emailAddresses[0]?.emailAddress || '',
          location: legacyData.location || '',
        };

        await this.updateClerkUser(user, profile);
      }
    } catch (error) {
      console.error('Error syncing legacy data:', error);
    }
  }

  /**
   * Get user preferences from metadata
   */
  static getUserPreferences(user: UserResource): {
    language?: string;
    theme?: string;
    notifications?: boolean;
  } {
    return {
      language: user.unsafeMetadata?.language as string || 'en',
      theme: user.unsafeMetadata?.theme as string || 'light',
      notifications: user.unsafeMetadata?.notifications as boolean ?? true,
    };
  }

  /**
   * Update user preferences in metadata
   */
  static async updateUserPreferences(
    user: UserResource, 
    preferences: {
      language?: string;
      theme?: string;
      notifications?: boolean;
    }
  ): Promise<void> {
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          ...preferences,
          preferencesUpdated: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update preferences. Please try again.');
    }
  }
}

export default UserProfileService;