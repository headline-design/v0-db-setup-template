# Enhancing v0's Database Understanding with build-db-setup.mjs

When working with databases in v0, providing comprehensive schema information helps v0 generate more accurate queries, understand your data relationships, and create better database interactions. The `build-db-setup.mjs` script extracts your complete database schema into structured JSON files that v0 can reference.

## What It Does

The script connects to your Postgres database and extracts:

- **Tables**: Complete table structures with columns, types, and relationships
- **Functions**: Custom database functions and stored procedures
- **Indexes**: Index definitions for query optimization
- **RLS Policies**: Row Level Security policies for data access control
- **Constraints**: Foreign keys, unique constraints, and check constraints
- **Triggers**: Database triggers and their definitions
- **Extensions**: Installed Postgres extensions

All this information is saved as JSON files in a `db-setup/` directory, giving v0 a complete picture of your database architecture.

## Setup Instructions

### Step 1: Add the Build Script

Create `scripts/build-db-setup.mjs` in your project:

\`\`\`javascript
// scripts/build-db-setup.mjs

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Pool } from "pg";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// You can provide either POSTGRES_URL_WITH_PASSWORD or individual PG env vars
const DB_URL = process.env.POSTGRES_URL_WITH_PASSWORD;

// Fallback to discrete vars if URL is not set
const PGHOST = process.env.POSTGRES_HOST;
const PGPORT = process.env.PGPORT || "5432";
const PGDATABASE = process.env.POSTGRES_DATABASE || "postgres";
const PGUSER = process.env.POSTGRES_USER || "postgres";
const PGPASSWORD = process.env.POSTGRES_PASSWORD;

function createPool() {
  if (DB_URL) {
    return new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  }
  if (!PGHOST || !PGPASSWORD) {
    throw new Error(
      "Missing DB credentials. Set POSTGRES_URL_WITH_PASSWORD or PGHOST, PGPASSWORD, and optionally PGPORT, PGDATABASE, PGUSER."
    );
  }
  return new Pool({
    host: PGHOST,
    port: Number(PGPORT),
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    ssl: { rejectUnauthorized: false }
  });
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function readSQLFile(filename) {
  const sqlPath = path.join(process.cwd(), "db-setup", "scripts", filename);
  if (!fs.existsSync(sqlPath)) {
    throw new Error(`SQL file not found: ${sqlPath}`);
  }
  return fs.readFileSync(sqlPath, "utf8");
}

async function executeMultipleQueries(pool, sqlContent) {
  const queries = sqlContent
    .split(';')
    .map(q => q.trim())
    .filter(q => q.length > 0 && !q.startsWith('--'));

  let allResults = [];

  for (const query of queries) {
    if (query.trim()) {
      try {
        const result = await pool.query(query);
        if (result.rows && result.rows.length > 0) {
          allResults = allResults.concat(result.rows);
        }
      } catch (error) {
        console.warn(`⚠️  Warning: Query failed: ${error.message}`);
      }
    }
  }

  return { rows: allResults || [] };
}

const DB_QUERIES = [
  {
    name: "tables",
    outputFile: "tables.json",
    description: "Getting comprehensive table information",
    sqlFile: "get_all_tables_detailed.sql"
  },
  {
    name: "functions",
    outputFile: "functions.json",
    description: "Getting custom functions",
    sqlFile: "get_all_functions.sql"
  },
  {
    name: "indexes",
    outputFile: "indexes.json",
    description: "Getting index information",
    sqlFile: "get_all_indexes.sql"
  },
  {
    name: "rls-policies",
    outputFile: "rls-policies.json",
    description: "Getting RLS policies",
    sqlFile: "get_all_rls_policies.sql"
  },
  {
    name: "constraints",
    outputFile: "constraints.json",
    description: "Getting constraint information",
    sqlFile: "get_all_constraints.sql"
  },
  {
    name: "triggers",
    outputFile: "triggers.json",
    description: "Getting trigger information",
    sqlFile: "get_all_triggers.sql"
  },
  {
    name: "extensions",
    outputFile: "extensions.json",
    description: "Getting installed extensions",
    sqlFile: "get_extensions.sql"
  }
];

async function main() {
  console.log("[dotenv] loaded. Starting database build generation...");
  const outDir = path.join(process.cwd(), "db-setup");
  ensureDir(outDir);

  const pool = createPool();

  const executionSummary = [];
  const results = {};

  try {
    for (const queryConfig of DB_QUERIES) {
      console.log(`📄 ${queryConfig.description}...`);

      try {
        const sqlQuery = readSQLFile(queryConfig.sqlFile);

        let queryRes;
        if (sqlQuery.includes(';') && sqlQuery.split(';').filter(q => q.trim() && !q.startsWith('--')).length > 1) {
          queryRes = await executeMultipleQueries(pool, sqlQuery);
        } else {
          queryRes = await pool.query(sqlQuery);
        }

        const data = queryRes.rows || [];

        fs.writeFileSync(path.join(outDir, queryConfig.outputFile), JSON.stringify(data, null, 2));

        executionSummary.push({
          script: queryConfig.name,
          output: queryConfig.outputFile,
          records: data.length,
          status: "success"
        });
        results[queryConfig.name] = { success: true, recordCount: data.length };

        console.log(`💾 Saved ${queryConfig.outputFile} (${data.length} records)`);
      } catch (error) {
        console.error(`❌ Error executing ${queryConfig.name}:`, error.message);

        executionSummary.push({
          script: queryConfig.name,
          output: queryConfig.outputFile,
          records: 0,
          status: "error",
          error: error.message
        });
        results[queryConfig.name] = { success: false, error: error.message };
      }
    }

    const buildMetadata = {
      generatedAt: new Date().toISOString(),
      method: "direct_postgres",
      successfulExecutions: executionSummary.filter(s => s.status === "success").length,
      failedExecutions: executionSummary.filter(s => s.status !== "success").length,
      executionSummary,
      results
    };
    fs.writeFileSync(path.join(outDir, "build-metadata.json"), JSON.stringify(buildMetadata, null, 2));

    console.log("\n🎉 Database build generation complete!");
    console.log("📊 Execution Summary:");
    console.log(`   ✅ Successful: ${buildMetadata.successfulExecutions}`);
    console.log(`   ❌ Failed: ${buildMetadata.failedExecutions}`);
    console.log("   📁 Output directory: db-setup/");
  } catch (err) {
    console.error("❌ Error generating database build:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error("❌ Unhandled error:", err);
  process.exit(1);
});
\`\`\`

### Step 2: Create SQL Query Scripts

Create a `db-setup/scripts/` directory and add the following SQL files:

**`db-setup/scripts/get_all_tables_detailed.sql`**
\`\`\`sql
SELECT
  t.table_schema,
  t.table_name,
  t.table_type,
  c.column_name,
  c.ordinal_position,
  c.column_default,
  c.is_nullable,
  c.data_type,
  c.character_maximum_length,
  c.numeric_precision,
  c.numeric_scale,
  c.udt_name,
  obj_description((t.table_schema || '.' || t.table_name)::regclass, 'pg_class') as table_comment,
  col_description((t.table_schema || '.' || t.table_name)::regclass, c.ordinal_position) as column_comment
FROM information_schema.tables t
LEFT JOIN information_schema.columns c
  ON t.table_schema = c.table_schema
  AND t.table_name = c.table_name
WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND t.table_type IN ('BASE TABLE', 'VIEW')
ORDER BY t.table_schema, t.table_name, c.ordinal_position;
\`\`\`

**`db-setup/scripts/get_all_functions.sql`**
\`\`\`sql
SELECT
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as return_type,
  l.lanname as language,
  CASE p.provolatile
    WHEN 'i' THEN 'IMMUTABLE'
    WHEN 's' THEN 'STABLE'
    WHEN 'v' THEN 'VOLATILE'
  END as volatility,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
LEFT JOIN pg_language l ON p.prolang = l.oid
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY n.nspname, p.proname;
\`\`\`

**`db-setup/scripts/get_all_indexes.sql`**
\`\`\`sql
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename, indexname;
\`\`\`

**`db-setup/scripts/get_all_rls_policies.sql`**
\`\`\`sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename, policyname;
\`\`\`

**`db-setup/scripts/get_all_constraints.sql`**
\`\`\`sql
SELECT
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
  AND tc.table_schema = rc.constraint_schema
WHERE tc.table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY tc.table_schema, tc.table_name, tc.constraint_name;
\`\`\`

**`db-setup/scripts/get_all_triggers.sql`**
\`\`\`sql
SELECT
  trigger_schema,
  trigger_name,
  event_manipulation,
  event_object_schema,
  event_object_table,
  action_statement,
  action_timing,
  action_orientation
FROM information_schema.triggers
WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY trigger_schema, event_object_table, trigger_name;
\`\`\`

**`db-setup/scripts/get_extensions.sql`**
\`\`\`sql
SELECT
  extname as extension_name,
  extversion as version,
  n.nspname as schema_name
FROM pg_extension e
LEFT JOIN pg_namespace n ON e.extnamespace = n.oid
ORDER BY extname;
\`\`\`

### Step 3: Add NPM Script

Add the build script to your `package.json`:

\`\`\`json
{
  "scripts": {
    "build:db-setup": "node scripts/build-db-setup.mjs"
  }
}
\`\`\`

### Step 4: Configure Environment Variables

The script supports two connection methods:

**Option A: Connection URL (Recommended)**
\`\`\`env
POSTGRES_URL_WITH_PASSWORD=postgres://user:password@host:5432/database
\`\`\`

**Option B: Individual Variables**
\`\`\`env
POSTGRES_HOST=db.yourproject.supabase.co
POSTGRES_PORT=5432
POSTGRES_DATABASE=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
\`\`\`

### Step 5: Run the Script

Generate your database schema files:

\`\`\`bash
npm run build:db-setup
\`\`\`

This creates a `db-setup/` directory with:
- `tables.json` - Complete table and column information
- `functions.json` - Custom database functions
- `indexes.json` - Index definitions
- `rls-policies.json` - Row Level Security policies
- `constraints.json` - Foreign keys and constraints
- `triggers.json` - Database triggers
- `extensions.json` - Installed extensions
- `build-metadata.json` - Generation metadata and summary

### Step 6: Add to .gitignore (Optional)

If your schema contains sensitive information, add to `.gitignore`:

\`\`\`
db-setup/*.json
!db-setup/scripts/
\`\`\`

## Benefits for v0

With these schema files in your project, v0 can:

- Generate accurate SQL queries that match your exact table structure
- Understand foreign key relationships for JOIN operations
- Respect RLS policies when generating security-aware queries
- Utilize existing indexes for optimized queries
- Reference custom functions in generated code
- Understand data types and constraints for proper validation

## Keeping Schema Updated

Run `npm run build:db-setup` whenever you:
- Add or modify tables
- Create new functions or triggers
- Update RLS policies
- Change constraints or indexes

Consider adding this to your development workflow or CI/CD pipeline to keep schema information current.

## Troubleshooting

**Connection Issues**
- Verify your database credentials are correct
- Ensure your IP is whitelisted (for cloud databases)
- Check that SSL is properly configured

**Missing SQL Files**
- Ensure all SQL files exist in `db-setup/scripts/`
- Verify file names match exactly (case-sensitive)

**Permission Errors**
- Your database user needs read access to system tables
- For Supabase, use the connection string from your project settings

## Why Not Drizzle?

While Drizzle is excellent for schema management and migrations, this approach:
- Works with any existing database without requiring Drizzle setup
- Captures runtime information like RLS policies and triggers
- Provides a complete snapshot of your actual database state
- Doesn't require maintaining separate schema files
- Works alongside Drizzle if you're already using it

This is a complementary tool that gives v0 comprehensive database context regardless of your ORM choice.
