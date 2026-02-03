# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `dental-college-website` (or your preferred name)
   - **Description**: Om Chabahil Dental Hospital Website
   - **Visibility**: Choose **Private** (recommended) or Public
   - **DO NOT** check "Initialize with README"
4. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/dental-college-website.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
If your GitHub username is `johndoe`, the command would be:
```bash
git remote add origin https://github.com/johndoe/dental-college-website.git
```

## Step 3: Verify

Go to your GitHub repository page and refresh. You should see all your files!

---

## Next: Deploy to Railway

Once your code is on GitHub, open `RAILWAY_DEPLOYMENT_STEPS.md` and follow from **Step 3** onwards.

---

## Troubleshooting

### Authentication Error
If you get an authentication error, you need to use a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Railway Deployment"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing, use:
   ```bash
   git push -u origin main
   ```
8. Username: your GitHub username
9. Password: paste the token (not your GitHub password!)

### Already Exists Error
If the repository already exists:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/dental-college-website.git
git push -u origin main
```
