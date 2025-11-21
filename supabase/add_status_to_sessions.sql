-- Add status column to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
