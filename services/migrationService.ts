import { UserProfileService } from './userProfileService';
import type { UserResource } from '@clerk/types';
import { UserProfile } from '../types';

/**
 * Service for migrating users from the old authentication system to Clerk
 */
export class MigrationService {
  private static readonly LEGACY_USERS_KEY = 'kisan_users';
  private static readonly MIGRATION_STATUS_KEY = 'clerk_migration_status';
  private static readonly MIGRATED_USERS_KEY = 'migrated_users';

  /**
   * Check if there are legacy users that need migration
   */
  static hasLegacyUsers(): boolean {
    try {
      const legacyUsers = localStorage.getItem(this.LEGACY_USERS_KEY);
      return !!(legacyUsers && JSON.parse(legacyUsers).length > 0);
    } catch {
      return false;
    }
  }

  /**
   * Get legacy user data by email
   */
  static getLegacyUserByEmail(email: string): any | null {
    try {
      const legacyUsers = localStorage.getItem(this.LEGACY_USERS_KEY);
      if (!legacyUsers) return null;

      const users = JSON.parse(legacyUsers);
      return users.find((user: any) => 
        user.email?.toLowerCase() === email.toLowerCase()
      ) || null;
    } catch {
      return null;
    }
  }

  /**
   * Get all legacy users
   */
  static getAllLegacyUsers(): any[] {
    try {
      const legacyUsers = localStorage.getItem(this.LEGACY_USERS_KEY);
      return legacyUsers ? JSON.parse(legacyUsers) : [];
    } catch {
      return [];
    }
  }

  /**
   * Check if a user has already been migrated
   */
  static isUserMigrated(email: string): boolean {
    try {
      const migratedUsers = localStorage.getItem(this.MIGRATED_USERS_KEY);
      if (!migratedUsers) return false;

      const migrated = JSON.parse(migratedUsers);
      return migrated.includes(email.toLowerCase());
    } catch {
      return false;
    }
  }

  /**
   * Mark a user as migrated
   */
  static markUserAsMigrated(email: string): void {
    try {
      const migratedUsers = localStorage.getItem(this.MIGRATED_USERS_KEY);
      const migrated = migratedUsers ? JSON.parse(migratedUsers) : [];
      
      const emailLower = email.toLowerCase();
      if (!migrated.includes(emailLower)) {
        migrated.push(emailLower);
        localStorage.setItem(this.MIGRATED_USERS_KEY, JSON.stringify(migrated));
      }
    } catch (error) {
      console.error('Error marking user as migrated:', error);
    }
  }

  /**
   * Migrate a user's profile data to Clerk
   */
  static async migrateUserProfile(user: UserResource): Promise<boolean> {
    try {
      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) return false;

      // Check if already migrated
      if (this.isUserMigrated(email)) {
        return true;
      }

      // Get legacy user data
      const legacyUser = this.getLegacyUserByEmail(email);
      if (!legacyUser) {
        // No legacy data, just initialize profile
        await UserProfileService.initializeProfile(user);
        this.markUserAsMigrated(email);
        return true;
      }

      // Migrate the profile data
      const profileData: UserProfile = {
        name: legacyUser.name || user.fullName || 'User',
        email: email,
        location: legacyUser.location || '',
      };

      await UserProfileService.updateClerkUser(user, profileData);
      
      // Mark as migrated
      this.markUserAsMigrated(email);
      
      console.log(`Successfully migrated user: ${email}`);
      return true;
    } catch (error) {
      console.error('Error migrating user profile:', error);
      return false;
    }
  }

  /**
   * Get migration statistics
   */
  static getMigrationStats(): {
    totalLegacyUsers: number;
    migratedUsers: number;
    pendingMigration: number;
    migrationComplete: boolean;
  } {
    const legacyUsers = this.getAllLegacyUsers();
    const migratedUsers = (() => {
      try {
        const migrated = localStorage.getItem(this.MIGRATED_USERS_KEY);
        return migrated ? JSON.parse(migrated).length : 0;
      } catch {
        return 0;
      }
    })();

    return {
      totalLegacyUsers: legacyUsers.length,
      migratedUsers,
      pendingMigration: Math.max(0, legacyUsers.length - migratedUsers),
      migrationComplete: legacyUsers.length === 0 || migratedUsers >= legacyUsers.length,
    };
  }

  /**
   * Clean up legacy data after successful migration
   */
  static cleanupLegacyData(): void {
    try {
      const stats = this.getMigrationStats();
      if (stats.migrationComplete) {
        // Only clean up if all users have been migrated
        localStorage.removeItem(this.LEGACY_USERS_KEY);
        localStorage.setItem(this.MIGRATION_STATUS_KEY, JSON.stringify({
          completed: true,
          completedAt: new Date().toISOString(),
          totalMigrated: stats.migratedUsers,
        }));
        console.log('Legacy data cleanup completed');
      }
    } catch (error) {
      console.error('Error cleaning up legacy data:', error);
    }
  }

  /**
   * Get migration status
   */
  static getMigrationStatus(): {
    isComplete: boolean;
    completedAt?: string;
    totalMigrated?: number;
  } {
    try {
      const status = localStorage.getItem(this.MIGRATION_STATUS_KEY);
      return status ? JSON.parse(status) : { isComplete: false };
    } catch {
      return { isComplete: false };
    }
  }

  /**
   * Auto-migrate user on first login
   */
  static async autoMigrateUser(user: UserResource): Promise<void> {
    try {
      // Only attempt migration if there are legacy users
      if (!this.hasLegacyUsers()) return;

      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) return;

      // Check if this user needs migration
      const legacyUser = this.getLegacyUserByEmail(email);
      if (legacyUser && !this.isUserMigrated(email)) {
        console.log(`Auto-migrating user: ${email}`);
        await this.migrateUserProfile(user);
      }
    } catch (error) {
      console.error('Error in auto-migration:', error);
    }
  }

  /**
   * Bulk migrate all legacy users (for admin use)
   */
  static async bulkMigrateLegacyUsers(): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const legacyUsers = this.getAllLegacyUsers();
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const legacyUser of legacyUsers) {
      try {
        if (!legacyUser.email) {
          results.failed++;
          results.errors.push(`User missing email: ${JSON.stringify(legacyUser)}`);
          continue;
        }

        // This would require the user to be authenticated with Clerk first
        // So this is more of a data preparation function
        console.log(`Prepared migration data for: ${legacyUser.email}`);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to prepare ${legacyUser.email}: ${error}`);
      }
    }

    return results;
  }

  /**
   * Export legacy data for manual migration
   */
  static exportLegacyData(): string {
    const legacyUsers = this.getAllLegacyUsers();
    const migrationData = {
      exportedAt: new Date().toISOString(),
      totalUsers: legacyUsers.length,
      users: legacyUsers.map(user => ({
        email: user.email,
        name: user.name,
        location: user.location,
        // Don't export password data for security
      })),
    };

    return JSON.stringify(migrationData, null, 2);
  }
}

export default MigrationService;