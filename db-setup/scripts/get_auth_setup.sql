-- Get authentication and authorization setup
SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    rolreplication,
    rolconnlimit,
    rolvaliduntil
FROM pg_roles
WHERE rolname NOT LIKE 'pg_%' AND rolname != 'postgres'
ORDER BY rolname;

-- Get RLS status for all tables
-- Removed forcerowsecurity column for PostgreSQL compatibility
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Get auth schema info (if using Supabase auth)
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth'
ORDER BY table_name, ordinal_position;
