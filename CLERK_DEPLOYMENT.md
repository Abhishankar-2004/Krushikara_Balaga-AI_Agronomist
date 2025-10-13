# Clerk Deployment Configuration

This guide explains how to properly configure Clerk authentication for different deployment environments.

## Environment Variables

### Required Variables

Add these environment variables to your deployment platform:

```bash
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# For production, use live keys:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_live_publishable_key_here
# CLERK_SECRET_KEY=sk_live_your_live_secret_key_here
```

### Vercel Deployment

1. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add the Clerk keys for each environment (Development, Preview, Production)

2. **Automatic Deployment:**
   ```bash
   # Deploy to Vercel
   vercel --prod
   ```

3. **Environment-specific Configuration:**
   - Development: Use test keys
   - Preview: Use test keys
   - Production: Use live keys

### Netlify Deployment

1. **Add Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add the Clerk keys

2. **Build Configuration:**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"

   [build.environment]
     NODE_VERSION = "18"
   ```

### Other Platforms

For other deployment platforms (Railway, Render, etc.):
1. Add the environment variables in the platform's dashboard
2. Ensure the build command is `npm run build`
3. Set the publish directory to `dist`

## Clerk Dashboard Configuration

### Development Environment

1. **Allowed Origins:**
   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` (if using different port)

2. **Redirect URLs:**
   - `http://localhost:5173/`
   - `http://localhost:5173/dashboard`

### Production Environment

1. **Allowed Origins:**
   - `https://your-domain.com`
   - `https://www.your-domain.com`

2. **Redirect URLs:**
   - `https://your-domain.com/`
   - `https://your-domain.com/dashboard`

3. **Social Providers:**
   - Configure OAuth redirect URLs for production domain
   - Update Google, GitHub, etc. OAuth apps with production URLs

## Security Considerations

### Environment Variables

1. **Never commit secrets to git:**
   ```bash
   # .env.local should be in .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Use different keys for different environments:**
   - Test keys for development/staging
   - Live keys for production only

3. **Rotate keys regularly:**
   - Generate new keys periodically
   - Update all deployment environments

### Domain Configuration

1. **Restrict allowed origins:**
   - Only add domains you control
   - Use HTTPS in production
   - Avoid wildcards unless necessary

2. **Configure CORS properly:**
   - Clerk handles CORS automatically
   - Ensure your domain is in allowed origins

## Deployment Checklist

### Pre-deployment

- [ ] Clerk keys are configured in deployment platform
- [ ] Domain is added to Clerk allowed origins
- [ ] Redirect URLs are configured in Clerk dashboard
- [ ] Social OAuth apps are configured for production domain
- [ ] Environment variables are set correctly

### Post-deployment

- [ ] Test authentication flow on deployed site
- [ ] Verify social logins work
- [ ] Check user profile synchronization
- [ ] Test logout functionality
- [ ] Verify theme and language switching
- [ ] Test error handling and loading states

## Troubleshooting

### Common Issues

1. **"Invalid publishable key" error:**
   - Check environment variable name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Verify key is correct in deployment platform
   - Ensure key matches the environment (test vs live)

2. **Redirect loop or blank page:**
   - Check allowed origins in Clerk dashboard
   - Verify redirect URLs are configured
   - Check browser console for errors

3. **Social login not working:**
   - Update OAuth app redirect URLs
   - Check social provider configuration in Clerk
   - Verify domain matches OAuth app settings

4. **Environment variable not found:**
   - Check variable name spelling
   - Verify deployment platform has the variables
   - Restart deployment after adding variables

### Debug Steps

1. **Check browser console:**
   ```javascript
   // Check if Clerk is loaded
   console.log(window.Clerk);
   
   // Check environment variables
   console.log(import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
   ```

2. **Verify network requests:**
   - Check Network tab for Clerk API calls
   - Look for 401/403 errors
   - Verify requests are going to correct Clerk instance

3. **Test in incognito mode:**
   - Clear browser cache and cookies
   - Test authentication flow from scratch
   - Check if issue persists across browsers

## Environment-specific Notes

### Development
- Use test keys only
- Hot reload should work with Clerk
- Console warnings are normal in development

### Staging/Preview
- Use test keys
- Test all authentication flows
- Verify social logins work with staging URLs

### Production
- Use live keys only
- Monitor authentication errors
- Set up proper error tracking
- Configure analytics if needed

## Support

If you encounter issues:

1. Check Clerk documentation: https://clerk.com/docs
2. Review Clerk dashboard logs
3. Check deployment platform logs
4. Contact Clerk support if needed

Remember to never share your secret keys publicly!