# Railway Deployment Checklist

## ✅ Pre-Deployment

- [x] Fixed nixpacks.toml to use production mode
- [x] Updated railway.json with explicit commands
- [x] Created root Procfile as backup
- [ ] Verify all environment variables are set in Railway

## 🔧 Environment Variables to Set in Railway

### Critical (App Won't Start Without These)
```bash
NODE_ENV=production
PORT=8080
DATABASE_HOST=<from Railway PostgreSQL>
DATABASE_PORT=5432
DATABASE_USER=<from Railway PostgreSQL>
DATABASE_PASSWORD=<from Railway PostgreSQL>
DATABASE_NAME=<from Railway PostgreSQL>
JWT_SECRET=<generate random 64 char string>
JWT_REFRESH_SECRET=<generate random 64 char string>
```

### Important (Features Won't Work Without These)
```bash
CLOUDINARY_CLOUD_NAME=<your cloudinary account>
CLOUDINARY_API_KEY=<your cloudinary key>
CLOUDINARY_API_SECRET=<your cloudinary secret>
FRONTEND_URL=<your frontend URL>
```

### Optional (Can Add Later)
```bash
REDIS_HOST=<if using Redis>
REDIS_PORT=6379
SMTP_HOST=<for email>
SMTP_PORT=587
SMTP_USER=<email user>
SMTP_PASS=<email password>
OPENAI_API_KEY=<for chatbot>
```

## 🚀 Deployment Steps

1. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Fix Railway deployment - use production mode"
   git push origin main
   ```

2. **Railway Auto-Deploy**
   - Railway will detect changes and start building
   - Monitor in Railway dashboard

3. **Watch Logs**
   - Look for: "🦷 Dental College API Server"
   - Should see: "Environment: production"
   - Should see: "Port: 8080"

4. **Test Endpoints**
   ```bash
   # Replace with your Railway URL
   curl https://your-app.railway.app/health
   curl https://your-app.railway.app/api/v1/
   ```

## 🐛 If Deployment Fails

### Check These First
1. **Database Connection**
   - Verify DATABASE_* variables match Railway PostgreSQL
   - Check if PostgreSQL service is running

2. **Environment Variables**
   - All required variables are set
   - No typos in variable names
   - Values are correct (no quotes needed in Railway UI)

3. **Build Logs**
   - Look for "npm run build" success
   - Check for TypeScript compilation errors

4. **Runtime Logs**
   - Look for specific error messages
   - Check for missing dependencies

### Common Error Messages

**"Cannot connect to database"**
→ Check DATABASE_* environment variables

**"CLOUDINARY_CLOUD_NAME is not defined"**
→ Add Cloudinary credentials (required for image uploads)

**"SIGTERM"**
→ Should be fixed now, but if it happens:
  - Check memory usage
  - Verify production mode is being used
  - Check for infinite loops or memory leaks

**"Port already in use"**
→ Railway handles this automatically, shouldn't happen

## ✅ Success Indicators

- ✅ Build completes without errors
- ✅ App starts and shows "🦷 Dental College API Server"
- ✅ Health endpoint responds: `/health`
- ✅ API responds: `/api/v1/`
- ✅ Swagger docs available (if NODE_ENV != production)

## 📝 Post-Deployment

1. **Update Frontend**
   - Set NEXT_PUBLIC_API_URL to Railway backend URL
   - Redeploy frontend

2. **Test Features**
   - Login to admin panel
   - Upload an image (tests Cloudinary)
   - Create an appointment (tests database)
   - Send a contact form (tests email if configured)

3. **Monitor**
   - Check Railway metrics
   - Watch for errors in logs
   - Monitor response times

## 🔗 Useful Railway Commands

```bash
# View logs
railway logs

# Connect to database
railway connect postgres

# Run command in Railway environment
railway run <command>

# Link local project to Railway
railway link
```

## 📞 Need Help?

If deployment still fails after following this checklist:
1. Check Railway logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure PostgreSQL service is running
4. Check Railway status page for outages
