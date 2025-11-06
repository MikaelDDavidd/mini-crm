CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS lead_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS lead_interactions_lead_id_idx ON lead_interactions(lead_id);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view interactions for their leads" ON lead_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads WHERE leads.id = lead_interactions.lead_id AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert interactions for their leads" ON lead_interactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads WHERE leads.id = lead_interactions.lead_id AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update interactions for their leads" ON lead_interactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM leads WHERE leads.id = lead_interactions.lead_id AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete interactions for their leads" ON lead_interactions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM leads WHERE leads.id = lead_interactions.lead_id AND leads.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
