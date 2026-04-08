-- ========================================
-- FIX PROJECT_MEMBERS RLS POLICIES
-- Run this in Supabase SQL Editor
-- ========================================
-- This fixes the issue where user can't see their teams
-- ========================================

-- Drop all existing policies on project_members
DROP POLICY IF EXISTS "Project members are viewable by everyone" ON public.project_members;
DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;
DROP POLICY IF EXISTS "Users can view own memberships" ON public.project_members;
DROP POLICY IF EXISTS "Users can insert own memberships" ON public.project_members;
DROP POLICY IF EXISTS "Users can delete own memberships" ON public.project_members;
DROP POLICY IF EXISTS "Users can leave projects" ON public.project_members;

-- Policy 1: Anyone can view project members (for displaying team info)
CREATE POLICY "Project members are viewable by everyone"
  ON public.project_members FOR SELECT
  USING ( true );

-- Policy 2: Project owners can add/remove members
CREATE POLICY "Project owners can manage members"
  ON public.project_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_members.project_id
      AND projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_members.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Policy 3: Users can view their own memberships
CREATE POLICY "Users can view own memberships"
  ON public.project_members FOR SELECT
  USING ( auth.uid() = user_id );

-- Policy 4: Users can leave projects (delete their own membership)
CREATE POLICY "Users can leave projects"
  ON public.project_members FOR DELETE
  USING (
    auth.uid() = user_id
    AND role != 'owner'
  );

-- ========================================
-- SUCCESS!
-- ========================================
-- Now users can:
-- 1. See their own memberships (Your Teams page)
-- 2. View other project members
-- 3. Leave projects (if not owner)
-- 4. Owners can manage team members
-- ========================================
