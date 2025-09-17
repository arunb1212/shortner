-- Disable email verification in Supabase
-- Run this in your Supabase SQL Editor

-- Update auth settings to disable email confirmation
UPDATE auth.config 
SET email_confirmation_enabled = false;

-- Alternative: If the above doesn't work, you can also disable it in the Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Under "User Signups", uncheck "Enable email confirmations"
-- 3. Save the changes

-- Note: This will allow users to sign up without email verification
