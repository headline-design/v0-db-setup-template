# Environment Variables Guide

This document explains all environment variables used in the v0 Database Setup Template.

## Table of Contents

- [Supabase Configuration](#supabase-configuration)
- [Example Mode](#example-mode)
- [Database Schema Extraction](#database-schema-extraction)
- [Setup Instructions](#setup-instructions)

---

## Supabase Configuration

These variables are required for the authentication system to work.

### `NEXT_PUBLIC_SUPABASE_URL`

**Required:** Yes (unless using Example Mode)  
**Description:** Your Supabase project URL  
**Example:** `https://abcdefghijklmnop.supabase.co`

**Where to find it:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings → API
4. Copy the "Project URL"

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Required:** Yes (unless using Example Mode)  
**Description:** Your Supabase anonymous/public API key  
**Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Where to find it:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings → API
4. Copy the "anon public" key

### `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

**Required:** No (but recommended for development)  
**Description:** Redirect URL for email confirmations during local development  
**Default:** `http://localhost:3000`  
**Example:** `http://localhost:3000`

**Note:** In production, the app automatically uses `window.location.origin` for redirects.

---

## Example Mode

### `NEXT_PUBLIC_EXAMPLE_MODE`

**Required:** No  
**Description:** Enables preview mode without requiring Supabase connection  
**Values:** `true` or `false`  
**Default:** `false`

**When to use:**
- Exploring the template UI before setting up Supabase
- Demonstrating the template to others
- Development without database access

**Example:**
\`\`\`env
NEXT_PUBLIC_EXAMPLE_MODE=true
\`\`\`

**Important:** Set to `false` or remove this variable when you're ready to connect your actual Supabase database.

---

## Database Schema Extraction

These variables are used by the `build-db-setup.mjs` script to extract your database schema.

### Option 1: Connection URL (Recommended)

#### `POSTGRES_URL_WITH_PASSWORD`

**Required:** Yes (for schema extraction)  
**Description:** Complete PostgreSQL connection URL with password  
**Format:** `postgres://USER:PASSWORD@HOST:PORT/DATABASE`

**Examples:**

**Supabase:**
\`\`\`env
POSTGRES_URL_WITH_PASSWORD=postgres://postgres:your_password@db.yourproject.supabase.co:5432/postgres
\`\`\`

**Neon:**
\`\`\`env
POSTGRES_URL_WITH_PASSWORD=postgres://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
\`\`\`

**Local PostgreSQL:**
\`\`\`env
POSTGRES_URL_WITH_PASSWORD=postgres://postgres:password@localhost:5432/mydb
\`\`\`

**Where to find it (Supabase):**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings → Database
4. Find "Connection string" under "Connection pooling"
5. Select "URI" mode
6. Copy the connection string and replace `[YOUR-PASSWORD]` with your actual database password

### Option 2: Individual Variables (Alternative)

If you prefer not to use a connection URL, you can set these individual variables:

#### `POSTGRES_HOST`

**Required:** Yes (if not using URL)  
**Description:** Database host address  
**Example:** `db.yourproject.supabase.co`

#### `PGPORT`

**Required:** No  
**Description:** Database port  
**Default:** `5432`  
**Example:** `5432`

#### `POSTGRES_DATABASE`

**Required:** No  
**Description:** Database name  
**Default:** `postgres`  
**Example:** `postgres`

#### `POSTGRES_USER`

**Required:** No  
**Description:** Database user  
**Default:** `postgres`  
**Example:** `postgres`

#### `POSTGRES_PASSWORD`

**Required:** Yes (if not using URL)  
**Description:** Database password  
**Example:** `your_secure_password`

---

## Setup Instructions

### For Authentication Only

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`
3. Remove or set `NEXT_PUBLIC_EXAMPLE_MODE=false`

### For Database Schema Extraction

1. Add database connection to your `.env.local`:
   \`\`\`env
   POSTGRES_URL_WITH_PASSWORD=postgres://postgres:password@host:5432/database
   \`\`\`
2. Run the schema extraction script:
   \`\`\`bash
   npm run build:db-setup
   \`\`\`

### For Preview/Demo Mode

1. Create a `.env.local` file
2. Add only:
   \`\`\`env
   NEXT_PUBLIC_EXAMPLE_MODE=true
   \`\`\`
3. Start the development server

---

## Security Notes

- **Never commit `.env.local` to version control**
- The `.env.example` file is safe to commit (contains no real credentials)
- Use different credentials for development and production
- Rotate your database password regularly
- The `NEXT_PUBLIC_` prefix makes variables accessible in the browser - only use it for non-sensitive data

---

## Troubleshooting

### "Your project's URL and Key are required to create a Supabase client"

**Solution:** Either:
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- Or enable example mode with `NEXT_PUBLIC_EXAMPLE_MODE=true`

### Schema extraction fails with "Missing DB credentials"

**Solution:** Ensure you've set either:
- `POSTGRES_URL_WITH_PASSWORD` (recommended)
- Or all of: `POSTGRES_HOST`, `POSTGRES_PASSWORD`, and optionally `PGPORT`, `POSTGRES_DATABASE`, `POSTGRES_USER`

### Email confirmations redirect to wrong URL

**Solution:** Set `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000` in your `.env.local`

---

## Additional Resources

- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
