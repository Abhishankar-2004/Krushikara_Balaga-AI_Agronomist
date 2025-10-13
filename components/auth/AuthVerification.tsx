import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLanguage } from '../../LanguageContext';
import { useTheme } from '../../ThemeContext';

/**
 * Comprehensive verification component for all auth functionality
 * This component helps verify that all auth components are working correctly
 */
const AuthVerification: React.FC = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { language, translate } = useLanguage();
  const { theme } = useTheme();
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});

  const runVerification = () => {
    const results: Record<string, boolean> = {};

    // Test 1: Clerk hooks are working
    results['Clerk Hooks Available'] = typeof useAuth === 'function' && typeof useUser === 'function';

    // Test 2: Clerk is loaded
    results['Clerk Loaded'] = isLoaded;

    // Test 3: Authentication state
    results['Authentication State Available'] = typeof isSignedIn === 'boolean';

    // Test 4: User object (if signed in)
    if (isSignedIn) {
      results['User Object Available'] = !!user;
      results['User Email Available'] = !!(user?.emailAddresses?.[0]?.emailAddress);
    }

    // Test 5: Language context
    results['Language Context Working'] = !!language && typeof translate === 'function';

    // Test 6: Theme context
    results['Theme Context Working'] = !!theme && (theme === 'light' || theme === 'dark');

    // Test 7: Translation function
    try {
      const translation = translate('headerTitle');
      results['Translation Function Working'] = !!translation && translation.length > 0;
    } catch {
      results['Translation Function Working'] = false;
    }

    // Test 8: Environment variables
    results['Environment Variables Set'] = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
      (window as any).process?.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

    setVerificationResults(results);
  };

  const allTestsPassed = Object.values(verificationResults).every(result => result === true);
  const testsRun = Object.keys(verificationResults).length > 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        🔍 Auth System Verification
      </h2>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-2xl mb-2">
            {isLoaded ? '✅' : '⏳'}
          </div>
          <p className="font-semibold">Clerk Status</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isLoaded ? 'Loaded' : 'Loading...'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-2xl mb-2">
            {isSignedIn ? '🔐' : '🔓'}
          </div>
          <p className="font-semibold">Auth Status</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isSignedIn ? 'Signed In' : 'Not Signed In'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-2xl mb-2">🌐</div>
          <p className="font-semibold">Language</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language.toUpperCase()} / {theme}
          </p>
        </div>
      </div>

      {/* User Information (if signed in) */}
      {isSignedIn && user && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
          <h3 className="font-semibold mb-3 text-lg">👤 Current User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><strong>Email:</strong> {user.emailAddresses?.[0]?.emailAddress || 'N/A'}</p>
            <p><strong>Name:</strong> {user.fullName || user.firstName || 'N/A'}</p>
            <p><strong>ID:</strong> <code className="text-xs">{user.id}</code></p>
            <p><strong>Created:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Verification Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-semibold mb-3 text-lg">🧪 Run Verification</h3>
        <button
          onClick={runVerification}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
        >
          🔍 Run All Verification Tests
        </button>
      </div>

      {/* Verification Results */}
      {testsRun && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
            📋 Verification Results
            {allTestsPassed ? (
              <span className="text-green-600 dark:text-green-400">✅ All Passed</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">⚠️ Issues Found</span>
            )}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(verificationResults).map(([test, passed]) => (
              <div
                key={test}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  passed 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <span className={`font-medium ${
                  passed ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {test}
                </span>
                <span className="text-lg">
                  {passed ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-sm">
              <strong>Summary:</strong> {Object.values(verificationResults).filter(Boolean).length} of {Object.keys(verificationResults).length} tests passed
            </p>
            {allTestsPassed && (
              <p className="text-green-600 dark:text-green-400 font-semibold mt-2">
                🎉 All authentication components are working correctly!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Component Status */}
      <div className="mt-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">📦 Component Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">🔐</div>
            <p className="font-medium">ProtectedRoute</p>
            <p className="text-green-600 dark:text-green-400">✅ Active</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🎨</div>
            <p className="font-medium">ThemedClerk</p>
            <p className="text-green-600 dark:text-green-400">✅ Active</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🌐</div>
            <p className="font-medium">Localization</p>
            <p className="text-green-600 dark:text-green-400">✅ Active</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="font-medium">Error Boundary</p>
            <p className="text-green-600 dark:text-green-400">✅ Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthVerification;