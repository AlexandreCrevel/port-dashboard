-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create read-only role for NLQ queries
CREATE ROLE lehavre_readonly WITH LOGIN PASSWORD 'readonly_dev';
GRANT CONNECT ON DATABASE lehavre_port TO lehavre_readonly;
GRANT USAGE ON SCHEMA public TO lehavre_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO lehavre_readonly;

-- Create n8n database
CREATE DATABASE n8n;
