-- ========================================
-- TEAM MEMBERSHIP - ADDITIONAL SETUP
-- (Optional enhancements for perfect UX)
-- ========================================
-- These are OPTIONAL improvements to make
-- the team membership system even better.
-- Run in Supabase SQL Editor if desired.
-- ========================================

-- ========================================
-- 1. CREATE INDEXES FOR PERFORMANCE
-- ========================================
-- Speed up team project queries
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON public.project_members(role);

-- Speed up join request queries
CREATE INDEX IF NOT EXISTS idx_join_requests_owner_id ON public.join_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_requester_id ON public.join_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON public.join_requests(status);

-- Speed up notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- ========================================
-- 2. ADD DATABASE COMMENTS
-- ========================================
COMMENT ON COLUMN public.project_members.role IS 'User role: owner (creator), member (joined), admin (elevated permissions)';
COMMENT ON COLUMN public.join_requests.status IS 'Request status: pending, accepted, declined';
COMMENT ON COLUMN public.notifications.type IS 'Notification type: join_request, join_accepted, join_declined, etc.';

-- ========================================
-- 3. CREATE HELPER VIEWS (Optional)
-- ========================================
-- View: All active team members with their projects
CREATE OR REPLACE VIEW public.active_team_members AS
SELECT 
  pm.user_id,
  pm.project_id,
  pm.role,
  pm.created_at as joined_at,
  p.title as project_title,
  p.description as project_description,
  prof.display_name,
  prof.username,
  prof.avatar_url
FROM public.project_members pm
JOIN public.projects p ON pm.project_id = p.id
JOIN public.profiles prof ON pm.user_id = prof.id
WHERE p.status = 'open';

-- View: Project team summary
CREATE OR REPLACE VIEW public.project_team_summary AS
SELECT 
  p.id as project_id,
  p.title,
  p.owner_id,
  p.status,
  COUNT(pm.id) as total_members,
  COUNT(CASE WHEN pm.role = 'owner' THEN 1 END) as owners_count,
  COUNT(CASE WHEN pm.role = 'member' THEN 1 END) as members_count,
  ARRAY_AGG(
    json_build_object(
      'user_id', pm.user_id,
      'role', pm.role,
      'display_name', prof.display_name,
      'avatar_url', prof.avatar_url
    )
  ) as team_members
FROM public.projects p
LEFT JOIN public.project_members pm ON p.id = pm.project_id
LEFT JOIN public.profiles prof ON pm.user_id = prof.id
GROUP BY p.id, p.title, p.owner_id, p.status;

-- ========================================
-- 4. CREATE AUTOMATED TRIGGERS (Optional)
-- ========================================
-- Trigger: Auto-update project status when member count changes
CREATE OR REPLACE FUNCTION public.update_project_member_count()
RETURNS TRIGGER AS $$
BEGIN
  -- This is just for tracking; you can query member count dynamically
  -- No action needed as we fetch it on-demand
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. ADD CONSTRAINTS (If not already present)
-- ========================================
-- Ensure project_members has proper constraints
ALTER TABLE public.project_members 
  DROP CONSTRAINT IF EXISTS project_members_role_check;

ALTER TABLE public.project_members 
  ADD CONSTRAINT project_members_role_check 
  CHECK (role IN ('owner', 'member', 'admin'));

-- Ensure join_requests has proper constraints
ALTER TABLE public.join_requests 
  DROP CONSTRAINT IF EXISTS join_requests_status_check;

ALTER TABLE public.join_requests 
  ADD CONSTRAINT join_requests_status_check 
  CHECK (status IN ('pending', 'accepted', 'declined'));

-- ========================================
-- 6. ENABLE REALTIME (If not already done)
-- ========================================
-- Enable realtime for project_members (already done in main setup)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.project_members;

-- ========================================
-- 7. CREATE HELPER FUNCTIONS
-- ========================================
-- Function: Get member count for a project
CREATE OR REPLACE FUNCTION public.get_project_member_count(p_project_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER 
  FROM public.project_members 
  WHERE project_id = p_project_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function: Check if user is owner of project
CREATE OR REPLACE FUNCTION public.is_project_owner(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.project_members 
    WHERE project_id = p_project_id 
    AND user_id = p_user_id 
    AND role = 'owner'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function: Check if user is member of project
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.project_members 
    WHERE project_id = p_project_id 
    AND user_id = p_user_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ========================================
-- 8. SAMPLE DATA (For Testing)
-- ========================================
-- Uncomment to add sample team data for testing

-- INSERT INTO public.project_members (project_id, user_id, role)
-- VALUES 
--   ('your-project-uuid-here', 'your-user-uuid-here', 'owner');

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- Your team membership system is now optimized.
-- The main functionality already works without
-- running this file - this is just enhancements.
-- ========================================
