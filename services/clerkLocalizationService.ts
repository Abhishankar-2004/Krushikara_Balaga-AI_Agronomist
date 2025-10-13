import { Language } from '../types';
import { translations } from '../translations';

/**
 * Service for providing localized text to Clerk components
 */
export class ClerkLocalizationService {
  /**
   * Get Clerk localization configuration for a specific language
   */
  static getClerkLocalization(language: Language) {
    const t = translations[language];
    
    return {
      // Sign In page
      signIn: {
        start: {
          title: t.clerkSignInTitle,
          subtitle: '',
          actionText: t.clerkSignInButton,
          actionLink: t.clerkSignUpLink,
        },
        password: {
          title: t.clerkSignInTitle,
          subtitle: '',
          actionText: t.clerkSignInButton,
          forgotPasswordText: t.clerkForgotPassword,
        },
      },
      
      // Sign Up page
      signUp: {
        start: {
          title: t.clerkSignUpTitle,
          subtitle: '',
          actionText: t.clerkSignUpButton,
          actionLink: t.clerkSignInLink,
        },
        emailCode: {
          title: t.clerkVerifyEmail,
          subtitle: t.clerkVerifyEmailDescription,
          formTitle: t.clerkEnterCode,
          formSubtitle: '',
          resendButton: t.clerkResendCode,
        },
      },
      
      // Form fields
      formFieldLabel__emailAddress: t.clerkEmailLabel,
      formFieldLabel__password: t.clerkPasswordLabel,
      formFieldLabel__firstName: t.clerkFirstNameLabel,
      formFieldLabel__lastName: t.clerkLastNameLabel,
      
      // Form buttons
      formButtonPrimary: t.clerkContinue,
      
      // Footer actions
      footerActionText__signIn: t.clerkAlreadyHaveAccount,
      footerActionText__signUp: t.clerkDontHaveAccount,
      footerActionLink__signIn: t.clerkSignInLink,
      footerActionLink__signUp: t.clerkSignUpLink,
      
      // Divider text
      dividerText: t.clerkOrContinueWith,
      
      // Error messages
      formFieldError__invalid_email_address: t.clerkInvalidEmail,
      formFieldError__password_too_short: t.clerkPasswordTooShort,
      formFieldError__password_required: t.clerkPasswordRequired,
      formFieldError__email_address_required: t.clerkEmailRequired,
      formFieldError__first_name_required: t.clerkFirstNameRequired,
      formFieldError__last_name_required: t.clerkLastNameRequired,
      
      // Generic errors
      signInError: t.clerkSignInError,
      signUpError: t.clerkSignUpError,
      networkError: t.clerkNetworkError,
      genericError: t.clerkGenericError,
    };
  }

  /**
   * Get language-specific social provider labels
   */
  static getSocialProviderLabels(language: Language) {
    const isKannada = language === Language.KN;
    
    return {
      google: isKannada ? 'Google ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ' : 'Continue with Google',
      github: isKannada ? 'GitHub ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ' : 'Continue with GitHub',
      facebook: isKannada ? 'Facebook ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ' : 'Continue with Facebook',
      twitter: isKannada ? 'Twitter ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ' : 'Continue with Twitter',
    };
  }

  /**
   * Get loading and status messages
   */
  static getStatusMessages(language: Language) {
    const isKannada = language === Language.KN;
    
    return {
      loading: isKannada ? 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading...',
      verifying: isKannada ? 'ಪರಿಶೀಲಿಸುತ್ತಿದೆ...' : 'Verifying...',
      signingIn: isKannada ? 'ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...' : 'Signing in...',
      signingUp: isKannada ? 'ಸೈನ್ ಅಪ್ ಆಗುತ್ತಿದೆ...' : 'Signing up...',
      success: isKannada ? 'ಯಶಸ್ವಿಯಾಗಿದೆ!' : 'Success!',
      emailSent: isKannada ? 'ಇಮೇಲ್ ಕಳುಹಿಸಲಾಗಿದೆ' : 'Email sent',
      codeVerified: isKannada ? 'ಕೋಡ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ' : 'Code verified',
    };
  }

  /**
   * Get help and support text
   */
  static getHelpText(language: Language) {
    const isKannada = language === Language.KN;
    
    return {
      needHelp: isKannada ? 'ಸಹಾಯ ಬೇಕೇ?' : 'Need help?',
      contactSupport: isKannada ? 'ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ' : 'Contact support',
      troubleSigning: isKannada ? 'ಸೈನ್ ಇನ್ ಮಾಡುವಲ್ಲಿ ತೊಂದರೆ?' : 'Trouble signing in?',
      checkEmail: isKannada ? 'ನಿಮ್ಮ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ' : 'Check your email',
      didntReceiveCode: isKannada ? 'ಕೋಡ್ ಸಿಗಲಿಲ್ಲವೇ?' : "Didn't receive the code?",
    };
  }

  /**
   * Get complete localization object for Clerk
   */
  static getCompleteLocalization(language: Language) {
    return {
      ...this.getClerkLocalization(language),
      socialProviders: this.getSocialProviderLabels(language),
      statusMessages: this.getStatusMessages(language),
      helpText: this.getHelpText(language),
    };
  }
}

export default ClerkLocalizationService;