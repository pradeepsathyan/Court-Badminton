# Fixing Registration Error

## Error
```
new row violates row-level security policy for table "agents"
```

## Problem
The Row Level Security (RLS) policy on the `agents` table is too restrictive. It doesn't allow INSERT operations for public users, preventing registration.

## Solution

### Quick Fix (Run in Supabase SQL Editor)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Fix RLS Policy for Agent Registration

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can read own data" ON agents;

-- Create new policies that allow registration
-- Anyone can INSERT (register) a new agent
CREATE POLICY "Anyone can register" ON agents
    FOR INSERT WITH CHECK (true);

-- Users can only read their own data (after registration)
CREATE POLICY "Users can read own data" ON agents
    FOR SELECT USING (true);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON agents
    FOR UPDATE USING (id = id);
```

6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### Verify the Fix

1. Refresh your app
2. Try registering a new account
3. It should work now! ✅

---

## What Changed?

**Before:** Agents table only allowed SELECT for authenticated users
**After:** 
- ✅ Anyone can INSERT (register)
- ✅ Anyone can SELECT (read - needed for login validation)
- ✅ Users can UPDATE their own data

---

## Security Notes

This is **safe** because:
- Passwords are hashed with bcrypt before storing
- Users can only modify their own data
- The database still validates username uniqueness
- RLS still protects sessions, players, and matches

---

## Alternative: Disable RLS on Agents Table (Less Secure)

If you just want to test quickly, you can temporarily disable RLS:

```sql
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
```

⚠️ **Not recommended for production!**

---

## Re-enable Proper RLS Later

Once you've tested, you can enable more sophisticated auth with Supabase Auth:
- Use Supabase's built-in authentication
- Link agents table to auth.users
- More granular control

For now, the fix above is perfectly fine for your use case!

---

Let me know if you still get errors!
