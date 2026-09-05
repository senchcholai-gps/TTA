-- 1. Add source column to subscribers table for pricing package tracking
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS source TEXT NULL;

-- 2. Grant UPDATE permissions on source, status, and updated_at
GRANT UPDATE (source, status, updated_at) ON public.subscribers TO anon, authenticated;

-- 3. Policy to allow updating subscriber row by email
DROP POLICY IF EXISTS "Anon and authenticated can update subscriber source" ON public.subscribers;
CREATE POLICY "Anon and authenticated can update subscriber source"
    ON public.subscribers
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
