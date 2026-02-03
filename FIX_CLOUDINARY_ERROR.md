# Fix: Cloudinary Upload Error

## ❌ Error You're Seeing

When trying to upload files, you get an **Internal Server Error** because Cloudinary credentials are not configured.

Backend logs show:
```
ERROR [ExceptionsHandler] Unknown API key your_api_key
```

## ✅ Solution (5 Minutes)

### Step 1: Sign Up for Cloudinary (Free)

1. Go to: **https://cloudinary.com**
2. Click **"Sign Up"** (or "Get Started for Free")
3. Create account with email or use Google/GitHub
4. Verify your email
5. You'll be redirected to your Dashboard

### Step 2: Get Your Credentials

On your Cloudinary Dashboard, you'll see a section called **"Account Details"** or **"Product Environment Credentials"**:

```
Cloud name: dxyz123abc
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz123456
```

**Copy these three values!** You'll need them in the next step.

### Step 3: Update Your .env File

1. Open the file: **`backend/.env`**

2. Find these lines (around line 40):
```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Replace with YOUR actual values from Cloudinary:
```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

4. **Save the file** (Ctrl+S or Cmd+S)

### Step 4: Restart Backend Server

The backend needs to reload the new configuration.

**If backend is running in terminal:**
- Press `Ctrl+C` to stop it
- Run `npm run start:dev` to start again

**If using VS Code/Kiro:**
- Stop the backend process
- Start it again

**Wait for this message:**
```
[Nest] Application successfully started
```

### Step 5: Test Upload

1. Go to: **http://localhost:3000/admin/media**
2. Click **"Upload Files"**
3. Select a small image (less than 5MB)
4. Click upload
5. ✅ Should work now!

## 🎯 What Changed

I've updated the media service to:
- ✅ Check if Cloudinary is configured before upload
- ✅ Show clear error message if credentials are missing
- ✅ Provide helpful error messages for different issues
- ✅ Log warnings on startup if credentials are not set

## 🔍 Verify Configuration

After updating `.env` and restarting, check the backend logs. You should see:

**Good (No warnings):**
```
[Nest] Application successfully started
```

**Bad (Needs configuration):**
```
⚠️  CLOUDINARY_CLOUD_NAME is not configured in .env file
⚠️  CLOUDINARY_API_KEY is not configured in .env file
⚠️  CLOUDINARY_API_SECRET is not configured in .env file
```

If you see warnings, double-check your `.env` file.

## 🆓 Cloudinary Free Tier

You get for FREE:
- **25GB** storage
- **25GB/month** bandwidth
- **25,000/month** transformations

This is enough for:
- ~5,000 high-quality images
- ~50 hours of video
- Thousands of visitors per month

## 🔧 Troubleshooting

### Still getting "Unknown API key" error?

**Check:**
1. Did you save the `.env` file?
2. Did you restart the backend server?
3. Are there any extra spaces in the credentials?
4. Did you copy the full API Secret (it's long)?

**Fix:**
- Open `backend/.env`
- Make sure credentials have no spaces before/after
- Make sure you copied complete values
- Save and restart backend

### "Invalid Cloudinary API credentials" error?

**This means:**
- Credentials are set but incorrect
- You might have copied them wrong

**Fix:**
1. Go back to Cloudinary Dashboard
2. Copy credentials again carefully
3. Update `backend/.env`
4. Restart backend

### "Invalid Cloudinary cloud name" error?

**This means:**
- Cloud name is wrong or has typo

**Fix:**
1. Check Cloudinary Dashboard for exact cloud name
2. Update `CLOUDINARY_CLOUD_NAME` in `backend/.env`
3. Restart backend

### Backend won't start after changes?

**Check:**
1. Make sure `.env` file syntax is correct
2. No extra quotes around values
3. No missing equals signs

**Example of CORRECT format:**
```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

**Example of WRONG format:**
```env
CLOUDINARY_CLOUD_NAME = "dxyz123abc"  ❌ (extra spaces and quotes)
CLOUDINARY_API_KEY:123456789012345    ❌ (colon instead of equals)
```

## 📸 Test Checklist

After configuration, test these:

- [ ] Upload small image (< 5MB) - Should succeed
- [ ] Upload large image (> 5MB) - Should show size error
- [ ] Upload small video (< 100MB) - Should succeed
- [ ] Upload large video (> 100MB) - Should show size error
- [ ] View uploaded files in media library
- [ ] View uploaded files in public gallery at `/gallery`
- [ ] Delete a file - Should remove from Cloudinary

## 📞 Need More Help?

### Documentation
- Quick Start: `SETUP_INSTRUCTIONS.md`
- Full Guide: `CLOUDINARY_MEDIA_SYSTEM.md`
- Status Report: `MEDIA_SYSTEM_FINAL_STATUS.md`

### Cloudinary Support
- Documentation: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com

### Common Questions

**Q: Do I need a credit card?**
A: No! The free tier doesn't require a credit card.

**Q: Will I be charged?**
A: Not unless you exceed the free tier limits (25GB storage, 25GB/month bandwidth).

**Q: Can I use a different cloud storage?**
A: The code is specifically for Cloudinary. To use something else (AWS S3, etc.), you'd need to modify the media service.

**Q: Where are my files stored?**
A: On Cloudinary's servers, not on your server. Only metadata is in your database.

**Q: Can I see my uploaded files on Cloudinary?**
A: Yes! Go to Cloudinary Dashboard → Media Library to see all uploaded files.

## ✨ After Configuration

Once configured, your media system will:
- ✅ Upload files to Cloudinary cloud
- ✅ Validate file sizes (5MB images, 100MB videos)
- ✅ Display in public gallery
- ✅ Manage from admin panel
- ✅ Scale automatically
- ✅ Deliver via fast CDN

**You're almost there! Just configure those credentials and you're good to go!** 🚀
