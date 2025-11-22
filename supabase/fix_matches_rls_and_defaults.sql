-- Fix RLS policies and player defaults for custom auth

-- 1. Change default is_waiting to true
ALTER TABLE players ALTER COLUMN is_waiting SET DEFAULT true;

-- 2. Update existing players to be waiting (reset state)
UPDATE players SET is_waiting = true WHERE is_waiting IS NULL OR is_waiting = false;

-- 3. Fix RLS policies for Players
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Session owner can manage players" ON players;
-- Add permissive policy (since we use custom auth and auth.uid() is null)
CREATE POLICY "Allow all operations on players" ON players
    FOR ALL USING (true) WITH CHECK (true);

-- 4. Fix RLS policies for Matches
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Session owner can manage matches" ON matches;
-- Add permissive policy
CREATE POLICY "Allow all operations on matches" ON matches
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Fix RLS policies for Sessions (just in case)
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON sessions;

-- Add permissive policies
CREATE POLICY "Allow all operations on sessions" ON sessions
    FOR ALL USING (true) WITH CHECK (true);
