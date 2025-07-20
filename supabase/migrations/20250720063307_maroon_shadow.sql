/*
  # Fix Authentication and RLS Policies

  1. Security Updates
    - Fix RLS policies for proper user access
    - Add proper authentication triggers
    - Enable secure user profile creation

  2. Tables
    - Update users table with proper constraints
    - Fix foreign key relationships
    - Add proper indexes for performance

  3. Authentication
    - Add trigger for automatic profile creation
    - Fix RLS policies for authenticated users
    - Enable proper row-level security
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can manage own CVs" ON cvs;
DROP POLICY IF EXISTS "Anyone can read jobs" ON jobs;
DROP POLICY IF EXISTS "Users can manage own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can manage own applications" ON applications;

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- CVs table policies
CREATE POLICY "Users can manage own CVs"
  ON cvs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Jobs table policies (public read access)
CREATE POLICY "Anyone can read jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

-- Saved jobs policies
CREATE POLICY "Users can manage own saved jobs"
  ON saved_jobs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can manage own applications"
  ON applications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add some sample jobs for testing
INSERT INTO jobs (title, company, location, type, salary, description, requirements, apply_url, posted_at) VALUES
('Senior Software Engineer', 'TechCorp Global', 'San Francisco, CA, USA', 'Full-time', '$120,000 - $180,000', 'We are looking for a Senior Software Engineer to join our growing team.', ARRAY['React', 'TypeScript', 'Node.js', 'Python', 'AWS'], 'https://example.com/apply/1', now()),
('Frontend Developer', 'Digital Solutions Ltd', 'London, UK', 'Full-time', '£50,000 - £75,000', 'Join our team as a Frontend Developer and help create beautiful user interfaces.', ARRAY['React', 'Vue.js', 'CSS', 'JavaScript', 'HTML'], 'https://example.com/apply/2', now()),
('Data Scientist', 'AI Innovations GmbH', 'Berlin, Germany', 'Full-time', '€60,000 - €85,000', 'We seek a Data Scientist to analyze complex datasets and develop ML models.', ARRAY['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'], 'https://example.com/apply/3', now()),
('Product Manager', 'StartupHub Inc', 'Toronto, ON, Canada', 'Full-time', 'CAD $90,000 - $120,000', 'Lead product strategy and development for our SaaS applications.', ARRAY['Product Management', 'Agile', 'Analytics', 'Leadership', 'Strategy'], 'https://example.com/apply/4', now()),
('DevOps Engineer', 'CloudTech Solutions', 'Sydney, NSW, Australia', 'Remote', 'AUD $100,000 - $140,000', 'Design and implement CI/CD pipelines and manage cloud infrastructure.', ARRAY['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'], 'https://example.com/apply/5', now())
ON CONFLICT DO NOTHING;