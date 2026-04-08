-- ========================================
-- 4. CREATE SOCIAL AND MEMBERSHIP TABLES
-- ========================================

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  ref_id UUID,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FEED POSTS
CREATE TABLE IF NOT EXISTS public.feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT,
  ref_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- OPPORTUNITIES
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

-- PROJECT MEMBERS
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_author_id ON public.feed_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_poster_id ON public.opportunities(poster_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);

-- ENAble RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- POLICIES
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Feed posts viewable by everyone" ON public.feed_posts;
CREATE POLICY "Feed posts viewable by everyone" ON public.feed_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own feed posts" ON public.feed_posts;
CREATE POLICY "Users can manage own feed posts" ON public.feed_posts FOR ALL USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Opportunities viewable by everyone" ON public.opportunities;
CREATE POLICY "Opportunities viewable by everyone" ON public.opportunities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own opportunities" ON public.opportunities;
CREATE POLICY "Users can manage own opportunities" ON public.opportunities FOR ALL USING (auth.uid() = poster_id);

DROP POLICY IF EXISTS "Project members viewable by everyone" ON public.project_members;
CREATE POLICY "Project members viewable by everyone" ON public.project_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can manage members" ON public.project_members;
CREATE POLICY "Owners can manage members" ON public.project_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_members.project_id AND projects.owner_id = auth.uid())
);

-- TRIGGER: Auto-add owner to project_members
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

-- REALTIME
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects, public.join_requests, public.feed_posts, public.notifications, public.opportunities;
  ELSE
    CREATE PUBLICATION supabase_realtime FOR TABLE public.projects, public.join_requests, public.feed_posts, public.notifications, public.opportunities;
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;
