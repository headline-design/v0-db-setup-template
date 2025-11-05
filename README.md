# v0 Database Setup Template

*A comprehensive template for integrating database setup and authentication with v0*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/headline-team/v0-supabase-authentication-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/pK1kLOQcvs5)

## Overview

This template provides a complete foundation for building database-driven applications with v0. It includes a full Supabase authentication system and a powerful database schema extraction tool that helps v0 understand your database structure for more accurate code generation.

## What's Included

### Authentication System
- Complete Supabase authentication with email/password
- Login, signup, and password reset flows
- Email confirmation handling
- Protected routes with middleware
- Row Level Security (RLS) ready

### Database Schema Tool
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

With the generated schema files, v0 can:

- Generate accurate SQL queries matching your exact table structure
- Understand foreign key relationships for JOIN operations
- Respect RLS policies when generating security-aware queries
- Utilize existing indexes for optimized queries
- Reference custom functions in generated code
- Understand data types and constraints for proper validation

## Keeping Schema Updated

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

## Deployment

Your project is live at:

**[https://vercel.com/headline-team/v0-supabase-authentication-system](https://vercel.com/headline-team/v0-supabase-authentication-system)**

## Continue Building

Build and modify your app on:

**[https://v0.app/chat/pK1kLOQcvs5](https://v0.app/chat/pK1kLOQcvs5)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Why This Template?

This template bridges the gap between v0's AI-powered development and real-world database applications. By providing v0 with comprehensive schema information, you get more accurate code generation, better query optimization, and security-aware database interactions.
