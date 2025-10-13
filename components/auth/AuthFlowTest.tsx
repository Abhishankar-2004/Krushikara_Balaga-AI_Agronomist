import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLanguage } from '../../LanguageContext';
import { useTheme } from '../../ThemeContext';
import { Language } from '../../types';
import { ClerkLocalizationService } from '../../services/clerkLocalizationService';

/**
 * Comprehensive test component for Clerk authentication integration
 * This component helps verify all authentication features are working correctly
 */
const AuthFlowTest: React.FC = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { language, setLanguage, translate } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const runTests = () => {
    const results: Record<string, boolean> = {};

    // Test 1: Clerk is loaded
    results['Clerk Loaded'] = isLoaded;

    // Test 2: User authentication state
    results['User Signed In'] = isSignedIn;

    // Test 3: User object exists
    results['User Object Available'] = !!user;

    // Test 4: User has email
    results['User Email Available'] = !!(user?.emailAddresses?.[0]?.emailAddress);

    // Test 5: Localization service works
    try {
      const localization = ClerkLocalizationService.getCompleteLocalization(language);
      results['Localization Service'] = !!localization && typeof localization === 'object';
    } catch {
      results['Localization Service'] = false;
    }

    // Test 6: Theme integration
    results['Theme Integration'] = theme === 'light' || theme === 'dark';

    // Test 7: Language switching
    results['Language Support'] = language === Language.EN || language === Language.KN;

    // Test 8: Translation function
    try {
      const translation = translate('headerTitle');
      results['Translation Function'] = !!translation && translation.length > 0;
    } catch {
      results['Translation Function'] = false;
    }

    // Test 9: User metadata (if available)
    results['User Metadata'] = !!(user?.publicMetadata);

    setTestResults(results);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setTestResults(prev => ({ ...prev, 'Logout Function': true }));
    } catch {
      setTestResults(prev => ({ ...prev, 'Logout Function': false }));
    }
  };

  const testLanguageSwitch = () => {
    const newLang = language === Language.EN ? Language.KN : Language.EN;
    setLanguage(newLang);
    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        'Language Switch': translate('headerTitle') !== 'Krushikara Balaga' || language === Language.KN
      }));
    }, 100);
  };

  const testThemeSwitch = () => {
    const currentTheme = theme;
    toggleTheme();
    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        'Theme Switch': theme !== currentTheme
      }));
    }, 100);
  };

  if (!isLoaded) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            ⏳ Waiting for Clerk to load...
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200">
            🔐 Please sign in to run authentication tests
          </p>
        </div>
      </div>
    );
  }

  const allTestsPassed = Object.values(testResults).every(result => result === true);
  const testsRun = Object.keys(testResults).length > 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        🧪 Clerk Authentication Test Suite
      </h2>

      {/* User Info */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-semibold mb-3 text-lg">Current User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'N/A'}</p>
          <p><strong>Name:</strong> {user?.fullName || user?.firstName || 'N/A'}</p>
          <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          <p><strong>Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Language:</strong> {language.toUpperCase()}</p>
          <p><strong>Theme:</strong> {theme}</p>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-semibold mb-3 text-lg">Test Controls</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={runTests}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            🔍 Run All Tests
          </button>
          <button
            onClick={testLanguageSwitch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🌐 Test Language Switch
          </button>
          <button
            onClick={testThemeSwitch}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🎨 Test Theme Switch
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🚪 Test Logout
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testsRun && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 text-lg">
            Test Results {allTestsPassed ? '✅' : '⚠️'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(testResults).map(([test, passed]) => (
              <div
                key={test}
                className={`flex items-center justify-between p-3 rounded-lg ${passed
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}
              >
                <span className={`font-medium ${passed ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                  {test}
                </span>
                <span className="text-lg">
                  {passed ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>

          {allTestsPassed && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                🎉 All tests passed! Clerk authentication is working correctly.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Integration Status */}
      <div className="mt-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">🔐</div>
            <p className="font-medium">Authentication</p>
            <p className="text-slate-600 dark:text-slate-400">
              {isSignedIn ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🌐</div>
            <p className="font-medium">Localization</p>
            <p className="text-slate-600 dark:text-slate-400">
              {language === Language.EN ? 'English' : 'Kannada'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎨</div>
            <p className="font-medium">Theme</p>
            <p className="text-slate-600 dark:text-slate-400">
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFlowTest;