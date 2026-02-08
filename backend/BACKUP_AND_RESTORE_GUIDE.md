# 💾 Database Backup & Restore Guide

## 📦 Available Backup Files

Your database has been backed up in **TWO formats**:

### 1. SQL Backup (PostgreSQL native)
- **File:** `backups/dental_db_backup_2026-02-08.sql`
- **Size:** ~0.09 MB
- **Format:** PostgreSQL SQL dump
- **Best for:** Direct PostgreSQL restore

### 2. JSON Export (Cross-platform)
- **File:** `backups/dental_db_export_2026-02-08.json`
- **Size:** ~0.10 MB
- **Format:** JSON with all table data
- **Best for:** Node.js import script, data inspection

---

## 🚀 Method 1: Clean and Restore to Railway (RECOMMENDED)

### ⭐ Best Option: Automated Clean + Restore

This script will **automatically clean existing data** and restore your backup:

```bash
cd backend
node scripts/clean-and-restore-railway.js
```

**What it does:**
1. ✅ Connects to Railway database
2. ✅ Shows existing tables
3. ✅ Cleans all data (keeps schema)
4. ✅ Imports fresh data from backup
5. ✅ Provides admin credentials

### Option B: SQL Restore with Cleaning

```bash
cd backend
node scripts/restore-sql-to-railway.js
```

**Features:**
- Interactive backup file selection
- Option to clean data before restore
- Uses PostgreSQL native SQL backup
- Handles conflicts automatically

---

## 📥 Method 2: Import JSON Data to Railway

### Step 1: Prepare Railway Environment

Create `backend/.env.railway` file:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### Step 2: Run Import Script

```bash
cd backend
node scripts/import-data-json.js
```

### Step 3: Follow Prompts

1. Select export file (or press Enter for latest)
2. Choose database:
   - Option 1: Railway (uses .env.railway)
   - Option 2: Local (uses .env)
   - Option 3: Custom URL
3. Type "YES" to confirm

---

## 📊 What's Included in the Backup

Your backup contains **ALL** production-ready data:

| Table | Records | Description |
|-------|---------|-------------|
| **users** | 3 | Admin accounts |
| **settings** | 15 | Site configuration |
| **departments** | 9 | Dental departments |
| **services** | 8 | Dental services |
| **doctors** | 8 | Doctor profiles |
| **doctor_availabilities** | 48 | Doctor schedules |
| **clinics** | 1 | Clinic information |
| **testimonials** | 6 | Patient testimonials |
| **blog_posts** | 3 | Blog articles |
| **academic_programs** | 10 | Educational programs |
| **page_content** | 40 | Website content sections |
| **media_files** | 21 | Images and media |

**Total Records:** 172

---

## 🔐 Admin Credentials (After Restore)

After restoring to Railway, use these credentials:

**Super Admin:**
- Email: `admin@premierdentalcollege.edu`
- Password: `Admin@123`

**Admin:**
- Email: `admin@omchabahildental.com.np`
- Password: `Admin@123`

---

## 🛠️ Backup Scripts Reference

### Create New Backups

```bash
# SQL backup (requires pg_dump)
node scripts/backup-database.js

# JSON export (pure Node.js)
node scripts/export-data-json.js
```

### Restore/Import

```bash
# Restore SQL backup
node scripts/restore-to-railway.js

# Import JSON data
node scripts/import-data-json.js
```

### Analyze Database

```bash
# Check local database
node scripts/analyze-local-database.js

# Get admin credentials
node scripts/get-admin-credentials.js
```

---

## ⚠️ Important Notes

### Do You Need to Drop the Database?

**NO!** You don't need to drop the database. The scripts handle this for you:

1. **clean-and-restore-railway.js** - Automatically deletes data, keeps schema
2. **restore-sql-to-railway.js** - Offers to clean data before restore
3. **import-data-json.js** - Deletes existing data before import

### Before Restoring to Railway:

1. **Backup Railway database first** (if it has data you want to keep)
2. **Verify Railway PostgreSQL is running**
3. **Check connection URL is correct**
4. **Ensure you have network access to Railway**

### After Restoring:

1. **Test admin login** with provided credentials
2. **Verify all data** is present in Railway dashboard
3. **Check API endpoints** are working
4. **Test frontend** connection to Railway backend

### Troubleshooting:

**If restore fails:**
- Check database URL format: `postgresql://user:pass@host:port/db`
- Ensure Railway PostgreSQL is active
- Verify network connectivity
- Check for SSL requirements (add `?sslmode=require` if needed)

**If import fails:**
- Check table schemas match
- Verify enum types exist (media_files_type_enum)
- Run schema migrations first if needed

---

## 🎯 Quick Start for Railway Deployment

### Complete Workflow (EASIEST):

1. **Get Railway Database URL:**
   - Go to Railway Dashboard
   - Click on PostgreSQL service
   - Go to Variables tab
   - Copy `DATABASE_URL`

2. **Run the automated restore:**
   ```bash
   cd backend
   node scripts/clean-and-restore-railway.js
   ```

3. **Enter Railway URL when prompted**

4. **Type "YES" to confirm**

5. **Done!** 🎉
   - All data cleaned and restored
   - Admin credentials displayed
   - Ready for production

### Alternative: Manual psql Command

If you prefer manual control:

```bash
# Clean first (optional but recommended)
psql "YOUR_RAILWAY_URL" -c "DELETE FROM doctor_availabilities; DELETE FROM doctors; DELETE FROM services; DELETE FROM departments; DELETE FROM blog_posts; DELETE FROM testimonials; DELETE FROM page_content; DELETE FROM media_files; DELETE FROM academic_programs; DELETE FROM clinics; DELETE FROM settings; DELETE FROM users;"

# Then restore
psql "YOUR_RAILWAY_URL" < backend/backups/dental_db_backup_2026-02-08.sql
```

---

## 📞 Support

If you encounter issues:
1. Check the error messages carefully
2. Verify database connection strings
3. Ensure PostgreSQL version compatibility
4. Check Railway service logs

---

**Last Updated:** February 8, 2026
**Database Version:** dental_db
**Backup Date:** 2026-02-08
