import React from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton,
  useAuth,
  useUser 
} from '@clerk/clerk-react';

/**
 * Demo component showcasing all Clerk prebuilt components
 * This demonstrates various ways to use Clerk's authentication components
 */
const ClerkComponentsDemo: React.FC = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Clerk Components Demo</h1>
      
      {/* Basic Authentication State */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
        <div className="space-y-2">
          <p><strong>Is Loaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Is Signed In:</strong> {isSignedIn ? '✅ Yes' : '❌ No'}</p>
          {user && (
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded">
              <p><strong>User Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
              <p><strong>User Name:</strong> {user.fullName || 'Not set'}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          )}
        </div>
      </div>

      {/* SignedOut Components */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">SignedOut Components</h2>
        <SignedOut>
          <div className="space-y-4">
            <p className="text-green-600 font-medium">✅ You can see this because you're signed out</p>
            
            {/* Basic SignInButton */}
            <div>
              <h3 className="font-medium mb-2">Basic SignInButton:</h3>
              <SignInButton />
            </div>

            {/* Styled SignInButton */}
            <div>
              <h3 className="font-medium mb-2">Styled SignInButton:</h3>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Custom Sign In
                </button>
              </SignInButton>
            </div>

            {/* SignUpButton */}
            <div>
              <h3 className="font-medium mb-2">SignUpButton:</h3>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Sign Up Now
                </button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>
        <SignedIn>
          <p className="text-red-600 font-medium">❌ You can't see SignedOut content because you're signed in</p>
        </SignedIn>
      </div>

      {/* SignedIn Components */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">SignedIn Components</h2>
        <SignedIn>
          <div className="space-y-4">
            <p className="text-green-600 font-medium">✅ You can see this because you're signed in</p>
            
            {/* UserButton */}
            <div>
              <h3 className="font-medium mb-2">UserButton (Default):</h3>
              <UserButton />
            </div>

            {/* Styled UserButton */}
            <div>
              <h3 className="font-medium mb-2">Styled UserButton:</h3>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-12 h-12 rounded-full border-2 border-blue-500",
                    userButtonPopoverCard: "bg-white dark:bg-slate-800 shadow-xl rounded-lg",
                  }
                }}
              />
            </div>

            {/* Custom Sign Out Button */}
            <div>
              <h3 className="font-medium mb-2">Custom Sign Out:</h3>
              <button 
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Custom Sign Out
              </button>
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <p className="text-red-600 font-medium">❌ You can't see SignedIn content because you're signed out</p>
        </SignedOut>
      </div>

      {/* Component Usage Examples */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Basic Header Pattern:</h3>
            <pre className="bg-slate-100 dark:bg-slate-700 p-3 rounded overflow-x-auto">
{`<header>
  <SignedOut>
    <SignInButton />
  </SignedOut>
  <SignedIn>
    <UserButton />
  </SignedIn>
</header>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">Modal Mode:</h3>
            <pre className="bg-slate-100 dark:bg-slate-700 p-3 rounded overflow-x-auto">
{`<SignInButton mode="modal">
  <button>Custom Sign In</button>
</SignInButton>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">Redirect Mode:</h3>
            <pre className="bg-slate-100 dark:bg-slate-700 p-3 rounded overflow-x-auto">
{`<SignInButton 
  mode="redirect" 
  redirectUrl="/dashboard"
>
  <button>Sign In</button>
</SignInButton>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkComponentsDemo;