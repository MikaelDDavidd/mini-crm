---
description: Create a database migration file
---

Create a new database migration for Supabase:

**Arguments**: $ARGUMENTS (migration name and description)

**Migration Format**:
```sql
-- Migration: [Name]
-- Description: [What this migration does]
-- Date: [Current date]

-- Up Migration
[SQL commands]

-- Down Migration (optional)
[Rollback commands]
```

**Best Practices**:
- One migration per logical change
- Make migrations reversible when possible
- Test migrations in development first
- Include comments for complex operations
- Update RLS policies if table structure changes
