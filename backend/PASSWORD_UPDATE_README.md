# Password Update Documentation

## Summary
All local database user passwords have been updated to: **Admin@123**

## Files Updated

### 1. Database Initialization Files
- `backend/database/init.sql` - Main initialization script
- `backend/database/init.sql.backup` - Backup initialization script
- `backend/local_data.sql` - Local data dump

### 2. New Files Created
- `backend/database/update_passwords.sql` - SQL script to update existing database passwords
- `backend/update-passwords.bat` - Windows batch script to run the update

## Updated User Accounts

The following user accounts now have the password **Admin@123**:

1. **superadmin@omchabahildental.com.np** - Super Administrator
2. **admin@premierdentalcollege.edu** - System Administrator  
3. **admin@omchabahildental.com.np** - Admin User
4. **staff@omchabahildental.com.np** - Staff User
5. **admin@dental.com** - Super Admin

## How to Apply Changes

### For New Database Setup
The new password will be automatically applied when you run the initialization scripts.

### For Existing Database
Run one of the following commands:

#### Option 1: Using the batch script (Windows)
```bash
cd backend
update-passwords.bat
```

#### Option 2: Using psql directly
```bash
cd backend
psql -h localhost -p 5432 -U postgres -d dental_db -f database/update_passwords.sql
```

#### Option 3: Manual SQL execution
Connect to your database and run:
```sql
UPDATE users 
SET password = '$2b$10$ikUlxQ8UQd4aDIU2jRqoBOGIhgEgc7INYc4jjPMOqSQKP63PxqgNe',
    updated_at = NOW()
WHERE email IN (
  'superadmin@omchabahildental.com.np',
  'admin@premierdentalcollege.edu',
  'admin@omchabahildental.com.np',
  'staff@omchabahildental.com.np',
  'admin@dental.com'
);
```

## Password Hash Details

- **Plain Text Password**: Admin@123
- **Bcrypt Hash**: $2b$10$ikUlxQ8UQd4aDIU2jRqoBOGIhgEgc7INYc4jjPMOqSQKP63PxqgNe
- **Bcrypt Rounds**: 10

## Security Notes

⚠️ **Important**: This password is for local development only. For production environments:
1. Use strong, unique passwords for each user
2. Never commit passwords or hashes to version control
3. Use environment variables for sensitive data
4. Implement proper password policies
5. Enable two-factor authentication where possible

## Testing the Update

After applying the changes, test login with:
- Email: Any of the accounts listed above
- Password: Admin@123

## Rollback

If you need to rollback, you can restore from your database backup or use the old password hashes from your git history.
