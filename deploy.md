# Deployment Guide

## Vercel Deployment

### Prerequisites
- Node.js installed
- Vercel CLI installed (`npm install -g vercel`)
- Vercel account

### Steps

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy to Production**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Navigate to Settings → Environment Variables
   - Add: `GEMINI_API_KEY` with your API key value

### Environment Variables Required
- `GEMINI_API_KEY`: Your Google Gemini API key

### Build Configuration
The project uses Vite and is configured with:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

### Automatic Deployments
Connect your GitHub repository to Vercel for automatic deployments on every push to main branch.