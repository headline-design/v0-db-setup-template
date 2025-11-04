-- Get all indexes and their details
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef,
    CASE 
        WHEN indexdef LIKE '%UNIQUE%' THEN 'UNIQUE'
        WHEN indexdef LIKE '%btree%' THEN 'BTREE'
        WHEN indexdef LIKE '%gin%' THEN 'GIN'
        WHEN indexdef LIKE '%gist%' THEN 'GIST'
        ELSE 'OTHER'
    END as index_type
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
