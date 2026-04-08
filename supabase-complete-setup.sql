-- ========================================================
-- BUILDSPACE: COMPLETE DATABASE SETUP (Consolidated)
-- ========================================================
-- This script sets up all tables, indexes, RLS policies, 
-- and realtime features for the BuildSpace application.
-- ========================================================

-- Cleanup (Optional: Uncomment if you want a clean slate)
-- DROP TABLE IF EXISTS public.bookmarks CASCADE;
-- DROP TABLE IF EXISTS public.project_members CASCADE;
-- DROP TABLE IF EXISTS public.join_requests CASCADE;
-- DROP TABLE IF EXISTS public.projects CASCADE;
-- DROP TABLE IF EXISTS public.opportunities CASCADE;
-- DROP TABLE IF EXISTS public.feed_posts CASCADE;
-- DROP TABLE IF EXISTS public.notifications CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- ========================================
-- 1. PROFILES
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  skills TEXT[] DEFAULT '{}',
  commits_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ========================================
-- 2. PROJECTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  repo_url TEXT,
  stars_count INTEGER DEFAULT 0,
  language TEXT,
  code_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
CREATE POLICY "Anyone can view projects"
  ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE USING (auth.uid() = owner_id);

-- ========================================
-- 3. BOOKMARKS
-- ========================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 4. JOIN REQUESTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (project_id, requester_id)
);

CREATE INDEX IF NOT EXISTS idx_join_requests_owner ON public.join_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_requester ON public.join_requests(requester_id);

ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Relevant users can view join requests" ON public.join_requests;
CREATE POLICY "Relevant users can view join requests"
  ON public.join_requests FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own requests" ON public.join_requests;
CREATE POLICY "Users can insert own requests"
  ON public.join_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Owners can update requests" ON public.join_requests;
CREATE POLICY "Owners can update requests"
  ON public.join_requests FOR UPDATE USING (auth.uid() = owner_id);

-- ========================================
-- 5. PROJECT MEMBERS
-- ========================================
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_members_project ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON public.project_members(user_id);

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Project members are viewable by everyone" ON public.project_members;
CREATE POLICY "Project members are viewable by everyone"
  ON public.project_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;
CREATE POLICY "Project owners can manage members"
  ON public.project_members FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_members.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- ========================================
-- 6. NOTIFICATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  ref_id UUID,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- 7. FEED POSTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT,
  ref_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feed_posts_author ON public.feed_posts(author_id);

ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Feed posts are viewable by everyone" ON public.feed_posts;
CREATE POLICY "Feed posts are viewable by everyone"
  ON public.feed_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own feed posts" ON public.feed_posts;
CREATE POLICY "Users can manage own feed posts"
  ON public.feed_posts FOR ALL USING (auth.uid() = author_id);

-- ========================================
-- 8. OPPORTUNITIES
-- ========================================
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('teammate', 'hackathon', 'role')),
  title TEXT NOT NULL,
  description TEXT,
  skills_needed TEXT[] DEFAULT '{}',
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_poster ON public.opportunities(poster_id);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Opportunities are viewable by everyone" ON public.opportunities;
CREATE POLICY "Opportunities are viewable by everyone"
  ON public.opportunities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own opportunities" ON public.opportunities;
CREATE POLICY "Users can manage own opportunities"
  ON public.opportunities FOR ALL USING (auth.uid() = poster_id);

-- ========================================
-- 9. TRIGGERS & FUNCTIONS
-- ========================================

-- Profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-add owner to project_members when a project is created
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.project_members (project_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_project_created ON public.projects;
CREATE TRIGGER on_project_created
  AFTER INSERT ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_project();

-- ========================================
-- 10. REALTIME CONFIGURATION
-- ========================================
-- We update the publication to include all our tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects, public.join_requests, public.feed_posts, public.notifications, public.opportunities;
  ELSE
    CREATE PUBLICATION supabase_realtime FOR TABLE public.projects, public.join_requests, public.feed_posts, public.notifications, public.opportunities;
  END IF;
EXCEPTION
  WHEN others THEN
    -- Table might already be in publication, ignore
    NULL;
END $$;

-- ========================================
-- SETUP COMPLETE
-- ========================================
