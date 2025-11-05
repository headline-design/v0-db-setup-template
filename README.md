# v0 Database Setup Template

*A comprehensive template for integrating database setup and authentication with v0*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://v0-supabase-authentication-system-psi.vercel.app/)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/templates/Osn3Xx2aDmE)
[![GitHub Template](https://img.shields.io/badge/GitHub-Template-black?style=for-the-badge&logo=github)](https://github.com/headline-design/v0-db-setup-template)

## Overview

This template provides a complete foundation for building database-driven applications with v0. It includes a full Supabase authentication system and a powerful database schema extraction tool that helps v0 understand your database structure for more accurate code generation.

## 🤖 Why This Matters for v0's AI

**The database schema extraction tool is a game-changer for v0's AI capabilities.** By providing v0 with comprehensive schema information, you unlock significantly more intelligent and accurate code generation:

### Enhanced Understanding
- **Application Logic**: v0 understands your data relationships, business rules, and domain model
- **Security Context**: v0 sees your RLS policies and generates security-aware queries automatically
- **Data Validation**: v0 knows your constraints and generates proper validation logic
- **Query Optimization**: v0 references your indexes to write performant queries

### Better Code Generation
- **Accurate SQL**: Queries match your exact table structure, column types, and relationships
- **Smart JOINs**: v0 understands foreign keys and generates correct JOIN operations
- **Type Safety**: Generated TypeScript types match your actual database schema
- **Error Prevention**: v0 avoids referencing non-existent tables, columns, or functions

### Improved Troubleshooting
- **Context-Aware Debugging**: v0 can identify schema mismatches and suggest fixes
- **Migration Assistance**: v0 understands schema changes and helps update dependent code
- **RLS Policy Debugging**: v0 can explain why queries might fail due to security policies
- **Performance Analysis**: v0 suggests index improvements based on your query patterns

### Real-World Impact
Without schema context, v0 might generate:
\`\`\`sql
-- Generic, potentially incorrect query
SELECT * FROM users WHERE id = $1
\`\`\`

With schema context, v0 generates:
\`\`\`sql
-- Accurate query respecting your schema, RLS, and relationships
SELECT 
  u.id, 
  u.email, 
  u.created_at,
  p.display_name,
  p.avatar_url
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.id = $1
-- v0 knows this respects your RLS policy: profiles are only visible to the owner
\`\`\`

**Bottom line**: The schema extraction tool transforms v0 from a general-purpose code generator into a database-aware development partner that understands your specific application architecture.

## Quick Links

- **[Use this template in v0](https://v0.app/templates/Osn3Xx2aDmE)** - Start building with this template
- **[Live Demo](https://v0-supabase-authentication-system-psi.vercel.app/)** - See the template in action
- **[GitHub Repository](https://github.com/headline-design/v0-db-setup-template)** - Clone or fork the template

## What's Included

### Authentication System
- Complete Supabase authentication with email/password
- Login, signup, and password reset flows
- Email confirmation handling
- Protected routes with middleware
- Row Level Security (RLS) ready

### Database Schema Tool

> **⚠️ Important:** The `build-db-setup.mjs` script runs **locally on your machine**, not in v0. You run it in your local development environment to generate schema files, then use those files in v0 for enhanced AI understanding.

The `build-db-setup.mjs` script extracts comprehensive database information into JSON files that v0 can reference:

- **Tables**: Complete structure with columns, types, and relationships
- **Functions**: Custom database functions and stored procedures
- **Indexes**: Index definitions for query optimization
- **RLS Policies**: Row Level Security policies for data access control
- **Constraints**: Foreign keys, unique constraints, and check constraints
- **Triggers**: Database triggers and their definitions
- **Extensions**: Installed Postgres extensions

## Quick Start

### 1. Set Up Environment Variables

Add your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

**Example Mode (Optional)**

To preview the template without setting up Supabase:

\`\`\`env
NEXT_PUBLIC_EXAMPLE_MODE=true
\`\`\`

This allows you to explore the UI and pages without connecting a real database. Authentication will show example error messages, and protected routes will be accessible.

For database schema extraction, add your database connection:

\`\`\`env
POSTGRES_URL_WITH_PASSWORD=postgres://user:password@host:5432/database
\`\`\`

Or use individual variables:

\`\`\`env
POSTGRES_HOST=db.yourproject.supabase.co
POSTGRES_PORT=5432
POSTGRES_DATABASE=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
\`\`\`

### 2. Generate Database Schema

> **📍 Run this locally:** This command runs on your local machine, not in v0.

Extract your database schema for v0:

\`\`\`bash
npm run build:db-setup
\`\`\`

This creates a `db-setup/` directory with JSON files containing your complete database structure.

### 3. Start Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the template in action.

## Database Schema Benefits

With the generated schema files, v0 gains deep insight into your application:

### Query Generation
- Generate accurate SQL queries matching your exact table structure
- Understand foreign key relationships for proper JOIN operations
- Reference the correct column types and handle nullable fields appropriately
- Use existing indexes for optimized query performance

### Security & Validation
- Respect RLS policies when generating security-aware queries
- Understand constraints (unique, check, foreign key) for proper validation
- Generate code that aligns with your security model
- Avoid common security pitfalls by understanding your access control

### Advanced Features
- Utilize custom functions and stored procedures in generated code
- Understand triggers and their side effects
- Reference installed extensions (like PostGIS, pg_vector)
- Generate migration-safe code that respects your schema evolution

### Developer Experience
- Get accurate TypeScript types derived from your actual schema
- Receive context-aware suggestions and completions
- Debug issues faster with schema-aware error messages
- Maintain consistency between database and application code

## Keeping Schema Updated

> **💡 Tip:** Run this command locally whenever your database schema changes.

Run the schema extraction whenever you:
- Add or modify tables
- Create new functions or triggers
- Update RLS policies
- Change constraints or indexes

\`\`\`bash
npm run build:db-setup
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── auth/              # Authentication pages and routes
│   ├── protected/         # Example protected route
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   ├── login-form.tsx
│   ├── sign-up-form.tsx
│   └── ...
├── lib/
│   └── supabase/         # Supabase client utilities
├── scripts/
│   └── build-db-setup.mjs # Database schema extraction
├── db-setup/
│   ├── scripts/          # SQL query scripts
│   └── *.json           # Generated schema files
└── middleware.ts         # Session management
\`\`\`

## Documentation

For detailed setup instructions and troubleshooting, see:
- [Database Schema Setup Guide](./docs/DATABASE_SCHEMA_SETUP.md)
- [Environment Variables Guide](./docs/ENVIRONMENT_VARIABLES.md)

## Deployment

This template is deployed at:

**[https://v0-supabase-authentication-system-psi.vercel.app/](https://v0-supabase-authentication-system-psi.vercel.app/)**

## Use This Template

Get started with this template on v0:

**[https://v0.app/templates/Osn3Xx2aDmE](https://v0.app/templates/Osn3Xx2aDmE)**

Or clone from GitHub:

**[https://github.com/headline-design/v0-db-setup-template](https://github.com/headline-design/v0-db-setup-template)**

## How It Works

1. Use this template on [v0.app](https://v0.app/templates/Osn3Xx2aDmE) or clone from [GitHub](https://github.com/headline-design/v0-db-setup-template)
2. Connect your Supabase project and run the database schema extraction
3. Build and modify your project using v0's AI-powered development
4. Deploy to Vercel with automatic updates from your repository

## Why This Template?

This template bridges the gap between v0's AI-powered development and real-world database applications. By providing v0 with comprehensive schema information, you get more accurate code generation, better query optimization, and security-aware database interactions.
