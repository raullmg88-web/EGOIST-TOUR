-- Supabase Setup Script para EGOIST TOUR
-- Ejecuta este script en el SQL Editor de tu panel de Supabase

-- 1. TABLAS COMUNES (Cosplayers, Artistas, Invitados)
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
    day TEXT NOT NULL, -- ej: "11 Diciembre"
    start_time TEXT NOT NULL, -- ej: "16:30"
    end_time TEXT, -- ej: "19:30"
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

-- Insertar fila única por defecto para home_content
INSERT INTO public.home_content (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- 5. BUCKET DE STORAGE
-- Inserta un bucket llamado "egoist-assets" si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('egoist-assets', 'egoist-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Permitir a cualquiera ver (seleccionar) imágenes
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'egoist-assets');

-- Política: Permitir a usuarios autenticados subir, actualizar o borrar imágenes
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'egoist-assets');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'egoist-assets');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'egoist-assets');

-- Opcional: Políticas RLS para las tablas (ahora mismo todo el mundo puede leer, solo autenticados pueden escribir)
-- Activar RLS en todas las tablas
ALTER TABLE public.cosplayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;

-- Políticas genéricas de lectura pública
CREATE POLICY "Public Read" ON public.cosplayers FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.artistas FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.invitados FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.merch FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.horarios FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.home_content FOR SELECT USING (true);

-- Políticas genéricas de escritura para admins (usuarios autenticados)
CREATE POLICY "Admin All" ON public.cosplayers TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All" ON public.artistas TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All" ON public.invitados TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All" ON public.merch TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All" ON public.horarios TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All" ON public.home_content TO authenticated USING (true) WITH CHECK (true);
