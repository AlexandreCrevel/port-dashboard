-- Dev-only initialization script.
-- Run once by docker-entrypoint-initdb.d on first container start.
-- Production credentials must be injected via environment variables or secrets.

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create read-only role for NLQ queries (dev-only password)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lehavre_readonly') THEN
    CREATE ROLE lehavre_readonly WITH LOGIN PASSWORD 'readonly_dev'; -- dev-only password
    GRANT CONNECT ON DATABASE lehavre_port TO lehavre_readonly;
    GRANT USAGE ON SCHEMA public TO lehavre_readonly;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO lehavre_readonly;
  END IF;
END $$;

-- Create n8n database (idempotent check)
SELECT 'CREATE DATABASE n8n' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'n8n')\gexec
