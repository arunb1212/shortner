-- Create the urls table
CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  long_url TEXT NOT NULL,
  short_code VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicks INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create an index on short_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read URLs (for redirects)
CREATE POLICY "Allow public read access" ON urls
  FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert URLs
CREATE POLICY "Allow authenticated users to insert" ON urls
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows users to update their own URLs
CREATE POLICY "Allow users to update own URLs" ON urls
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own URLs
CREATE POLICY "Allow users to delete own URLs" ON urls
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set user_id
CREATE TRIGGER set_user_id_trigger
  BEFORE INSERT ON urls
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();
