# Supabase Setup Guide

## Step 1: Create Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (free)
3. Create a new project:
   - Choose a project name (e.g., "Court-Badminton")
   - Set a strong database password (save it!)
   - Select a region closest to you
   - Wait for the project to be created (~2 minutes)

## Step 2: Run Database Schema

1. In your Supabase project dashboard, click on the **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** (bottom right)
6. You should see "Success. No rows returned" - this is normal!

## Step 3: Verify Tables Were Created

1. Click on **Table Editor** in the left sidebar
2. You should see these tables:
   - agents
   - sessions
   - players
   - matches
   - saved_players

## Step 4: Get Your API Credentials

1. Click on **Settings** (gear icon) in the left sidebar
2. Click on **API**
3. Find and copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 5: Configure Your Project

1. In your project root, create a file named `.env`
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 6: Install Dependencies

Run this command in your terminal:
```bash
npm install @supabase/supabase-js bcryptjs
```

## Step 7: Test the Connection

After completing the frontend migration code, you can test by:
1. Starting the dev server: `npm run dev`
2. Registering a new user
3. Checking the Supabase dashboard to see if the user appears in the `agents` table

## Important Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- The anon key is safe to use in the frontend (it's rate-limited and RLS-protected)
- Row Level Security (RLS) policies ensure users can only modify their own data
- The database has automatic slug generation for shareable session URLs

## Troubleshooting

**Error: "relation does not exist"**
- Make sure you ran the entire `schema.sql` file in the SQL Editor

**Error: "new row violates row-level security policy"**
- This means RLS is working correctly but you're not authenticated
- Make sure you're logged in before trying to create/modify data

**Can't connect to Supabase**
- Double-check your `.env` file has the correct URL and key
- Make sure you're using `VITE_` prefix for Vite environment variables
- Restart your dev server after changing `.env`
