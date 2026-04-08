-- ============================================
-- BuildSpace: Projects + Join Requests Tables
-- ============================================

-- 1. Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack  TEXT[] DEFAULT '{}',
  status      TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  repo_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view projects
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
CREATE POLICY "Anyone can view projects"
  ON public.projects FOR SELECT
  USING (true);

-- Only the owner can create their own projects
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Only the owner can update their own projects
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_id);

-- Only the owner can delete their own projects
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_id);


-- 2. Join Requests table
CREATE TABLE IF NOT EXISTS public.join_requests (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id    UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  requester_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at    TIMESTAMPTZ DEFAULT now(),

  -- A user can only request to join a project once
  UNIQUE (project_id, requester_id)
);

CREATE INDEX IF NOT EXISTS idx_join_requests_owner ON public.join_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_requester ON public.join_requests(requester_id);

ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Requesters can see their own outgoing requests
DROP POLICY IF EXISTS "Requesters can view own requests" ON public.join_requests;
CREATE POLICY "Requesters can view own requests"
  ON public.join_requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = owner_id);

-- Requesters can create their own requests
DROP POLICY IF EXISTS "Users can insert own requests" ON public.join_requests;
CREATE POLICY "Users can insert own requests"
  ON public.join_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Owners can update (accept/decline) requests on their projects
DROP POLICY IF EXISTS "Owners can update requests" ON public.join_requests;
CREATE POLICY "Owners can update requests"
  ON public.join_requests FOR UPDATE
  USING (auth.uid() = owner_id);
