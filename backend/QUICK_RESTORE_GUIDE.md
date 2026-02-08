# 🚀 Quick Restore to Railway - 3 Steps

## ✅ Your Backup is Ready!

**Files created:**
- `backups/dental_db_backup_2026-02-08.sql` (SQL format)
- `backups/dental_db_export_2026-02-08.json` (JSON format)

**Data included:** 172 records across 12 tables

---

## 🎯 Easiest Method (Recommended)

### Step 1: Get Railway Database URL

1. Go to **Railway Dashboard**
2. Click on your **PostgreSQL** service
3. Go to **Variables** tab
4. Copy the **DATABASE_URL** value

Example format:
```
postgresql://postgres:password@host.railway.app:5432/railway
```

### Step 2: Run Restore Script

```bash
cd backend
node scripts/clean-and-restore-railway.js
```

### Step 3: Follow Prompts

1. Paste your Railway database URL
2. Review existing tables (if any)
3. Type **YES** to confirm
4. Wait for completion ✅

---

## ❓ Do I Need to Drop the Database?

**NO!** The script automatically:
- ✅ Deletes existing data
- ✅ Keeps table structure (schema)
- ✅ Imports fresh data
- ✅ No manual cleanup needed

---

## 🔐 Admin Login (After Restore)

**Email:** `admin@omchabahildental.com.np`  
**Password:** `Admin@123`

**OR**

**Email:** `admin@premierdentalcollege.edu`  
**Password:** `Admin@123`

---

## 📊 What Gets Restored

| Item | Count |
|------|-------|
| Users | 3 |
| Departments | 9 |
| Services | 8 |
| Doctors | 8 |
| Doctor Schedules | 48 |
| Blog Posts | 3 |
| Testimonials | 6 |
| Academic Programs | 10 |
| Page Sections | 40 |
| Media Files | 21 |
| Settings | 15 |
| Clinic Info | 1 |

**Total: 172 records**

---

## 🛠️ Alternative Methods

### Method 2: SQL Restore with Options

```bash
node scripts/restore-sql-to-railway.js
```

- Choose backup file
- Option to clean first
- Uses PostgreSQL native format

### Method 3: JSON Import

```bash
node scripts/import-data-json.js
```

- Pure Node.js (no psql required)
- Cross-platform compatible
- Good for debugging

---

## ⚠️ Troubleshooting

**"Connection refused"**
- Check Railway database is running
- Verify URL is correct

**"Authentication failed"**
- Copy DATABASE_URL again from Railway
- Ensure no extra spaces

**"Table does not exist"**
- Your Railway app needs to run first
- TypeORM will create tables automatically
- Then run the restore script

**"Duplicate key error"**
- Data already exists
- Script will skip duplicates automatically

---

## 🎉 Success Checklist

After restore completes:

- [ ] Login to admin panel works
- [ ] All departments visible
- [ ] Doctors list shows 8 doctors
- [ ] Services page loads
- [ ] Blog posts appear
- [ ] Settings are configured

---

## 📞 Need Help?

Check the detailed guide: `BACKUP_AND_RESTORE_GUIDE.md`

**Common Issues:**
1. Make sure Railway PostgreSQL is active
2. Verify your backend app has run at least once (to create tables)
3. Check DATABASE_URL format is correct
4. Ensure network access to Railway

---

**Ready to restore?** Run this command:

```bash
cd backend && node scripts/clean-and-restore-railway.js
```

🚀 **Your production database will be ready in under 1 minute!**
