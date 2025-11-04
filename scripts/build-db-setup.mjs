// scripts/build-db-setup.mjs

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Pool } from "pg";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// You can provide either SUPABASE_DB_URL or individual PG env vars
// Preferred: a single URL. Example:
// SUPABASE_DB_URL=postgres://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
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
      "Missing DB credentials. Set SUPABASE_DB_URL or PGHOST, PGPASSWORD, and optionally PGPORT, PGDATABASE, PGUSER."
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
  // Split SQL content by semicolons and filter out empty queries
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
        console.warn(`⚠️  Failed query: ${query.substring(0, 100)}...`);
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

    // Build metadata
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
    if (buildMetadata.successfulExecutions > 0) {
      console.log("\n📄 Generated files:");
      for (const s of executionSummary.filter(s => s.status === "success")) {
        console.log(`   - ${s.output} (${s.records} records)`);
      }
    }
    if (buildMetadata.failedExecutions > 0) {
      console.log("\n❌ Failed files:");
      for (const s of executionSummary.filter(s => s.status !== "success")) {
        console.log(`   - ${s.output}: ${s.error}`);
      }
    }
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
