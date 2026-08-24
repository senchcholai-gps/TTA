-- Fix Subscribers RLS Policies for Anon Insert and Admin Full Access
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 1. Grant table usage & permissions
GRANT INSERT ON public.subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.subscribers TO authenticated;

-- 2. Public / Anon INSERT policy
DROP POLICY IF EXISTS "Public can insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Anon and authenticated can insert subscribers" ON public.subscribers;
CREATE POLICY "Anon and authenticated can insert subscribers"
    ON public.subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 3. Admin Full Access Policy (SELECT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admins have full access to subscribers" ON public.subscribers;
CREATE POLICY "Admins have full access to subscribers"
    ON public.subscribers
    FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
