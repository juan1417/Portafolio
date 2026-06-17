-- ============================================================
-- Portafolio — Esquema completo de Supabase (public)
-- Guarda esto como backup. Si algún día borras las tablas,
-- corres este SQL en Supabase SQL Editor y quedan igual.
-- ============================================================

-- Proyectos sincronizados desde GitHub
CREATE TABLE IF NOT EXISTS public.projects (
    id          UUID NOT NULL DEFAULT gen_random_uuid(),
    name        TEXT,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    github_id   BIGINT NOT NULL,
    stars       INTEGER DEFAULT 0,
    topics      TEXT[],
    featured    BOOLEAN DEFAULT false,
    cached_at   TIMESTAMPTZ DEFAULT now(),
    url             TEXT,
    description_en  TEXT,
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_github_id_key UNIQUE (github_id)
);

-- Mensajes del formulario de contacto
CREATE TABLE IF NOT EXISTS public.contact (
    id         UUID NOT NULL DEFAULT gen_random_uuid(),
    name       VARCHAR(255),
    email      TEXT,
    content    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status     TEXT DEFAULT 'unread'::text,
    source     TEXT DEFAULT 'form'::text,
    CONSTRAINT contact_pkey PRIMARY KEY (id)
);

-- Analytics de páginas visitadas
CREATE TABLE IF NOT EXISTS public.page_views (
    id         UUID NOT NULL DEFAULT gen_random_uuid(),
    page       TEXT NOT NULL,
    country    TEXT,
    referrer   TEXT,
    user_agent TEXT,
    visited_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT page_views_pkey PRIMARY KEY (id)
);

-- Usuarios admin para el panel
CREATE TABLE IF NOT EXISTS public.admin_users (
    id            UUID NOT NULL DEFAULT gen_random_uuid(),
    email         TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT admin_users_pkey PRIMARY KEY (id),
    CONSTRAINT admin_users_email_key UNIQUE (email)
);
