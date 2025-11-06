-- Mini CRM - Complete Database Schema
-- Run this in Supabase SQL Editor after creating a new project

-- ================================================
-- USER PROFILES (extends Supabase Auth)
-- ================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'sales_rep' CHECK (role IN ('admin', 'sales_manager', 'sales_rep')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ================================================
-- LEADS TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  source TEXT CHECK (source IN ('website', 'referral', 'social_media', 'ad_campaign', 'cold_call', 'other')),
  notes TEXT,
  deal_value DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- ================================================
-- LEAD INTERACTIONS (History/Timeline)
-- ================================================

CREATE TABLE IF NOT EXISTS lead_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'status_change')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL
);

-- ================================================
-- INDEXES for Performance
-- ================================================

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_last_activity ON leads(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_created_at ON lead_interactions(created_at DESC);

-- Full-text search index for leads
CREATE INDEX IF NOT EXISTS idx_leads_search ON leads USING gin(to_tsvector('english', name || ' ' || COALESCE(email, '') || ' ' || COALESCE(company, '')));

-- ================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Leads Policies
CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- Lead Interactions Policies
CREATE POLICY "Users can view interactions for their leads" ON lead_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_interactions.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert interactions for their leads" ON lead_interactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_interactions.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own interactions" ON lead_interactions
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own interactions" ON lead_interactions
  FOR DELETE USING (auth.uid() = created_by);

-- ================================================
-- TRIGGERS
-- ================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update last_activity_at when interaction is added
CREATE OR REPLACE FUNCTION update_lead_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE leads
  SET last_activity_at = TIMEZONE('utc', NOW())
  WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lead_activity_on_interaction
  AFTER INSERT ON lead_interactions
  FOR EACH ROW EXECUTE FUNCTION update_lead_last_activity();

-- Create interaction when lead status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO lead_interactions (lead_id, type, description, created_by)
    VALUES (
      NEW.id,
      'status_change',
      'Status changed from ' || OLD.status || ' to ' || NEW.status,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_lead_status_change
  AFTER UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================
-- FUNCTIONS for Analytics
-- ================================================

-- Get conversion rate
CREATE OR REPLACE FUNCTION get_conversion_rate(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_total INTEGER;
  v_won INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM leads
  WHERE user_id = p_user_id
  AND status != 'lost';

  SELECT COUNT(*) INTO v_won
  FROM leads
  WHERE user_id = p_user_id
  AND status = 'won';

  IF v_total = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND((v_won::DECIMAL / v_total::DECIMAL) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Get leads by date range
CREATE OR REPLACE FUNCTION get_leads_by_date_range(
  p_user_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  date DATE,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(created_at) as date,
    COUNT(*)::BIGINT as count
  FROM leads
  WHERE user_id = p_user_id
  AND created_at BETWEEN p_start_date AND p_end_date
  GROUP BY DATE(created_at)
  ORDER BY date;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- INITIAL DATA (Optional)
-- ================================================

-- Insert default sources (you can customize this)
COMMENT ON COLUMN leads.source IS 'Lead source: website, referral, social_media, ad_campaign, cold_call, other';
COMMENT ON COLUMN leads.status IS 'Lead status: new, contacted, qualified, proposal, negotiation, won, lost';
COMMENT ON COLUMN leads.priority IS 'Lead priority: high, normal, low';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
