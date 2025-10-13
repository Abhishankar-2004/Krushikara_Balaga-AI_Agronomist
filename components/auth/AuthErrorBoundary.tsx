import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DashboardIcon } from '../icons/DashboardIcon';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class AuthErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Authentication Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <AuthErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const AuthErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl mb-6">
          <DashboardIcon className="w-9 h-9 text-red-600 dark:text-red-400" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Authentication Error
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Something went wrong with the authentication system. This might be a temporary issue.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-800 dark:text-red-200 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleReload}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

// Wrapper component that uses hooks
const AuthErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  return (
    <AuthErrorBoundaryClass fallback={fallback}>
      {children}
    </AuthErrorBoundaryClass>
  );
};

export default AuthErrorBoundary;