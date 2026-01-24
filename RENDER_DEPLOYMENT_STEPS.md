# 🚀 Render Backend Deployment Steps

## Issue
The backend on Render needs to be updated with the new candidate search and saved profiles functionality.

## Current Status
- ✅ Code pushed to GitHub (commit: 9da525f)
- ✅ Frontend deployed to Netlify
- ⚠️ Backend on Render needs redeployment

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

If you have auto-deploy enabled on Render:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Login with your account

2. **Find Your Service**
   - Look for: `mytechz-backend` or `mytechz-job-portal`

3. **Trigger Manual Deploy**
   - Click on the service
   - Click "Manual Deploy" button
   - Select "Deploy latest commit"
   - Wait for deployment to complete (5-10 minutes)

4. **Verify Deployment**
   - Check logs for any errors
   - Test API endpoint: https://mytechz-job-portal.onrender.com/api/recruiter/search-candidates

### Option 2: Manual Deployment

If auto-deploy is not enabled:

1. **Connect GitHub Repository**
   ```
   Repository: siva-dataworker/mytechz-job-portal
   Branch: main
   Root Directory: backend
   ```

2. **Environment Variables**
   Make sure these are set in Render:
   ```
   SECRET_KEY=<your-secret-key>
   DEBUG=False
   ALLOWED_HOSTS=.onrender.com
   DATABASE_URL=<your-database-url>
   ```

3. **Build Command**
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
   ```

4. **Start Command**
   ```bash
   gunicorn job_portal.wsgi:application
   ```

### Option 3: Deploy from Local

If you want to deploy from your local machine:

1. **Install Render CLI**
   ```bash
   npm install -g @render/cli
   ```

2. **Login to Render**
   ```bash
   render login
   ```

3. **Deploy**
   ```bash
   cd backend
   render deploy
   ```

## Post-Deployment Verification

### 1. Check Backend Health
```bash
curl https://mytechz-job-portal.onrender.com/admin/
```

### 2. Test New Endpoints
```bash
# Search Candidates (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://mytechz-job-portal.onrender.com/api/recruiter/search-candidates

# Saved Profiles (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://mytechz-job-portal.onrender.com/api/recruiter/saved-profiles
```

### 3. Check Frontend Connection
- Visit: https://cheery-malasada-331cc2.netlify.app
- Login as recruiter
- Navigate to "Search Candidates"
- Should see candidates (or empty state if no candidates exist)

## Troubleshooting

### Issue: "Failed to connect to server"
**Solution:**
1. Check if Render service is sleeping (free tier)
2. Visit backend URL to wake it up: https://mytechz-job-portal.onrender.com
3. Wait 30-60 seconds for service to start
4. Refresh frontend page

### Issue: "500 Internal Server Error"
**Solution:**
1. Check Render logs for errors
2. Verify all migrations ran successfully
3. Check environment variables are set correctly

### Issue: "CORS Error"
**Solution:**
- CORS is already configured to allow Netlify
- If still having issues, check Render logs

## Database Migration

The new `SavedCandidate` model requires a migration. This should run automatically during deployment, but if needed:

```bash
# SSH into Render service (if available)
python manage.py migrate recruiter 0005_savedcandidate
```

## Important Notes

1. **Free Tier Limitations**
   - Render free tier services sleep after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - Consider upgrading to paid tier for production

2. **Database**
   - Make sure PostgreSQL database is connected
   - Check that migrations ran successfully

3. **Static Files**
   - Static files are collected during build
   - Admin panel should have CSS styling

## Quick Test Commands

After deployment, test these endpoints:

```bash
# Health check
curl https://mytechz-job-portal.onrender.com/

# Admin panel (should show styled page)
curl https://mytechz-job-portal.onrender.com/admin/

# API endpoint (should return 401 without auth)
curl https://mytechz-job-portal.onrender.com/api/recruiter/search-candidates
```

## Support

If deployment fails:
1. Check Render build logs
2. Check Render runtime logs
3. Verify all environment variables
4. Ensure requirements.txt is up to date
5. Check that migrations completed successfully

---

**Last Updated:** January 24, 2026
**Commit:** 9da525f
**Status:** Ready for deployment
