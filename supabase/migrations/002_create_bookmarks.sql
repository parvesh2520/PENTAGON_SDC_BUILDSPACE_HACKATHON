-- ============================================
-- BuildSpace: Bookmarks Table
-- ============================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates the bookmarks table that stores which projects
-- each user has saved/bookmarked.

-- 1. Create the bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Each user can only bookmark a project once
  UNIQUE (user_id, project_id)
);

-- 2. Create an index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);

-- 3. Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
--    Users can only see their own bookmarks
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

--    Users can insert their own bookmarks
DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

--    Users can delete their own bookmarks
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);
