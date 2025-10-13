import React from 'react';
import { useUser } from '@clerk/clerk-react';


/**
 * User Management Integration Component
 * Provides links and information for accessing Clerk's user management features
 */
const UserManagement: React.FC = () => {
  const { user } = useUser();


  const clerkDashboardUrl = 'https://dashboard.clerk.com/';
  const userManagementUrl = `${clerkDashboardUrl}last-active?path=user-management`;
  const analyticsUrl = `${clerkDashboardUrl}last-active?path=analytics`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        👥 User Management Integration
      </h2>

      {/* Current User Info */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-semibold mb-4 text-lg">Current User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
            <p className="font-medium">{user?.emailAddresses?.[0]?.emailAddress || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Name</p>
            <p className="font-medium">{user?.fullName || user?.firstName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">User ID</p>
            <p className="font-medium font-mono text-xs">{user?.id || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Created</p>
            <p className="font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Clerk Dashboard Access */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-semibold mb-4 text-lg">🎛️ Clerk Dashboard Access</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Access comprehensive user management features through the Clerk dashboard:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={userManagementUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="text-2xl mr-3">👥</div>
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-200">User Management</p>
              <p className="text-sm text-blue-600 dark:text-blue-300">View and manage all users</p>
            </div>
          </a>

          <a
            href={analyticsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <div className="text-2xl mr-3">📊</div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">Analytics</p>
              <p className="text-sm text-green-600 dark:text-green-300">User activity and metrics</p>
            </div>
          </a>
        </div>
      </div>

      {/* User Support Features */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-semibold mb-4 text-lg">🛠️ User Support Features</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="text-xl mr-3">🔐</div>
            <div>
              <p className="font-medium">Password Reset</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Users can reset passwords through Clerk's built-in flow
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="text-xl mr-3">📧</div>
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automatic email verification for new accounts
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="text-xl mr-3">🚫</div>
            <div>
              <p className="font-medium">Account Suspension</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Suspend or ban users through the Clerk dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="text-xl mr-3">📱</div>
            <div>
              <p className="font-medium">Multi-Factor Authentication</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Optional 2FA for enhanced security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Metadata Management */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold mb-4 text-lg">📋 User Metadata</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Agricultural-specific user data stored in Clerk metadata:
        </p>
        
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(user?.publicMetadata || {}, null, 2)}
          </pre>
        </div>
        
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          <p><strong>Public Metadata:</strong> Visible to the user and can be used in the frontend</p>
          <p><strong>Private Metadata:</strong> Only accessible on the backend for sensitive data</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <h4 className="font-semibold mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <a
            href={clerkDashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Clerk Dashboard
          </a>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Refresh User Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;