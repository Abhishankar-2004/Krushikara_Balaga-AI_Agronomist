// Get environment variable with fallback for Vite
const getEnvVar = (key: string): string | undefined => {
  // For Vite, use import.meta.env (with type assertion)
  if (typeof window !== 'undefined' && (import.meta as any)?.env) {
    return (import.meta as any).env[key];
  }
  
  // Fallback for other environments
  if (typeof window !== 'undefined') {
    return (window as any).process?.env?.[key] || (process as any).env?.[key];
  }
  
  // Node environment
  return process.env[key];
};

// Clerk Configuration
export const clerkConfig = {
  publishableKey: getEnvVar('VITE_CLERK_PUBLISHABLE_KEY') || getEnvVar('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
  
  // Session management configuration
  sessionTokenTemplate: 'default',
  
  // Appearance configuration for theme support
  appearance: {
    baseTheme: undefined, // Will be set dynamically based on app theme
    variables: {
      colorPrimary: '#16a34a', // Primary green color from your app (green-600)
      colorPrimaryText: '#ffffff',
      colorBackground: '#ffffff',
      colorText: '#1e293b', // slate-800
      colorInputBackground: '#f8fafc', // slate-50
      colorInputText: '#1e293b', // slate-800
      borderRadius: '0.75rem', // Matches your app's rounded-xl
      fontFamily: 'Inter, sans-serif', // Matches your app's font
    },
    elements: {
      formButtonPrimary: {
        fontSize: '16px',
        fontWeight: '600',
        padding: '12px 24px',
        borderRadius: '0.75rem',
        backgroundColor: '#16a34a',
        '&:hover': {
          backgroundColor: '#15803d'
        }
      },
      card: {
        borderRadius: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      headerTitle: {
        fontSize: '24px',
        fontWeight: '700',
        fontFamily: 'Inter, sans-serif'
      },
      headerSubtitle: {
        fontFamily: 'Inter, sans-serif'
      },
      socialButtonsBlockButton: {
        borderRadius: '0.75rem',
        border: '2px solid #e2e8f0',
        '&:hover': {
          backgroundColor: '#f8fafc'
        }
      },
      formFieldInput: {
        borderRadius: '0.75rem',
        border: '2px solid #e2e8f0',
        backgroundColor: '#f1f5f9',
        '&:focus': {
          borderColor: '#16a34a',
          boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
        }
      }
    }
  },
  
  // Localization configuration
  localization: {
    // Will be configured based on app language
  }
};

// Helper function to get theme-aware appearance config
export const getClerkAppearance = (theme: 'light' | 'dark') => ({
  ...clerkConfig.appearance,
  variables: {
    ...clerkConfig.appearance.variables,
    // Background colors
    colorBackground: theme === 'dark' ? '#020617' : '#ffffff', // slate-950 for dark
    colorInputBackground: theme === 'dark' ? '#1e293b' : '#f1f5f9', // slate-800 for dark, slate-100 for light
    
    // Text colors
    colorText: theme === 'dark' ? '#e2e8f0' : '#1e293b', // slate-200 for dark, slate-800 for light
    colorInputText: theme === 'dark' ? '#e2e8f0' : '#1e293b',
    colorTextSecondary: theme === 'dark' ? '#94a3b8' : '#64748b', // slate-400 for dark, slate-500 for light
    
    // Border colors
    colorInputBorder: theme === 'dark' ? '#475569' : '#e2e8f0', // slate-600 for dark, slate-200 for light
    
    // Neutral colors
    colorNeutral: theme === 'dark' ? '#334155' : '#f1f5f9', // slate-700 for dark, slate-100 for light
    
    // Danger colors
    colorDanger: theme === 'dark' ? '#f87171' : '#dc2626', // red-400 for dark, red-600 for light
    
    // Success colors
    colorSuccess: theme === 'dark' ? '#4ade80' : '#16a34a', // green-400 for dark, green-600 for light
    
    // Warning colors
    colorWarning: theme === 'dark' ? '#fbbf24' : '#d97706', // amber-400 for dark, amber-600 for light
  },
  elements: {
    ...clerkConfig.appearance.elements,
    
    // Card styling
    card: {
      borderRadius: '1rem',
      boxShadow: theme === 'dark' 
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', // slate-900 for dark
      border: theme === 'dark' ? '1px solid #334155' : 'none', // slate-700 border for dark
    },
    
    // Header styling
    headerTitle: {
      fontSize: '24px',
      fontWeight: '700',
      fontFamily: 'Inter, sans-serif',
      color: theme === 'dark' ? '#f1f5f9' : '#1e293b', // slate-100 for dark, slate-800 for light
    },
    
    headerSubtitle: {
      fontFamily: 'Inter, sans-serif',
      color: theme === 'dark' ? '#94a3b8' : '#64748b', // slate-400 for dark, slate-500 for light
    },
    
    // Form elements
    formFieldInput: {
      borderRadius: '0.75rem',
      border: `2px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`, // slate-600 for dark, slate-200 for light
      backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9', // slate-800 for dark, slate-100 for light
      color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
      '&:focus': {
        borderColor: '#16a34a',
        boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
        backgroundColor: theme === 'dark' ? '#334155' : '#ffffff', // slate-700 for dark, white for light
      },
      '&::placeholder': {
        color: theme === 'dark' ? '#94a3b8' : '#64748b', // slate-400 for dark, slate-500 for light
      }
    },
    
    formFieldLabel: {
      color: theme === 'dark' ? '#e2e8f0' : '#374151', // slate-200 for dark, gray-700 for light
      fontWeight: '500',
      fontSize: '14px',
    },
    
    // Button styling
    formButtonPrimary: {
      fontSize: '16px',
      fontWeight: '600',
      padding: '12px 24px',
      borderRadius: '0.75rem',
      backgroundColor: '#16a34a',
      color: '#ffffff',
      border: 'none',
      '&:hover': {
        backgroundColor: '#15803d',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
      '&:disabled': {
        backgroundColor: theme === 'dark' ? '#374151' : '#9ca3af',
        cursor: 'not-allowed',
      }
    },
    
    // Social buttons
    socialButtonsBlockButton: {
      borderRadius: '0.75rem',
      border: `2px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
      color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
      '&:hover': {
        backgroundColor: theme === 'dark' ? '#334155' : '#f8fafc',
        borderColor: theme === 'dark' ? '#64748b' : '#cbd5e1',
      }
    },
    
    // Links
    formFieldAction: {
      color: '#16a34a',
      '&:hover': {
        color: '#15803d',
        textDecoration: 'underline',
      }
    },
    
    // Footer
    footerAction: {
      color: theme === 'dark' ? '#94a3b8' : '#64748b',
      '&:hover': {
        color: '#16a34a',
      }
    },
    
    // Divider
    dividerLine: {
      backgroundColor: theme === 'dark' ? '#475569' : '#e2e8f0',
    },
    
    dividerText: {
      color: theme === 'dark' ? '#94a3b8' : '#64748b',
      fontSize: '14px',
    },
    
    // Alert/Error messages
    alertError: {
      backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fef2f2', // red-900 for dark, red-50 for light
      color: theme === 'dark' ? '#fca5a5' : '#dc2626', // red-300 for dark, red-600 for light
      border: `1px solid ${theme === 'dark' ? '#991b1b' : '#fecaca'}`, // red-800 for dark, red-200 for light
      borderRadius: '0.5rem',
    },
    
    // Loading spinner
    spinner: {
      color: '#16a34a',
    },
  }
});

// Helper function to validate Clerk configuration
export const validateClerkConfig = () => {
  if (!clerkConfig.publishableKey) {
    throw new Error(
      'Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file. ' +
      'Get your key from https://dashboard.clerk.com/'
    );
  }
  
  if (clerkConfig.publishableKey.startsWith('your_clerk_')) {
    throw new Error(
      'Please replace the placeholder Clerk key with your actual key from https://dashboard.clerk.com/'
    );
  }
  
  return true;
};