# Railway Deployment Guide - Zero Data Loss

## ✅ Current Setup Analysis

Your application is **already using PostgreSQL** locally:
- ✅ PostgreSQL is running on your machine
- ✅ Backend is configured for PostgreSQL (not SQLite)
- ✅ You have data in your local PostgreSQL database
- ❌ Docker is NOT currently being used

## ⚠️ CRITICAL: Data Preservation Steps

Since you're already using PostgreSQL, we need to export your current database and import it to Railway's PostgreSQL.

## Pre-Deployment: Backup Your Current PostgreSQL Data

### Step 1: Export Your Current Database

First, find your PostgreSQL connection details. Check if you have a `.env` file:

```bash
cd backend
type .env
```

If you don't have a `.env` file, your app is using the defaults from `app.module.ts`:
- Host: `localhost`
- Port: `5432`
- User: `dental_user`
- Password: `dental_password`
- Database: `dental_db`

### Step 2: Create Database Backup

**Option A: Using pg_dump (Recommended)**

```bash
# Create backups folder
mkdir backups

# Export your database to SQL file
pg_dump -h localhost -p 5432 -U dental_user -d dental_db -F p -f backups/dental_db_backup.sql

# When prompted, enter password: dental_password
```

**Option B: Using pgAdmin or DBeaver**

1. Open pgAdmin or DBeaver
2. Connect to your local PostgreSQL database
3. Right-click on `dental_db` → Backup/Export
4. Save as `backups/dental_db_backup.sql`

### Step 3: Verify Backup

```bash
# Check if backup file was created
dir backups
```

---

## Railway Deployment Steps

### 1. Prepare Your Repository

Ensure your code is in a Git repository:
```bash
git init
git add .
git commit -m "Prepare for Railway deployment"
```

Push to GitHub:
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### 3. Set Up Services

You need to create **3 services**:

#### **Service 1: PostgreSQL Database**

1. In your Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will provision it automatically
3. Note: Railway provides these environment variables automatically:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

#### **Service 2: Backend (NestJS API)**

1. Click **"New"** → **"GitHub Repo"** → Select your repo
2. **Settings** → **Root Directory**: `backend`
3. **Settings** → **Build Command**: `npm install && npm run build`
4. **Settings** → **Start Command**: `node dist/main`

**Environment Variables for Backend:**
```env
NODE_ENV=production
PORT=3001

# Database (Reference the PostgreSQL service)
DATABASE_HOST=${{Postgres.PGHOST}}
DATABASE_PORT=${{Postgres.PGPORT}}
DATABASE_USER=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
DATABASE_NAME=${{Postgres.PGDATABASE}}

# JWT Secrets (Generate strong secrets!)
JWT_SECRET=<GENERATE_STRONG_SECRET_HERE>
JWT_REFRESH_SECRET=<GENERATE_ANOTHER_STRONG_SECRET>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (Your actual credentials)
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret

# Email (Use a real SMTP service like SendGrid, Mailgun, or Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@premierdentalcollege.edu

# OpenAI
OPENAI_API_KEY=your_actual_openai_key

# Frontend URL (will be set after frontend deployment)
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

**To generate strong secrets:**
```bash
# Run this in your terminal to generate random secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### **Service 3: Frontend (Next.js)**

1. Click **"New"** → **"GitHub Repo"** → Select your repo
2. **Settings** → **Root Directory**: `frontend`
3. **Settings** → **Build Command**: `npm install && npm run build`
4. **Settings** → **Start Command**: `npm start`

**Environment Variables for Frontend:**
```env
# API Configuration (Reference the backend service)
NEXT_PUBLIC_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_SITE_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dental_uploads

# Google Maps (if you have it)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Feature Flags
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_VIRTUAL_TOUR=true
```

### 4. Import Your Data to Railway PostgreSQL

After your backend is deployed and Railway PostgreSQL is running:

**Option A: Using Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Import your backup
railway run psql $DATABASE_URL < backups/dental_db_backup.sql
```

**Option B: Using pgAdmin or DBeaver**

1. Get your PostgreSQL connection string from Railway dashboard:
   - Go to your PostgreSQL service
   - Click "Connect" tab
   - Copy the connection details
2. Open pgAdmin or DBeaver
3. Create a new connection with Railway's credentials
4. Right-click on the database → Restore/Import
5. Select your `backups/dental_db_backup.sql` file

**Option C: Using psql Command Directly**

```bash
# Get connection string from Railway dashboard
# Format: postgresql://user:password@host:port/database

psql "postgresql://user:password@host:port/database" < backups/dental_db_backup.sql
```

---

## Post-Deployment Checklist

- [ ] All 3 services are running (PostgreSQL, Backend, Frontend)
- [ ] Backend can connect to PostgreSQL
- [ ] Frontend can connect to Backend
- [ ] Data has been imported successfully
- [ ] Test login functionality
- [ ] Test creating a new appointment
- [ ] Test image uploads (Cloudinary)
- [ ] Test all critical features

---

## Important Configuration Changes Needed

### 1. Update Backend Database Configuration

**File: `backend/src/app.module.ts`** (or wherever TypeORM is configured)

Make sure it uses PostgreSQL in production:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres', // Changed from 'sqlite'
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // NEVER true in production!
  logging: process.env.NODE_ENV === 'development',
}),
```

### 2. Update Frontend Next.js Config

**File: `frontend/next.config.js`**

Add standalone output for Docker:

```javascript
const nextConfig = {
  output: 'standalone', // Add this line
  images: {
    // ... rest of your config
  },
  // ... rest of your config
};
```

---

## Troubleshooting

### Backend won't start
- Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure DATABASE_HOST points to PostgreSQL service

### Frontend can't reach Backend
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check CORS settings in backend
- Ensure backend FRONTEND_URL includes frontend domain

### Data import fails
- Check SQL syntax compatibility (SQLite → PostgreSQL)
- Verify table schemas match
- Check for foreign key constraints

---

## Cost Estimation

Railway pricing (as of 2024):
- **Hobby Plan**: $5/month + usage
- **PostgreSQL**: ~$5-10/month
- **Backend + Frontend**: ~$5-15/month depending on traffic

**Total estimated cost**: $15-30/month

---

## Alternative: Keep SQLite (Not Recommended for Production)

If you want to keep SQLite temporarily:
1. Mount a volume in Railway for persistent storage
2. This is NOT recommended for production
3. PostgreSQL is much better for concurrent users

---

## Need Help?

If you encounter issues:
1. Check Railway logs: Dashboard → Service → Deployments → Logs
2. Railway Discord: https://discord.gg/railway
3. Railway Docs: https://docs.railway.app
