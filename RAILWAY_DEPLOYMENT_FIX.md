# Railway Deployment Fix Guide

## Problem
Backend was crashing with SIGTERM error because Railway was running `nest start --watch` (development mode) instead of production mode.

## Solution Applied

### 1. Updated `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_22"]

[phases.install]
cmds = ["cd backend && npm ci --omit=dev"]

[phases.build]
cmds = ["cd backend && npm run build"]

[start]
cmd = "cd backend && node dist/main"
```

**Changes:**
- Use `npm ci --omit=dev` to install only production dependencies
- Start command now directly runs `node dist/main` instead of `npm run start:prod`

### 2. Updated `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm ci --omit=dev && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && node dist/main",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Changes:**
- Explicit `buildCommand` and `startCommand`
- Ensures production mode execution

### 3. Created Root `Procfile`
```
web: cd backend && node dist/main
```

**Purpose:**
- Backup start command if Railway doesn't use nixpacks

## Required Environment Variables on Railway

Make sure these are set in your Railway project:

### Essential Variables
```bash
NODE_ENV=production
PORT=8080
API_PREFIX=api/v1
FRONTEND_URL=https://your-frontend-url.com

# Database (from Railway PostgreSQL plugin)
DATABASE_HOST=<from Railway>
DATABASE_PORT=5432
DATABASE_USER=<from Railway>
DATABASE_PASSWORD=<from Railway>
DATABASE_NAME=<from Railway>

# JWT Secrets (generate strong random strings)
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<generate-strong-secret>
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (REQUIRED for image uploads)
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

### Optional Variables
```bash
# Redis (if using Railway Redis plugin)
REDIS_HOST=<from Railway>
REDIS_PORT=6379

# Email (configure SMTP provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
SMTP_FROM=noreply@yourdomain.com

# OpenAI (for chatbot)
OPENAI_API_KEY=<your-openai-key>

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## Deployment Steps

### 1. Push Changes to Git
```bash
git add .
git commit -m "Fix Railway deployment configuration"
git push
```

### 2. Railway Will Auto-Deploy
Railway will detect the changes and redeploy automatically.

### 3. Monitor Deployment
- Go to Railway dashboard
- Click on your backend service
- Watch the deployment logs
- Look for: "🦷 Dental College API Server"

### 4. Verify Deployment
```bash
# Check health endpoint
curl https://your-backend-url.railway.app/health

# Check API docs
curl https://your-backend-url.railway.app/docs
```

## Troubleshooting

### If Still Getting SIGTERM Error
1. Check Railway logs for specific error messages
2. Verify all required environment variables are set
3. Check database connection (most common issue)
4. Verify Cloudinary credentials

### Common Issues

#### Database Connection Failed
- Ensure DATABASE_* variables are correctly set from Railway PostgreSQL plugin
- Check if database is running in Railway dashboard

#### Memory Limit Exceeded
- Upgrade Railway plan if needed
- Check for memory leaks in code

#### Build Timeout
- Railway free tier has build time limits
- Consider optimizing dependencies

#### Missing Environment Variables
```bash
# Check Railway logs for errors like:
# "Cannot read property 'X' of undefined"
# This usually means a required env var is missing
```

## Health Check

After deployment, your backend should respond at:
- Root: `https://your-backend.railway.app/` (API info)
- Health: `https://your-backend.railway.app/health`
- Docs: `https://your-backend.railway.app/docs`
- API: `https://your-backend.railway.app/api/v1/`

## Next Steps

1. ✅ Push these changes to trigger redeployment
2. ✅ Verify all environment variables are set in Railway
3. ✅ Check deployment logs for successful startup
4. ✅ Test API endpoints
5. ✅ Update frontend NEXT_PUBLIC_API_URL to point to Railway backend

## Notes

- **Never use `--watch` mode in production** - it causes memory leaks and crashes
- **Always use `node dist/main`** directly for production
- **Set NODE_ENV=production** to disable Swagger docs and enable optimizations
- **Use Cloudinary** for image storage (Railway doesn't persist filesystem)
