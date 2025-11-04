-- Get all installed extensions
SELECT 
    extname,
    extversion,
    nspname as schema_name,
    extrelocatable,
    extconfig
FROM pg_extension
LEFT JOIN pg_namespace ON pg_extension.extnamespace = pg_namespace.oid
ORDER BY extname;
