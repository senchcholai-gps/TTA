-- ====================================================================
-- THE THREE AMIGOS (TTA) — SUPABASE CMS DATABASE SCHEMA & RLS SETUP
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. AUTOMATIC UPDATED_AT TIMESTAMP FUNCTION
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------------
-- 1. ADMIN USERS TABLE & SECURITY FUNCTION
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = is_admin.user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 2. PORTFOLIO ITEMS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'video',
    media_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    client_name TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON public.portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON public.portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users can view published portfolio items" ON public.portfolio_items;
CREATE POLICY "Public users can view published portfolio items"
    ON public.portfolio_items FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to portfolio items" ON public.portfolio_items;
CREATE POLICY "Admins have full access to portfolio items"
    ON public.portfolio_items FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 3. TESTIMONIALS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    testimonial TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    avatar_url TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users can view published testimonials" ON public.testimonials;
CREATE POLICY "Public users can view published testimonials"
    ON public.testimonials FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to testimonials" ON public.testimonials;
CREATE POLICY "Admins have full access to testimonials"
    ON public.testimonials FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 4. CLIENT LOGOS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_logos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_client_logos_updated_at ON public.client_logos;
CREATE TRIGGER update_client_logos_updated_at
    BEFORE UPDATE ON public.client_logos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users can view published client logos" ON public.client_logos;
CREATE POLICY "Public users can view published client logos"
    ON public.client_logos FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to client logos" ON public.client_logos;
CREATE POLICY "Admins have full access to client logos"
    ON public.client_logos FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 5. SERVICES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users can view published services" ON public.services;
CREATE POLICY "Public users can view published services"
    ON public.services FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
CREATE POLICY "Admins have full access to services"
    ON public.services FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 6. CASE STUDIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    category TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_case_studies_updated_at ON public.case_studies;
CREATE TRIGGER update_case_studies_updated_at
    BEFORE UPDATE ON public.case_studies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users can view published case studies" ON public.case_studies;
CREATE POLICY "Public users can view published case studies"
    ON public.case_studies FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to case studies" ON public.case_studies;
CREATE POLICY "Admins have full access to case studies"
    ON public.case_studies FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 7. BLOG POSTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public users can view published blog posts"
    ON public.blog_posts FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to blog posts" ON public.blog_posts;
CREATE POLICY "Admins have full access to blog posts"
    ON public.blog_posts FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 8. SITE CONTENT TABLE (Hero, About, Contact CTA, Navigation, Footer, Settings)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
    section_id TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users can view site_content" ON public.site_content;
CREATE POLICY "Public users can view site_content"
    ON public.site_content FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins have full access to site_content" ON public.site_content;
CREATE POLICY "Admins have full access to site_content"
    ON public.site_content FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- --------------------------------------------------------------------
-- 9. METRICS TABLE (Live animated metrics counters)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    start_value INTEGER NOT NULL DEFAULT 0,
    suffix TEXT NOT NULL DEFAULT '',
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_metrics_updated_at ON public.metrics;
CREATE TRIGGER update_metrics_updated_at
    BEFORE UPDATE ON public.metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public users can view published metrics" ON public.metrics;
CREATE POLICY "Public users can view published metrics"
    ON public.metrics FOR SELECT
    USING (published = true);

-- --------------------------------------------------------------------
-- 10. SUBSCRIBERS TABLE (Newsletter & CTA Email Subscriptions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'new',
    source TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_subscribers_updated_at ON public.subscribers;
CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.subscribers TO anon, authenticated;
GRANT UPDATE (source, status, updated_at) ON public.subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.subscribers TO authenticated;

-- Public users can INSERT their email
DROP POLICY IF EXISTS "Public can insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Anon and authenticated can insert subscribers" ON public.subscribers;
CREATE POLICY "Anon and authenticated can insert subscribers"
    ON public.subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Public users can update subscriber source on duplicate submission
DROP POLICY IF EXISTS "Anon and authenticated can update subscriber source" ON public.subscribers;
CREATE POLICY "Anon and authenticated can update subscriber source"
    ON public.subscribers
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated Admins have full access to view, update status, and delete subscribers
DROP POLICY IF EXISTS "Admins have full access to subscribers" ON public.subscribers;
CREATE POLICY "Admins have full access to subscribers"
    ON public.subscribers FOR ALL
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ====================================================================
-- STORAGE BUCKETS INITIALIZATION
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('portfolio', 'portfolio', true),
    ('client-logos', 'client-logos', true),
    ('testimonials', 'testimonials', true),
    ('case-studies', 'case-studies', true),
    ('blog', 'blog', true),
    ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public Storage Read Access
DROP POLICY IF EXISTS "Public Read Storage Access" ON storage.objects;
CREATE POLICY "Public Read Storage Access"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('portfolio', 'client-logos', 'testimonials', 'case-studies', 'blog', 'site-assets'));

-- Authenticated Admin Storage Write Access
DROP POLICY IF EXISTS "Admin Insert Storage Access" ON storage.objects;
CREATE POLICY "Admin Insert Storage Access"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id IN ('portfolio', 'client-logos', 'testimonials', 'case-studies', 'blog', 'site-assets')
        AND public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Admin Update Storage Access" ON storage.objects;
CREATE POLICY "Admin Update Storage Access"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id IN ('portfolio', 'client-logos', 'testimonials', 'case-studies', 'blog', 'site-assets')
        AND public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Admin Delete Storage Access" ON storage.objects;
CREATE POLICY "Admin Delete Storage Access"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id IN ('portfolio', 'client-logos', 'testimonials', 'case-studies', 'blog', 'site-assets')
        AND public.is_admin(auth.uid())
    );
