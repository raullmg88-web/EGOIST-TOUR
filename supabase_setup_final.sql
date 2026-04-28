-- 1. TABLAS COMUNES
CREATE TABLE IF NOT EXISTS public.cosplayers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    theme TEXT,
    short_description TEXT,
    long_description TEXT,
    image_url TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.artistas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    specialty TEXT,
    short_description TEXT,
    long_description TEXT,
    image_url TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.invitados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    role TEXT,
    short_description TEXT,
    long_description TEXT,
    image_url TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TABLA MERCH
CREATE TABLE IF NOT EXISTS public.merch (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    short_description TEXT,
    long_description TEXT,
    image_url TEXT,
    price TEXT,
    category TEXT,
    in_stock BOOLEAN DEFAULT true,
    label TEXT,
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA HORARIOS
CREATE TABLE IF NOT EXISTS public.horarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA CONTENIDO HOME
CREATE TABLE IF NOT EXISTS public.home_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hero_title TEXT DEFAULT 'Blue Lock Fan Event',
    hero_subtitle TEXT DEFAULT 'EGOIST TOUR',
    hero_description TEXT DEFAULT 'Una experiencia temática con actividades, photocall, café tematizado y concierto.',
    cta_primary_text TEXT DEFAULT 'Comprar entrada',
    cta_primary_link TEXT DEFAULT '#entradas',
    cta_secondary_text TEXT DEFAULT 'Ver horarios',
    cta_secondary_link TEXT DEFAULT '#horarios',
    event_description TEXT DEFAULT 'Vive tres jornadas dedicadas al universo Blue Lock con actividades especiales...',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insertar fila por defecto
INSERT INTO public.home_content (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- 5. BUCKET DE STORAGE
INSERT INTO storage.buckets (id, name, public) 
VALUES ('egoist-assets', 'egoist-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 6. ACTIVAR ROW LEVEL SECURITY
ALTER TABLE public.cosplayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS DE ACCESO TOTAL (PÚBLICO)
-- Estas políticas permiten que el admin local sin sesión pueda leer y escribir.

-- Drop previous policies to avoid conflicts (in case they exist)
DROP POLICY IF EXISTS "Public All" ON public.cosplayers;
DROP POLICY IF EXISTS "Public All" ON public.artistas;
DROP POLICY IF EXISTS "Public All" ON public.invitados;
DROP POLICY IF EXISTS "Public All" ON public.merch;
DROP POLICY IF EXISTS "Public All" ON public.horarios;
DROP POLICY IF EXISTS "Public All" ON public.home_content;

-- Crear políticas de acceso total a datos
CREATE POLICY "Public All" ON public.cosplayers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All" ON public.artistas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All" ON public.invitados FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All" ON public.merch FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All" ON public.horarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All" ON public.home_content FOR ALL USING (true) WITH CHECK (true);

-- Drop previous storage policies to avoid conflicts
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Crear políticas de acceso total a imágenes en bucket
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'egoist-assets');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'egoist-assets');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'egoist-assets');
