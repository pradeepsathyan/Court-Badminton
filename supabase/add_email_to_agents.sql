-- Add email column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS email TEXT;

-- Copy existing usernames (which are emails) to email column
UPDATE agents SET email = username WHERE email IS NULL;

-- Add unique constraint to email
ALTER TABLE agents ADD CONSTRAINT agents_email_key UNIQUE (email);

-- Make email not null
ALTER TABLE agents ALTER COLUMN email SET NOT NULL;
