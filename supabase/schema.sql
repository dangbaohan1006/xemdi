-- ============================================================
-- XemDi — Watch History Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- 1. Create the watch_history table
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_slug TEXT NOT NULL,
  movie_name TEXT NOT NULL,
  movie_poster TEXT NOT NULL DEFAULT '',
  current_time DOUBLE PRECISION NOT NULL DEFAULT 0,
  duration DOUBLE PRECISION NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Each user can only have one history entry per movie
  UNIQUE(user_id, movie_slug)
);

-- 2. Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON public.watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_updated_at ON public.watch_history(updated_at);

-- 3. Enable Row Level Security
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: users can only access their own records
CREATE POLICY "Users can view own watch history"
  ON public.watch_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch history"
  ON public.watch_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history"
  ON public.watch_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watch history"
  ON public.watch_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Auto-update the updated_at timestamp on any change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_watch_history_updated
  BEFORE UPDATE ON public.watch_history
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 6. Self-Cleaning Stored Procedure
--    Deletes records older than 6 months OR keeps only latest
--    100 records per user (whichever is more aggressive).
-- ============================================================
CREATE OR REPLACE FUNCTION public.clean_old_watch_history()
RETURNS void AS $$
BEGIN
  -- Step A: Delete records older than 6 months
  DELETE FROM public.watch_history
  WHERE updated_at < now() - INTERVAL '6 months';

  -- Step B: For each user, keep only the 100 most recent records
  DELETE FROM public.watch_history
  WHERE id IN (
    SELECT id FROM (
      SELECT
        id,
        ROW_NUMBER() OVER (
          PARTITION BY user_id
          ORDER BY updated_at DESC
        ) AS rn
      FROM public.watch_history
    ) ranked
    WHERE rn > 100
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 7. Schedule weekly cleanup with pg_cron
--    IMPORTANT: Enable pg_cron extension first in Supabase Dashboard
--    (Database → Extensions → search "pg_cron" → Enable)
-- ============================================================

-- Enable the extension (run this first if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule: Every Sunday at 03:00 UTC
-- SELECT cron.schedule(
--   'clean-watch-history-weekly',
--   '0 3 * * 0',
--   $$SELECT public.clean_old_watch_history()$$
-- );

-- To verify the schedule:
-- SELECT * FROM cron.job;

-- To remove the schedule:
-- SELECT cron.unschedule('clean-watch-history-weekly');
