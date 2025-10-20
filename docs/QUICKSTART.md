# 🎯 Quick Start Guide - Waitlist Implementation

## TL;DR - 3 Steps to Launch

### 1️⃣ **Database Setup** (5 minutes)
```bash
# Open Supabase SQL Editor
https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/editor

# Copy & run SQL from:
docs/database-setup.md
```

### 2️⃣ **Environment Setup** (2 minutes)
```bash
# Get your Supabase credentials
https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/settings/api

# Create .env.local
NEXT_PUBLIC_SUPABASE_URL=https://eqdysivaaharkwucvnep.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-from-dashboard
```

### 3️⃣ **Test & Launch** (3 minutes)
```bash
# Run the setup script
./scripts/setup-waitlist.sh

# Or manually:
npm run dev

# Visit: http://localhost:3000
# Submit test email
# Verify in Supabase dashboard
```

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Supabase Dashboard** | https://supabase.com/dashboard/project/eqdysivaaharkwucvnep |
| **SQL Editor** | https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/editor |
| **API Settings** | https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/settings/api |
| **Table Editor** | https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/editor |

---

## 📝 SQL Script (Copy & Paste)

```sql
-- Create tables
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES waitlist_entries(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE IF NOT EXISTS waitlist_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_signups INTEGER DEFAULT 0,
  weekly_signups INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist_entries(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_entries(created_at DESC);

-- Insert initial stats
INSERT INTO waitlist_stats (total_signups, weekly_signups) 
VALUES (0, 0) ON CONFLICT DO NOTHING;

-- Auto-update function
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

-- Trigger
DROP TRIGGER IF EXISTS waitlist_stats_trigger ON waitlist_entries;
CREATE TRIGGER waitlist_stats_trigger
AFTER INSERT ON waitlist_entries
FOR EACH ROW
EXECUTE FUNCTION update_waitlist_stats();

-- Enable RLS
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public to view stats" ON waitlist_stats FOR SELECT USING (true);
CREATE POLICY "Allow public to insert waitlist entries" ON waitlist_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to view their own entry" ON waitlist_entries FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT ON waitlist_stats TO anon, authenticated;
GRANT INSERT, SELECT ON waitlist_entries TO anon, authenticated;
```

---

## ✅ Verification Checklist

After setup, verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('waitlist_entries', 'waitlist_stats');

-- Should return 2 rows
```

---

## 🧪 Test Commands

```bash
# Test email submission
curl -X POST http://localhost:3000/api/waitlist/join \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected response:
# {"success":true,"data":{"email":"test@example.com","referral_code":"ABC12345",...}}
```

```sql
-- View signups in Supabase
SELECT * FROM waitlist_entries ORDER BY created_at DESC LIMIT 10;

-- Check stats
SELECT * FROM waitlist_stats;
```

---

## 🐛 Common Issues

### Issue: "Missing env vars"
**Fix:** Create .env.local with proper values

### Issue: "Database connection error"
**Fix:** Check API key is correct, project not paused

### Issue: "Email already registered" on first try
**Fix:** 
```sql
DELETE FROM waitlist_entries WHERE email LIKE '%@example.com';
```

### Issue: Stats not updating
**Fix:**
```sql
SELECT update_waitlist_stats();
```

---

## 📚 Documentation

- **Full Implementation Plan:** `docs/IMPLEMENTATION_PLAN.md`
- **Database Schema:** `docs/database-setup.md`
- **Waitlist Features:** `docs/waitlist-summary.md`
- **Project Guide:** `.github/copilot-instructions.md`

---

## 🚀 Quick Commands

```bash
# Setup (interactive)
./scripts/setup-waitlist.sh

# Development
npm run dev

# Build
npm run build

# Production
npm start

# Check environment
cat .env.local
```

---

## 📊 What You Get

✅ **Beautiful landing page** with hero section  
✅ **Email capture** with validation  
✅ **Referral system** with unique codes  
✅ **Live stats counter** (weekly signups)  
✅ **Success page** with sharing  
✅ **Mobile responsive**  
✅ **Dark/light theme**  
✅ **Production ready**  

---

## 🎉 Success Criteria

- [ ] Submit email → redirects to success page
- [ ] Check Supabase → see entry in `waitlist_entries`
- [ ] Stats counter updates automatically
- [ ] Duplicate email shows error
- [ ] Referral link works (`?ref=CODE`)
- [ ] Mobile view looks good

---

## ⏱️ Estimated Time

- Database setup: **5 minutes**
- Environment config: **2 minutes**
- Testing: **3 minutes**
- **Total: 10 minutes**

---

**Need help?** Check `docs/IMPLEMENTATION_PLAN.md` for detailed step-by-step guide.

**Ready to launch?** Run `./scripts/setup-waitlist.sh` 🚀
