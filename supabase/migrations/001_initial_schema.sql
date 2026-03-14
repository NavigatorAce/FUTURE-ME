-- Branch Self MVP Schema
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- profiles: current self profile per user
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER NOT NULL,
  life_stage TEXT NOT NULL,
  personality_traits TEXT[] DEFAULT '{}',
  goals TEXT NOT NULL DEFAULT '',
  fears TEXT NOT NULL DEFAULT '',
  current_struggles TEXT NOT NULL DEFAULT '',
  additional_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- future_branches: 3 branches per profile (generated from profile)
CREATE TABLE IF NOT EXISTS future_branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  age_at_future INTEGER NOT NULL,
  one_liner TEXT NOT NULL,
  core_values TEXT[] DEFAULT '{}',
  signature_message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, slug)
);

-- dialogue_sessions: one question per session
CREATE TABLE IF NOT EXISTS dialogue_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- branch_answers: one answer per branch per session
CREATE TABLE IF NOT EXISTS branch_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES dialogue_sessions(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES future_branches(id) ON DELETE CASCADE,
  branch_slug TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) - enable for auth
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialogue_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_answers ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view branches for own profile"
  ON future_branches FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));

CREATE POLICY "Users can insert branches for own profile"
  ON future_branches FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));

CREATE POLICY "Users can manage own sessions"
  ON dialogue_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage answers for own sessions"
  ON branch_answers FOR ALL
  USING (EXISTS (
    SELECT 1 FROM dialogue_sessions s
    WHERE s.id = session_id AND s.user_id = auth.uid()
  ));

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_future_branches_profile_id ON future_branches(profile_id);
CREATE INDEX IF NOT EXISTS idx_dialogue_sessions_user_id ON dialogue_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_dialogue_sessions_created_at ON dialogue_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_branch_answers_session_id ON branch_answers(session_id);
