# Production OAuth Setup Guide

## Backend Environment Variables Required

Add these to your production backend environment (Railway, Render, etc.):

```bash
# Core Configuration
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secure-jwt-secret
SESSION_SECRET=your-super-secure-session-secret

# URLs
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# GitHub OAuth (Optional - only if you want GitHub login)
GITHUB_CLIENT_ID=your-production-github-client-id
GITHUB_CLIENT_SECRET=your-production-github-client-secret
```

## Google Cloud Console Setup

1. **Update OAuth Consent Screen**:
   - Go to Google Cloud Console → APIs & Services → OAuth consent screen
   - Fill in required details:
     - App name: "Chess Next Move" (or your app name)
     - Support email: your email
     - Developer contact: your email
   - Optionally add logo, homepage URL, privacy policy

2. **Update Redirect URIs**:
   - Go to APIs & Services → Credentials → Your OAuth 2.0 Client ID
   - Add authorized redirect URI:
     ```
     https://your-backend-domain.com/api/oauth/google/callback
     ```
   - Remove any localhost URIs for production

3. **Publish App**:
   - In OAuth consent screen, click "Publish App"
   - Remove all test users to allow any Google user
   - App will show "unverified" warning until you submit for verification

## GitHub OAuth Setup (Optional)

1. **Create GitHub OAuth App**:
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Fill in:
     - Application name: "Chess Next Move"
     - Homepage URL: `https://your-frontend-domain.com`
     - Authorization callback URL: `https://your-backend-domain.com/api/oauth/github/callback`

2. **Get Credentials**:
   - Copy Client ID and Client Secret
   - Add to your backend environment variables

## Frontend Environment Variables

Add these to your frontend environment (Vercel, Netlify, etc.):

```bash
VITE_API_BASE_URL=https://your-backend-domain.com
```

## Deployment Steps

### Backend (Railway/Render)
1. Deploy your backend with all environment variables set
2. Test the health endpoint: `https://your-backend-domain.com/health`
3. Test OAuth endpoints:
   - `https://your-backend-domain.com/api/oauth/google`
   - `https://your-backend-domain.com/api/oauth/github` (if enabled)

### Frontend (Vercel/Netlify)
1. Update your frontend API service to use production backend URL
2. Deploy frontend
3. Test OAuth login flow from frontend

## Testing OAuth Flow

1. **Test Google OAuth**:
   - Visit your frontend
   - Click "Sign in with Google"
   - Should redirect to Google, then back to your app
   - User should be logged in

2. **Test GitHub OAuth** (if enabled):
   - Click "Sign in with GitHub"
   - Should redirect to GitHub, then back to your app
   - User should be logged in

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` is set correctly in backend
   - Check that frontend domain is allowed in CORS config

2. **OAuth Redirect Mismatch**:
   - Verify redirect URIs in Google/GitHub match exactly
   - URLs must be HTTPS in production (except localhost)

3. **Session Issues**:
   - Ensure `SESSION_SECRET` is set
   - Cookies must be secure in production (`NODE_ENV=production`)

4. **Environment Variables Missing**:
   - Check all required variables are set in production
   - Restart service after adding new environment variables

### Debug Steps:

1. Check backend logs for OAuth environment variable status
2. Test individual OAuth endpoints directly
3. Verify database connection
4. Check browser network tab for failed requests

## Security Notes

- Never commit OAuth secrets to version control
- Use strong, unique secrets for JWT and session
- Consider OAuth app verification for production use
- Enable HTTPS for all production URLs
- Set secure session cookies in production
