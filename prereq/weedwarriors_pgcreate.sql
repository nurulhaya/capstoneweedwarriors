-- This script is intended to be run inside of an existing (empty) database.

CREATE EXTENSION postgis;

CREATE SEQUENCE IF NOT EXISTS catalog_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS media_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS reports_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS severity_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS tickets_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS users_id_seq START 1;

DROP TABLE IF EXISTS public.catalog;

CREATE TABLE IF NOT EXISTS public.catalog
(
    id integer NOT NULL DEFAULT nextval('catalog_id_seq'::regclass),
    usda_symbol character varying COLLATE pg_catalog."default" NOT NULL,
    latin_name character varying COLLATE pg_catalog."default" NOT NULL,
    common_name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT catalog_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.media;

CREATE TABLE IF NOT EXISTS public.media
(
    id integer NOT NULL DEFAULT nextval('media_id_seq'::regclass),
    url character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT media_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.reports;

CREATE TABLE IF NOT EXISTS public.reports
(
    id integer NOT NULL DEFAULT nextval('reports_id_seq'::regclass),
    catalog_id integer NOT NULL,
    severity_id integer NOT NULL,
    media_id integer NOT NULL,
    user_id integer NOT NULL,
    comments character varying COLLATE pg_catalog."default",
    verified boolean NOT NULL DEFAULT false,
    location geometry NOT NULL,
    created timestamp with time zone,
    CONSTRAINT reports_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.severity;

CREATE TABLE IF NOT EXISTS public.severity
(
    id integer NOT NULL DEFAULT nextval('severity_id_seq'::regclass),
    category character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT severity_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.tickets;

CREATE TABLE IF NOT EXISTS public.tickets
(
    id integer NOT NULL DEFAULT nextval('tickets_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    priority character varying COLLATE pg_catalog."default" NOT NULL,
    status character varying COLLATE pg_catalog."default" NOT NULL,
    created timestamp with time zone NOT NULL,
    last_modified timestamp with time zone NOT NULL,
    report_id integer NOT NULL,
    CONSTRAINT tickets_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    first_name character varying COLLATE pg_catalog."default" NOT NULL,
    last_name character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.reports
    ADD CONSTRAINT reports_catalog_id_fkey FOREIGN KEY (catalog_id)
    REFERENCES public.catalog (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.reports
    ADD CONSTRAINT reports_media_id_fkey FOREIGN KEY (media_id)
    REFERENCES public.media (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.reports
    ADD CONSTRAINT reports_severity_id_fkey FOREIGN KEY (severity_id)
    REFERENCES public.severity (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;