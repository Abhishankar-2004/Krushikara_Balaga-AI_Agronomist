import React, { useEffect } from 'react';
import { useTheme, Theme } from '../../ThemeContext';


interface ThemedClerkComponentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that provides theme-aware styling for Clerk components
 * This ensures Clerk components always match the current app theme
 */
const ThemedClerkComponent: React.FC<ThemedClerkComponentProps> = ({
  children,
  className = ''
}) => {
  const { theme } = useTheme();

  // Apply theme-specific classes to the wrapper
  const themeClasses = theme === Theme.DARK
    ? 'dark bg-slate-950 text-slate-100'
    : 'bg-white text-slate-900';

  // Inject dynamic styles for Clerk components
  useEffect(() => {
    const styleId = 'themed-clerk-styles';
    const existingStyle = document.getElementById(styleId);

    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Additional theme-specific styles for Clerk components */
      .cl-card {
        background-color: ${theme === Theme.DARK ? '#0f172a' : '#ffffff'} !important;
        border: ${theme === Theme.DARK ? '1px solid #334155' : 'none'} !important;
        box-shadow: ${theme === Theme.DARK
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'} !important;
      }
      
      .cl-headerTitle {
        color: ${theme === Theme.DARK ? '#f1f5f9' : '#1e293b'} !important;
      }
      
      .cl-headerSubtitle {
        color: ${theme === Theme.DARK ? '#94a3b8' : '#64748b'} !important;
      }
      
      .cl-formFieldInput {
        background-color: ${theme === Theme.DARK ? '#1e293b' : '#f1f5f9'} !important;
        border-color: ${theme === Theme.DARK ? '#475569' : '#e2e8f0'} !important;
        color: ${theme === Theme.DARK ? '#e2e8f0' : '#1e293b'} !important;
      }
      
      .cl-formFieldInput:focus {
        background-color: ${theme === Theme.DARK ? '#334155' : '#ffffff'} !important;
        border-color: #16a34a !important;
        box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1) !important;
      }
      
      .cl-formFieldLabel {
        color: ${theme === Theme.DARK ? '#e2e8f0' : '#374151'} !important;
      }
      
      .cl-socialButtonsBlockButton {
        background-color: ${theme === Theme.DARK ? '#1e293b' : '#ffffff'} !important;
        border-color: ${theme === Theme.DARK ? '#475569' : '#e2e8f0'} !important;
        color: ${theme === Theme.DARK ? '#e2e8f0' : '#1e293b'} !important;
      }
      
      .cl-socialButtonsBlockButton:hover {
        background-color: ${theme === Theme.DARK ? '#334155' : '#f8fafc'} !important;
        border-color: ${theme === Theme.DARK ? '#64748b' : '#cbd5e1'} !important;
      }
      
      .cl-dividerLine {
        background-color: ${theme === Theme.DARK ? '#475569' : '#e2e8f0'} !important;
      }
      
      .cl-dividerText {
        color: ${theme === Theme.DARK ? '#94a3b8' : '#64748b'} !important;
      }
      
      .cl-footerAction {
        color: ${theme === Theme.DARK ? '#94a3b8' : '#64748b'} !important;
      }
      
      .cl-footerAction:hover {
        color: #16a34a !important;
      }
      
      .cl-formFieldAction {
        color: #16a34a !important;
      }
      
      .cl-formFieldAction:hover {
        color: #15803d !important;
      }
      
      /* Error states */
      .cl-field--error .cl-formFieldInput {
        border-color: ${theme === Theme.DARK ? '#f87171' : '#dc2626'} !important;
      }
      
      .cl-fieldError {
        color: ${theme === Theme.DARK ? '#fca5a5' : '#dc2626'} !important;
      }
      
      /* Loading states */
      .cl-spinner {
        color: #16a34a !important;
      }
      
      /* Custom animations */
      .cl-card {
        animation: fadeInUp 0.4s ease-out;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;

    document.head.appendChild(style);

    // Cleanup function to remove styles when component unmounts
    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [theme]);

  return (
    <div className={`${themeClasses} ${className}`}>
      {children}
    </div>
  );
};

export default ThemedClerkComponent;