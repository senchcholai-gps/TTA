-- Create Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_subscribers_updated_at ON public.subscribers;
CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Public users can only INSERT their email (No SELECT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Public can insert subscribers" ON public.subscribers;
CREATE POLICY "Public can insert subscribers"
    ON public.subscribers FOR INSERT
    WITH CHECK (true);

-- Authenticated Admins have full access to view, update status, and delete subscribers
DROP POLICY IF EXISTS "Admins have full access to subscribers" ON public.subscribers;
CREATE POLICY "Admins have full access to subscribers"
    ON public.subscribers FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
