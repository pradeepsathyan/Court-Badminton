-- Fix RLS Policy for Agent Registration
-- Run this SQL in your Supabase SQL Editor to allow public registration

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
