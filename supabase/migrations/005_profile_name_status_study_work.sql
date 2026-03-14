-- Add profile name, name, studying/working status and conditional fields to profiles.
-- Run in Supabase SQL Editor.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS profile_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS university TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS major TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS job TEXT DEFAULT '';
