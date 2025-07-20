/*
  # Create CV Builder Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `cvs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `personal_info` (jsonb)
      - `summary` (text)
      - `experience` (jsonb)
      - `education` (jsonb)
      - `skills` (text array)
      - `template` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text)
      - `location` (text)
      - `type` (text)
      - `salary` (text)
      - `description` (text)
      - `requirements` (text array)
      - `apply_url` (text)
      - `source` (text)
      - `posted_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `saved_jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `job_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `job_id` (uuid, foreign key)
      - `cv_id` (uuid, foreign key)
      - `status` (text)
      - `applied_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create CVs table
CREATE TABLE IF NOT EXISTS cvs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  personal_info jsonb DEFAULT '{}',
  summary text DEFAULT '',
  experience jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  skills text[] DEFAULT '{}',
  template text DEFAULT 'modern',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  salary text NOT NULL,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  apply_url text NOT NULL,
  source text DEFAULT 'manual',
  posted_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  cv_id uuid REFERENCES cvs(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for CVs table
CREATE POLICY "Users can manage own CVs"
  ON cvs
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create policies for jobs table (public read, admin write)
CREATE POLICY "Anyone can read jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for saved_jobs table
CREATE POLICY "Users can manage own saved jobs"
  ON saved_jobs
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create policies for applications table
CREATE POLICY "Users can manage own applications"
  ON applications
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);

-- Function to automatically delete old jobs (older than 2 weeks)
CREATE OR REPLACE FUNCTION delete_old_jobs()
RETURNS void AS $$
BEGIN
  DELETE FROM jobs 
  WHERE posted_at < NOW() - INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled function to run daily (requires pg_cron extension)
-- This would need to be set up in Supabase dashboard or via SQL
-- SELECT cron.schedule('delete-old-jobs', '0 2 * * *', 'SELECT delete_old_jobs();');