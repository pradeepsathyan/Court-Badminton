-- Add organizer_note and price_per_player columns to sessions table

ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS organizer_note TEXT,
ADD COLUMN IF NOT EXISTS price_per_player DECIMAL(10, 2);
