# Vercel Deployment Guide

## Step-by-Step Deployment

### 1. Go to Vercel
Open [https://vercel.com](https://vercel.com) in your browser

### 2. Sign In with GitHub
- Click **"Sign Up"** or **"Login"**
- Choose **"Continue with GitHub"**
- Authorize Vercel to access your GitHub account

### 3. Import Your Repository
- Click **"Add New..."** → **"Project"**
- Find your repository: **"Court-Batminton"**
- Click **"Import"**

### 4. Configure Project
**Framework Preset**: Vite (should auto-detect)

**Build Settings** (should be auto-filled):
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 5. ADD ENVIRONMENT VARIABLES (CRITICAL!)
Click **"Environment Variables"** section and add:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: (Copy from your `.env` file)

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: (Copy from your `.env` file)

⚠️ **IMPORTANT**: Without these, your app won't connect to the database!

### 6. Deploy
- Click **"Deploy"** button
- Wait 1-2 minutes for build to complete
- You'll see confetti when it's done! 🎉

### 7. Get Your Live URL
Vercel will give you a URL like:
```
https://court-batminton.vercel.app
```

### 8. Test Your Deployment
1. Click "Visit" to open your live site
2. Register a new account
3. Create a session
4. Test the shareable booking URL
5. Make sure everything works!

---

## Troubleshooting

**Build Failed?**
- Check that both environment variables are added
- Make sure there are no typos in variable names
- Variables must start with `VITE_`

**"Session not found" errors?**
- Environment variables are missing
- Go to: Project Settings → Environment Variables → Add them
- Redeploy: Deployments → Three dots → Redeploy

**Database connection errors?**
- Double-check your Supabase URL and key
- Make sure you ran the SQL schema in Supabase
- Verify RLS policies are enabled

---

## Post-Deployment

### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Automatic Deployments
Every time you push to GitHub, Vercel auto-deploys! 🚀

### Environment Variables Per Branch
You can have different variables for:
- Production (main branch)
- Preview (other branches)
- Development

---

## Your App is Live! 🎉

Share your session URLs globally:
```
https://your-app.vercel.app/booking/abc12345
```

Anyone in the world can now book badminton sessions!

---

## Need to Update Later?

### Push Changes to Git
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel automatically rebuilds and deploys! ✨

### Update Environment Variables
Project Settings → Environment Variables → Edit

Remember to redeploy after changing variables.

---

## Congratulations! 🏸

Your Court-Badminton app is now live and accessible worldwide!
