import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

/**
 * Basic example following the exact Clerk documentation pattern
 * This is the minimal implementation as shown in the docs
 */
export default function BasicClerkExample() {
  return (
    <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        
        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}