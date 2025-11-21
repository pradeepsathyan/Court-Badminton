-- Add court_numbers field to sessions table
-- Run this SQL in Supabase SQL Editor

ALTER TABLE sessions 
ADD COLUMN court_numbers TEXT DEFAULT NULL;

-- This will store comma-separated court numbers like "5,6,7,8"
-- If NULL, we'll use default numbering (1, 2, 3, 4...)

COMMENT ON COLUMN sessions.court_numbers IS 'Comma-separated actual court numbers (e.g., "5,6,7,8"). If NULL, uses default 1-based numbering.';
