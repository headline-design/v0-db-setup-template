// ... existing code ...

## Database Schema Extraction

// <CHANGE> Added prominent note about local execution
> **⚠️ Important:** These variables are used by the `build-db-setup.mjs` script, which you run **locally on your machine** (not in v0). The script connects to your database from your local environment and generates schema files that v0 can then reference.

These variables are used by the `build-db-setup.mjs` script to extract your database schema.

// ... existing code ...

## Setup Instructions

// ... existing code ...

### For Database Schema Extraction

// <CHANGE> Clarified local execution context
> **💻 Run locally:** These commands execute on your local machine.

1. Add database connection to your `.env.local`:
   \`\`\`env
   POSTGRES_URL_WITH_PASSWORD=postgres://postgres:password@host:5432/database
   \`\`\`
2. Run the schema extraction script **locally**:
   \`\`\`bash
   npm run build:db-setup
   \`\`\`
3. Commit the generated `db-setup/*.json` files to your repository
4. v0 will use these files to understand your database structure

// ... existing code ...
\`\`\`

```tsx file="" isHidden
