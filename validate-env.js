// Simple validation script to test environment variables
import { loadEnv } from 'vite';

const env = loadEnv('development', '.', '');

console.log('🔍 Environment Variable Validation:');
console.log('VITE_CLERK_PUBLISHABLE_KEY:', env.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Found' : '❌ Missing');
console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Found (legacy)' : '❌ Missing');
console.log('CLERK_SECRET_KEY:', env.CLERK_SECRET_KEY ? '✅ Found' : '❌ Missing');
console.log('GEMINI_API_KEY:', env.GEMINI_API_KEY ? '✅ Found' : '❌ Missing');

if (!env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.error('❌ Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local');
  process.exit(1);
}

console.log('✅ All required environment variables are present!');