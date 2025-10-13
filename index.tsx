import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { ClerkProvider } from '@clerk/clerk-react';

// Import your Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>
);