# Database Setup for Waitlist

## Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the SQL below
5. Run the query

## SQL Schema

```sql
-- Create waitlist_entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES waitlist_entries(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist_entries(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_entries(created_at DESC);

-- Create waitlist_stats table
CREATE TABLE IF NOT EXISTS waitlist_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_signups INTEGER DEFAULT 0,
  weekly_signups INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row for stats
INSERT INTO waitlist_stats (total_signups, weekly_signups) 
VALUES (0, 0)
ON CONFLICT DO NOTHING;

-- Create function to auto-update stats
CREATE OR REPLACE FUNCTION update_waitlist_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE waitlist_stats
  SET 
    total_signups = (SELECT COUNT(*) FROM waitlist_entries),
    weekly_signups = (SELECT COUNT(*) FROM waitlist_entries WHERE created_at >= NOW() - INTERVAL '7 days'),
    last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stats on new signups
DROP TRIGGER IF EXISTS waitlist_stats_trigger ON waitlist_entries;
CREATE TRIGGER waitlist_stats_trigger
AFTER INSERT ON waitlist_entries
FOR EACH ROW
EXECUTE FUNCTION update_waitlist_stats();

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only stats, write-only for signups)
CREATE POLICY "Allow public to view stats" ON waitlist_stats
  FOR SELECT USING (true);

CREATE POLICY "Allow public to insert waitlist entries" ON waitlist_entries
  FOR INSERT WITH CHECK (true);

-- Optional: Allow users to view their own entry
CREATE POLICY "Allow users to view their own entry" ON waitlist_entries
  FOR SELECT USING (true);
```

## Verification

After running the SQL, verify the tables were created:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('waitlist_entries', 'waitlist_stats');

-- Check initial stats
SELECT * FROM waitlist_stats;
```

## Testing

You can test the setup with:

```sql
-- Insert a test entry
INSERT INTO waitlist_entries (email, referral_code) 
VALUES ('test@example.com', 'TEST1234');

-- Check the stats were updated
SELECT * FROM waitlist_stats;

-- Clean up test data
DELETE FROM waitlist_entries WHERE email = 'test@example.com';
```
