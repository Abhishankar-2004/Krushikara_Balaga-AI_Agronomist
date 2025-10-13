import React, { useState } from 'react';
import { useMigration } from '../hooks/useMigration';
import { MigrationService } from '../services/migrationService';

import Card from './common/Card';
import Button from './common/Button';
import { CheckIcon } from './icons/CheckIcon';
import { InfoIcon } from './icons/InfoIcon';

const MigrationAdmin: React.FC = () => {
  const { getMigrationStats, hasLegacyUsers } = useMigration();

  const [exportData, setExportData] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  const stats = getMigrationStats();
  const migrationStatus = MigrationService.getMigrationStatus();

  const handleExportData = () => {
    const data = MigrationService.exportLegacyData();
    setExportData(data);
    setShowExport(true);
  };

  const handleCleanupLegacyData = () => {
    if (window.confirm('Are you sure you want to clean up legacy data? This cannot be undone.')) {
      MigrationService.cleanupLegacyData();
      window.location.reload(); // Refresh to show updated stats
    }
  };

  const downloadExportData = () => {
    if (!exportData) return;
    
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legacy-users-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!hasLegacyUsers() && migrationStatus.isComplete) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Migration Complete
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            All legacy users have been successfully migrated to Clerk.
          </p>
          {migrationStatus.completedAt && (
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Completed: {new Date(migrationStatus.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Migration Status
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Legacy user data migration overview
            </p>
          </div>
        </div>

        {/* Migration Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.totalLegacyUsers}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Legacy Users
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.migratedUsers}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Migrated
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pendingMigration}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Pending
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((stats.migratedUsers / Math.max(stats.totalLegacyUsers, 1)) * 100)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Migration Progress</span>
            <span>{stats.migratedUsers} of {stats.totalLegacyUsers}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.round((stats.migratedUsers / Math.max(stats.totalLegacyUsers, 1)) * 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExportData} className="!bg-blue-600 hover:!bg-blue-700">
            Export Legacy Data
          </Button>
          
          {stats.migrationComplete && (
            <Button 
              onClick={handleCleanupLegacyData}
              className="!bg-red-600 hover:!bg-red-700"
            >
              Cleanup Legacy Data
            </Button>
          )}
        </div>

        {/* Export Data Modal */}
        {showExport && exportData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Legacy Data Export
              </h3>
              
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
                <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {exportData}
                </pre>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={downloadExportData}>
                  Download JSON
                </Button>
                <Button 
                  onClick={() => setShowExport(false)}
                  className="!bg-slate-600 hover:!bg-slate-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Migration Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            How Migration Works
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Users are automatically migrated when they first sign in with Clerk</li>
            <li>• Profile data (name, location) is transferred to Clerk metadata</li>
            <li>• Legacy password data is not migrated for security</li>
            <li>• Users will need to set up their Clerk account (email verification, etc.)</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default MigrationAdmin;