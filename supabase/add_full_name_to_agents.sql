-- Add full_name column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS full_name TEXT;
