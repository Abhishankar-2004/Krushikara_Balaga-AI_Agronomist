import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { useTheme } from '../../ThemeContext';
import { ClerkLocalizationService } from '../../services/clerkLocalizationService';

/**
 * Test component to verify Clerk localization is working correctly
 * This component displays various localized strings to help debug localization issues
 */
const LocalizationTest: React.FC = () => {
  const { language, translate } = useLanguage();
  const { theme } = useTheme();
  
  const localization = ClerkLocalizationService.getCompleteLocalization(language);
  const socialProviders = ClerkLocalizationService.getSocialProviderLabels(language);
  const statusMessages = ClerkLocalizationService.getStatusMessages(language);
  const helpText = ClerkLocalizationService.getHelpText(language);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Clerk Localization Test - {language.toUpperCase()} / {theme.toUpperCase()}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Translations */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 text-lg">Basic Auth Translations</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Sign In Title:</strong> {translate('clerkSignInTitle')}</p>
            <p><strong>Sign Up Title:</strong> {translate('clerkSignUpTitle')}</p>
            <p><strong>Email Label:</strong> {translate('clerkEmailLabel')}</p>
            <p><strong>Password Label:</strong> {translate('clerkPasswordLabel')}</p>
            <p><strong>Continue:</strong> {translate('clerkContinue')}</p>
            <p><strong>Or Continue With:</strong> {translate('clerkOrContinueWith')}</p>
          </div>
        </div>

        {/* Social Provider Labels */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 text-lg">Social Provider Labels</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Google:</strong> {socialProviders.google}</p>
            <p><strong>GitHub:</strong> {socialProviders.github}</p>
            <p><strong>Facebook:</strong> {socialProviders.facebook}</p>
            <p><strong>Twitter:</strong> {socialProviders.twitter}</p>
          </div>
        </div>

        {/* Status Messages */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 text-lg">Status Messages</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Loading:</strong> {statusMessages.loading}</p>
            <p><strong>Verifying:</strong> {statusMessages.verifying}</p>
            <p><strong>Signing In:</strong> {statusMessages.signingIn}</p>
            <p><strong>Success:</strong> {statusMessages.success}</p>
            <p><strong>Email Sent:</strong> {statusMessages.emailSent}</p>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 text-lg">Help Text</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Need Help:</strong> {helpText.needHelp}</p>
            <p><strong>Contact Support:</strong> {helpText.contactSupport}</p>
            <p><strong>Trouble Signing:</strong> {helpText.troubleSigning}</p>
            <p><strong>Check Email:</strong> {helpText.checkEmail}</p>
            <p><strong>Didn't Receive Code:</strong> {helpText.didntReceiveCode}</p>
          </div>
        </div>

        {/* Error Messages */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibent mb-3 text-lg">Error Messages</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Invalid Email:</strong> {translate('clerkInvalidEmail')}</p>
            <p><strong>Password Too Short:</strong> {translate('clerkPasswordTooShort')}</p>
            <p><strong>Sign In Error:</strong> {translate('clerkSignInError')}</p>
            <p><strong>Network Error:</strong> {translate('clerkNetworkError')}</p>
            <p><strong>Generic Error:</strong> {translate('clerkGenericError')}</p>
          </div>
        </div>

        {/* Verification Flow */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold mb-3 text-lg">Verification Flow</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Verify Email:</strong> {translate('clerkVerifyEmail')}</p>
            <p><strong>Verify Description:</strong> {translate('clerkVerifyEmailDescription')}</p>
            <p><strong>Enter Code:</strong> {translate('clerkEnterCode')}</p>
            <p><strong>Resend Code:</strong> {translate('clerkResendCode')}</p>
            <p><strong>Go Back:</strong> {translate('clerkGoBack')}</p>
          </div>
        </div>
      </div>

      {/* Raw Localization Object Preview */}
      <div className="mt-8 bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">Raw Localization Object (First 10 keys)</h3>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(
            Object.fromEntries(Object.entries(localization).slice(0, 10)), 
            null, 
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default LocalizationTest;