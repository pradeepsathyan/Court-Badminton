# Git Setup and GitHub Push Guide

## Issue
Git commands are not recognized in PowerShell. This usually means Git needs to be in your PATH or you need to restart your terminal.

## Solution: Use VS Code's Source Control

VS Code has built-in Git support. Here's how to push your code:

### Step 1: Initialize Repository (VS Code)
1. Open the **Source Control** panel (Ctrl+Shift+G)
2. Click "**Initialize Repository**"
3. VS Code will create a Git repository

### Step 2: Stage All Files
1. In Source Control panel, you'll see all changed files
2. Click the **+** icon next to "Changes" to stage all files
3. Or click **✓** next to each file to stage individually

### Step 3: Commit
1. Type a commit message in the text box at the top:
   ```
   Initial commit: Court-Badminton app with Supabase database
   ```
2. Click the **✓ checkmark** button (or Ctrl+Enter)

### Step 4: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Repository name: `Court-Batminton` (or your preferred name)
4. Keep it **Public** (or Private if you prefer)
5. **Do NOT** initialize with README (we already have code)
6. Click **"Create repository"**

### Step 5: Add Remote and Push
GitHub will show you commands. Copy the repository URL (ends with `.git`)

In VS Code:
1. Open terminal (Ctrl+`)
2. Run these commands one by one:
   ```bash
   git remote add origin https://github.com/pradeepsathyan/Court-Batminton.git
   git branch -M main
   git push -u origin main
   ```

**OR** if VS Code shows a "Publish to GitHub" button, just click it!

---

## Alternative: Use Git Bash

If Git commands don't work in PowerShell:

1. Right-click in the project folder → **Git Bash Here**
2. Run these commands:
   ```bash
   git config user.name "pradeepsathyan"
   git config user.email "pradeepsathyan@gmail.com"
   git init
   git add .
   git commit -m "Initial commit: Court-Badminton app with Supabase database"
   git branch -M main
   git remote add origin https://github.com/pradeepsathyan/YOUR-REPO-NAME.git
   git push -u origin main
   ```

---

## After Pushing to GitHub

Once your code is on GitHub, you're ready to deploy to Vercel!

### Deploy to Vercel (Next Step)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "**Add New**" → "**Project**"
4. Import your `Court-Batminton` repository
5. **Important**: Add Environment Variables:
   - `VITE_SUPABASE_URL` = (your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)
6. Click **Deploy**!

Vercel will give you a live URL like: `https://court-batminton.vercel.app`

---

## Quick Checklist

- [ ] Files committed to local Git
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Deployed to Vercel with environment variables
- [ ] Tested live deployment

---

## Need Help?

Let me know:
- Which step you're on
- Any error messages you see
- Whether you prefer VS Code or Git Bash

I'll guide you through it!
