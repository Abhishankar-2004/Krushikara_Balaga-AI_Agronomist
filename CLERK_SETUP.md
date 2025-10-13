# Clerk Setup Guide

## Step 1: Create Clerk Account and Application

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com/
2. **Sign up or log in** to your Clerk account
3. **Create a new application**:
   - Click "Add application"
   - Name: "Krushikara Balaga AI Agronomist"
   - Choose your preferred authentication methods:
     - ✅ Email/Password
     - ✅ Google (recommended)
     - ✅ GitHub (optional)
     - ✅ Phone (optional)

## Step 2: Get Your API Keys

1. **In your Clerk dashboard**, go to "API Keys" section
2. **Copy the keys**:
   - **Publishable Key**: Starts with `pk_test_` or `pk_live_`
   - **Secret Key**: Starts with `sk_test_` or `sk_live_`

## Step 3: Update Environment Variables

1. **Open `.env.local`** in your project
2. **Replace the placeholder values**:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

## Step 4: Configure Authentication Providers (Optional)

### Google OAuth Setup:
1. **In Clerk Dashboard** → "SSO Connections" → "Add connection"
2. **Select Google**
3. **Follow the setup wizard** to configure Google OAuth
4. **Enable for your application**

### GitHub OAuth Setup:
1. **In Clerk Dashboard** → "SSO Connections" → "Add connection"
2. **Select GitHub**
3. **Follow the setup wizard** to configure GitHub OAuth
4. **Enable for your application**

## Step 5: Configure Allowed Domains (Production)

1. **In Clerk Dashboard** → "Domains"
2. **Add your production domain** (e.g., your-app.vercel.app)
3. **Add localhost for development**: `http://localhost:5173`

## Step 6: Customize Appearance (Optional)

1. **In Clerk Dashboard** → "Customization" → "Appearance"
2. **Upload your logo** and customize colors to match your app
3. **Preview the authentication components**

## Important Notes:

- ⚠️ **Never commit secret keys** to version control
- 🔄 **Use test keys for development** and live keys for production
- 🌐 **Configure allowed domains** before deploying to production
- 📱 **Test all authentication methods** before going live

## Next Steps:

After completing this setup, the Clerk integration will be ready to use in your application!