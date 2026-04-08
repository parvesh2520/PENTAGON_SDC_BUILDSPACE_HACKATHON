-- ========================================
-- OPPORTUNITIES - ADD STATUS COLUMN
-- Run this in Supabase SQL Editor
-- ========================================
-- This adds the ability to close/reopen opportunities
-- ========================================

-- Add status column to opportunities table (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'opportunities'
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.opportunities
    ADD COLUMN status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed'));
  END IF;
END $$;

-- Create index for status queries (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'opportunities'
    AND indexname = 'idx_opportunities_status'
  ) THEN
    CREATE INDEX idx_opportunities_status ON public.opportunities(status);
  END IF;
END $$;

-- Add comment
COMMENT ON COLUMN public.opportunities.status IS 'Opportunity status: open (active) or closed (inactive)';

-- Update RLS policies to allow owner to update status
-- Drop existing policy first (if it exists), then recreate
DO $$
BEGIN
  -- Try to drop the policy if it exists
  BEGIN
    DROP POLICY "Owners can update own opportunities" ON public.opportunities;
  EXCEPTION
    WHEN undefined_object THEN
      -- Policy doesn't exist, that's fine
      NULL;
  END;

  -- Create the policy
  CREATE POLICY "Owners can update own opportunities"
    ON public.opportunities FOR UPDATE
    USING ( auth.uid() = poster_id )
    WITH CHECK ( auth.uid() = poster_id );
END $$;

-- Enable realtime for UPDATE events (for close/reopen)
-- Note: This should already be enabled from the main setup, but ensuring it's there
DO $$
BEGIN
  -- Check if realtime is already enabled for opportunities
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'opportunities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunities;
  END IF;
END $$;

-- ========================================
-- SUCCESS!
-- ========================================
-- Now opportunity posters can:
-- 1. Close their opportunities (stop applications)
-- 2. Reopen closed opportunities
-- 3. See closed status in the UI
-- ========================================
