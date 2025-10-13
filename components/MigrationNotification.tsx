import React from 'react';
import { useMigration } from '../hooks/useMigration';

import { CheckIcon } from './icons/CheckIcon';
import { InfoIcon } from './icons/InfoIcon';
import Spinner from './common/Spinner';

interface MigrationNotificationProps {
  className?: string;
}

const MigrationNotification: React.FC<MigrationNotificationProps> = ({ 
  className = '' 
}) => {
  const { 
    needsMigration, 
    isMigrating, 
    migrationComplete, 
    migrationError,
    triggerMigration,
    clearError 
  } = useMigration();


  // Don't show if no migration is needed or already complete
  if (!needsMigration && !isMigrating && !migrationError) {
    return null;
  }

  // Show success message briefly after migration
  if (migrationComplete && !needsMigration) {
    return (
      <div className={`bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
              Migration Complete!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your profile data has been successfully migrated to the new system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            {isMigrating ? (
              <Spinner size="sm" color="border-white" />
            ) : (
              <InfoIcon className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
            {isMigrating ? 'Migrating Your Data...' : 'Profile Migration Available'}
          </h3>
          
          {isMigrating ? (
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We're transferring your profile data to the new secure system. This will only take a moment.
            </p>
          ) : (
            <>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                We found your existing profile data. Would you like to migrate it to the new secure system?
              </p>
              
              {migrationError && (
                <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {migrationError}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={triggerMigration}
                  disabled={isMigrating}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Migrate Now
                </button>
                
                {migrationError && (
                  <button
                    onClick={clearError}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MigrationNotification;