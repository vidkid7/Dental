# Railway Deployment - Step by Step Guide

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Railway account (sign up at https://railway.app)
- [ ] Your code pushed to GitHub
- [ ] Cloudinary account credentials
- [ ] OpenAI API key (if using chatbot)

---

## 🚀 STEP 1: Backup Your Current Database

### 1.1 Create Backup Folder
```bash
mkdir backups
```

### 1.2 Export Your PostgreSQL Database
```bash
pg_dump -h localhost -p 5432 -U dental_user -d dental_db -F p -f backups/dental_db_backup.sql
```
**Password when prompted:** `dental_password`

✅ **Verify:** Check that `backups/dental_db_backup.sql` file was created

---

## 🚀 STEP 2: Prepare Your Code for GitHub

### 2.1 Initialize Git (if not already done)
```bash
git init
```

### 2.2 Stage All Changes
```bash
git add .
```

### 2.3 Commit Your Code
```bash
git commit -m "Prepare for Railway deployment"
```

### 2.4 Create GitHub Repository
1. Go to https://github.com
2. Click **"New repository"**
3. Name it: `dental-college-website`
4. Keep it **Private** (recommended)
5. **DO NOT** initialize with README
6. Click **"Create repository"**

### 2.5 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/dental-college-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

✅ **Verify:** Your code should now be visible on GitHub

---

## 🚀 STEP 3: Create Railway Project

### 3.1 Sign Up / Login to Railway
1. Go to https://railway.app
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with your GitHub account

### 3.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Click **"Configure GitHub App"**
4. Give Railway access to your repository
5. Select your `dental-college-website` repository

---

## 🚀 STEP 4: Add PostgreSQL Database

### 4.1 Add Database Service
1. In your Railway project dashboard
2. Click **"New"** button
3. Select **"Database"**
4. Choose **"PostgreSQL"**
5. Wait for it to provision (takes ~30 seconds)

✅ **Verify:** You should see a PostgreSQL service card in your dashboard

---

## 🚀 STEP 5: Deploy Backend Service

### 5.1 Add Backend Service
1. Click **"New"** button
2. Select **"GitHub Repo"**
3. Choose your repository
4. Railway will detect it automatically

### 5.2 Configure Backend Settings
1. Click on the backend service card
2. Go to **"Settings"** tab
3. Set **"Root Directory"**: `backend`
4. Set **"Build Command"**: `npm install && npm run build`
5. Set **"Start Command"**: `npm run start:prod`

### 5.3 Add Backend Environment Variables
1. Click on **"Variables"** tab
2. Click **"New Variable"** and add each of these:

```env
NODE_ENV=production
PORT=3001

# Database (Reference PostgreSQL service)
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_USER=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_NAME=${{Postgres.PGDATABASE}}

# JWT Secrets (Generate new ones!)
JWT_SECRET=your-super-secret-jwt-key-CHANGE-THIS
JWT_REFRESH_SECRET=your-super-secret-refresh-key-CHANGE-THIS
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (Your actual credentials)
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret

# Email (Use real SMTP - Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@premierdentalcollege.edu

# OpenAI (if using chatbot)
OPENAI_API_KEY=your_openai_api_key

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

**IMPORTANT:** 
- Replace `your_actual_cloud_name`, `your_actual_api_key`, etc. with your real values
- Generate strong JWT secrets (see below)

### 5.4 Generate Strong JWT Secrets
Open a terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run this twice to get two different secrets for JWT_SECRET and JWT_REFRESH_SECRET.

### 5.5 Deploy Backend
1. Click **"Deploy"** button
2. Wait for deployment to complete (~2-3 minutes)
3. Check the **"Deployments"** tab for logs

✅ **Verify:** Backend should show "Active" status with a green checkmark

### 5.6 Get Backend URL
1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://your-backend.up.railway.app`)

---

## 🚀 STEP 6: Deploy Frontend Service

### 6.1 Add Frontend Service
1. Click **"New"** button
2. Select **"GitHub Repo"**
3. Choose your repository again

### 6.2 Configure Frontend Settings
1. Click on the frontend service card
2. Go to **"Settings"** tab
3. Set **"Root Directory"**: `frontend`
4. Set **"Build Command"**: `npm install && npm run build`
5. Set **"Start Command"**: `npm start`

### 6.3 Add Frontend Environment Variables
1. Click on **"Variables"** tab
2. Add these variables:

```env
# API Configuration (Use your backend URL from Step 5.6)
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_SITE_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Cloudinary (Same as backend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dental_uploads

# Google Maps (if you have it)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Feature Flags
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_VIRTUAL_TOUR=true
```

Replace `https://your-backend.up.railway.app` with your actual backend URL.

### 6.4 Deploy Frontend
1. Click **"Deploy"** button
2. Wait for deployment (~2-3 minutes)

✅ **Verify:** Frontend should show "Active" status

### 6.5 Get Frontend URL
1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://your-frontend.up.railway.app`)

---

## 🚀 STEP 7: Update Backend CORS Settings

### 7.1 Add Frontend URL to Backend
1. Go back to your **Backend service**
2. Click **"Variables"** tab
3. Add a new variable:

```env
FRONTEND_URL=https://your-frontend.up.railway.app
```

Replace with your actual frontend URL from Step 6.5.

### 7.2 Redeploy Backend
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment

---

## 🚀 STEP 8: Import Your Database

### 8.1 Install Railway CLI
```bash
npm install -g @railway/cli
```

### 8.2 Login to Railway
```bash
railway login
```
This will open a browser window. Authorize the CLI.

### 8.3 Link to Your Project
```bash
railway link
```
Select your project from the list.

### 8.4 Import Database Backup
```bash
railway run psql $DATABASE_URL < backups/dental_db_backup.sql
```

✅ **Verify:** You should see INSERT statements executing

---

## 🚀 STEP 9: Test Your Deployment

### 9.1 Test Backend
1. Open your backend URL: `https://your-backend.up.railway.app`
2. You should see API information
3. Try: `https://your-backend.up.railway.app/api/v1/health`

### 9.2 Test Frontend
1. Open your frontend URL: `https://your-frontend.up.railway.app`
2. Your website should load
3. Try logging in with admin credentials
4. Test booking an appointment
5. Test uploading images

---

## 🚀 STEP 10: Configure Custom Domain (Optional)

### 10.1 Add Custom Domain to Frontend
1. Go to Frontend service → **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Enter your domain: `www.yourdentalcollege.com`
4. Follow DNS configuration instructions

### 10.2 Add Custom Domain to Backend
1. Go to Backend service → **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Enter: `api.yourdentalcollege.com`
4. Update frontend `NEXT_PUBLIC_API_URL` to use this domain

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is running and accessible
- [ ] Database data has been imported
- [ ] Can login to admin panel
- [ ] Can create appointments
- [ ] Can upload images (Cloudinary working)
- [ ] Email notifications working (if configured)
- [ ] All pages load correctly

---

## 🔧 Troubleshooting

### Backend Won't Start
1. Check **"Deployments"** → **"View Logs"**
2. Look for errors in the logs
3. Verify all environment variables are set correctly
4. Check DATABASE_HOST is using `${{Postgres.PGHOST}}`

### Frontend Can't Connect to Backend
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend CORS settings (FRONTEND_URL)
3. Make sure backend is running (green checkmark)

### Database Connection Failed
1. Verify DATABASE_* variables are using `${{Postgres.*}}` format
2. Check PostgreSQL service is running
3. Try redeploying backend

### Images Not Uploading
1. Verify Cloudinary credentials are correct
2. Check backend logs for Cloudinary errors
3. Test Cloudinary credentials locally first

---

## 💰 Estimated Costs

Railway Pricing (as of 2024):
- **Hobby Plan**: $5/month + usage
- **PostgreSQL**: ~$5-10/month
- **Backend + Frontend**: ~$5-15/month

**Total**: ~$15-30/month depending on traffic

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

---

## 🎉 Congratulations!

Your dental college website is now live on Railway! 🚀

**Next Steps:**
1. Share the URL with your team
2. Set up monitoring and alerts
3. Configure backups
4. Add custom domain
5. Set up SSL certificate (automatic with Railway)
