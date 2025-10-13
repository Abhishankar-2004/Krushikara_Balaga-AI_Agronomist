import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { MigrationService } from '../services/migrationService';

/**
 * Hook for managing user migration from legacy authentication system
 */
export const useMigration = () => {
  const { user, isLoaded } = useUser();
  const [migrationStatus, setMigrationStatus] = useState<{
    isRequired: boolean;
    isInProgress: boolean;
    isComplete: boolean;
    error: string | null;
  }>({
    isRequired: false,
    isInProgress: false,
    isComplete: false,
    error: null,
  });

  // Check if migration is needed when user loads
  useEffect(() => {
    if (isLoaded && user) {
      const email = user.emailAddresses[0]?.emailAddress;
      if (email) {
        const hasLegacyData = MigrationService.getLegacyUserByEmail(email);
        const isAlreadyMigrated = MigrationService.isUserMigrated(email);
        
        setMigrationStatus(prev => ({
          ...prev,
          isRequired: !!(hasLegacyData && !isAlreadyMigrated),
          isComplete: isAlreadyMigrated,
        }));

        // Auto-migrate if needed
        if (hasLegacyData && !isAlreadyMigrated) {
          performAutoMigration();
        }
      }
    }
  }, [user, isLoaded]);

  /**
   * Perform automatic migration
   */
  const performAutoMigration = useCallback(async () => {
    if (!user) return;

    setMigrationStatus(prev => ({ ...prev, isInProgress: true, error: null }));

    try {
      await MigrationService.autoMigrateUser(user);
      setMigrationStatus(prev => ({
        ...prev,
        isInProgress: false,
        isComplete: true,
        isRequired: false,
      }));
    } catch (error) {
      setMigrationStatus(prev => ({
        ...prev,
        isInProgress: false,
        error: error instanceof Error ? error.message : 'Migration failed',
      }));
    }
  }, [user]);

  /**
   * Manually trigger migration
   */
  const triggerMigration = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    setMigrationStatus(prev => ({ ...prev, isInProgress: true, error: null }));

    try {
      const success = await MigrationService.migrateUserProfile(user);
      setMigrationStatus(prev => ({
        ...prev,
        isInProgress: false,
        isComplete: success,
        isRequired: !success,
        error: success ? null : 'Migration failed',
      }));
      return success;
    } catch (error) {
      setMigrationStatus(prev => ({
        ...prev,
        isInProgress: false,
        error: error instanceof Error ? error.message : 'Migration failed',
      }));
      return false;
    }
  }, [user]);

  /**
   * Get migration statistics
   */
  const getMigrationStats = useCallback(() => {
    return MigrationService.getMigrationStats();
  }, []);

  /**
   * Check if there are any legacy users in the system
   */
  const hasLegacyUsers = useCallback(() => {
    return MigrationService.hasLegacyUsers();
  }, []);

  /**
   * Clear migration error
   */
  const clearError = useCallback(() => {
    setMigrationStatus(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Migration status
    migrationStatus,
    
    // Actions
    triggerMigration,
    clearError,
    
    // Utilities
    getMigrationStats,
    hasLegacyUsers,
    
    // Computed values
    needsMigration: migrationStatus.isRequired,
    isMigrating: migrationStatus.isInProgress,
    migrationComplete: migrationStatus.isComplete,
    migrationError: migrationStatus.error,
  };
};

export default useMigration;