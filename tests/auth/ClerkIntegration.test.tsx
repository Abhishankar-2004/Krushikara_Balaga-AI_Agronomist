/**
 * Comprehensive test suite for Clerk authentication integration
 * 
 * This file contains tests for:
 * - Authentication state management
 * - User profile synchronization
 * - Theme integration
 * - Language localization
 * - Error handling
 * - Session management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClerkProvider } from '@clerk/clerk-react';
import { LanguageProvider } from '../../LanguageContext';
import { ThemeProvider } from '../../ThemeContext';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import ClerkAuth from '../../components/auth/ClerkAuth';
import AuthFlowTest from '../../components/auth/AuthFlowTest';

// Mock Clerk hooks
const mockUseAuth = vi.fn();
const mockUseUser = vi.fn();
const mockSignOut = vi.fn();

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => mockUseAuth(),
  useUser: () => mockUseUser(),
  SignIn: () => <div data-testid="clerk-signin">Clerk SignIn Component</div>,
  SignUp: () => <div data-testid="clerk-signup">Clerk SignUp Component</div>,
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <ThemeProvider>
      <ClerkProvider publishableKey="test-key">
        {children}
      </ClerkProvider>
    </ThemeProvider>
  </LanguageProvider>
);

describe('Clerk Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication State Management', () => {
    it('should show loading state when Clerk is not loaded', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: false,
        isSignedIn: false,
      });
      mockUseUser.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText(/loading authentication/i)).toBeInTheDocument();
    });

    it('should show authentication when user is not signed in', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: false,
      });
      mockUseUser.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Should show the landing page with login/signup buttons
      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    it('should show protected content when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
      });
      mockUseUser.mockReturnValue({
        user: {
          id: 'test-user-id',
          emailAddresses: [{ emailAddress: 'test@example.com' }],
          fullName: 'Test User',
        },
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Authentication Flow', () => {
    it('should switch between sign in and sign up views', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: false,
      });
      mockUseUser.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <ClerkAuth />
        </TestWrapper>
      );

      // Should start with landing page
      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();

      // Click sign in button
      fireEvent.click(screen.getByText(/sign in/i));
      expect(screen.getByTestId('clerk-signin')).toBeInTheDocument();
    });

    it('should handle logout functionality', async () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        signOut: mockSignOut,
      });
      mockUseUser.mockReturnValue({
        user: {
          id: 'test-user-id',
          emailAddresses: [{ emailAddress: 'test@example.com' }],
        },
      });

      render(
        <TestWrapper>
          <AuthFlowTest />
        </TestWrapper>
      );

      const logoutButton = screen.getByText(/test logout/i);
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });
  });

  describe('User Profile Integration', () => {
    it('should display user information correctly', () => {
      const mockUser = {
        id: 'test-user-id',
        emailAddresses: [{ emailAddress: 'farmer@example.com' }],
        fullName: 'John Farmer',
        createdAt: new Date('2024-01-01'),
        publicMetadata: {
          location: 'Karnataka, India',
          farmingType: 'Organic',
        },
      };

      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
      });
      mockUseUser.mockReturnValue({ user: mockUser });

      render(
        <TestWrapper>
          <AuthFlowTest />
        </TestWrapper>
      );

      expect(screen.getByText('farmer@example.com')).toBeInTheDocument();
      expect(screen.getByText('John Farmer')).toBeInTheDocument();
    });

    it('should handle missing user data gracefully', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
      });
      mockUseUser.mockReturnValue({
        user: {
          id: 'test-user-id',
          emailAddresses: [],
        },
      });

      render(
        <TestWrapper>
          <AuthFlowTest />
        </TestWrapper>
      );

      expect(screen.getAllByText('N/A')).toHaveLength(3); // Email, Name, and Created fields
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockUseAuth.mockImplementation(() => {
        throw new Error('Authentication failed');
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText(/authentication error/i)).toBeInTheDocument();
      expect(screen.getByText(/try again/i)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('should provide retry functionality on errors', () => {
      const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

      mockUseAuth.mockImplementation(() => {
        throw new Error('Network error');
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      const reloadButton = screen.getByText(/reload page/i);
      fireEvent.click(reloadButton);

      expect(reloadSpy).toHaveBeenCalled();
      reloadSpy.mockRestore();
    });
  });

  describe('Theme Integration', () => {
    it('should apply correct theme classes', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: false,
        isSignedIn: false,
      });

      const { container } = render(
        <TestWrapper>
          <ProtectedRoute>
            <div>Content</div>
          </ProtectedRoute>
        </TestWrapper>
      );

      // Check if theme classes are applied
      const loadingScreen = container.querySelector('.bg-gradient-to-br');
      expect(loadingScreen).toBeInTheDocument();
    });
  });

  describe('Localization Integration', () => {
    it('should use translated text', () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: false,
      });
      mockUseUser.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <ClerkAuth />
        </TestWrapper>
      );

      // Should show translated app title
      expect(screen.getByRole('heading', { name: /krushikara balaga/i })).toBeInTheDocument();
    });
  });
});

describe('Clerk Configuration', () => {
  it('should validate required environment variables', () => {
    // Mock environment variables
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: undefined,
    };

    expect(async () => {
      // This would be called in the actual app initialization
      const { validateClerkConfig } = await import('../../clerk.config');
      validateClerkConfig();
    }).rejects.toThrow(/missing clerk publishable key/i);

    process.env = originalEnv;
  });

  it('should reject placeholder keys', () => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'your_clerk_publishable_key_here',
    };

    expect(async () => {
      const { validateClerkConfig } = await import('../../clerk.config');
      validateClerkConfig();
    }).rejects.toThrow(/replace the placeholder/i);

    process.env = originalEnv;
  });
});

describe('Session Management', () => {
  it('should handle session persistence', () => {
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });
    mockUseUser.mockReturnValue({
      user: {
        id: 'test-user-id',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
      },
    });

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should handle session expiry', () => {
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });
    mockUseUser.mockReturnValue({ user: null });

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    // Should redirect to authentication
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

// Integration test for complete authentication flow
describe('End-to-End Authentication Flow', () => {
  it('should complete full authentication journey', async () => {
    // Start with unauthenticated state
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });
    mockUseUser.mockReturnValue({ user: null });

    const { rerender } = render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    // Should show authentication
    expect(screen.getByText(/login/i)).toBeInTheDocument();

    // Simulate successful authentication
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });
    mockUseUser.mockReturnValue({
      user: {
        id: 'test-user-id',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        fullName: 'Test User',
      },
    });

    rerender(
      <TestWrapper>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    // Should now show protected content
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});