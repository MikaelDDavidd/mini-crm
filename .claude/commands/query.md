---
description: Generate Supabase SQL query based on requirements
---

Generate a Supabase SQL query following project database standards:

**Arguments**: $ARGUMENTS (describe what the query should do)

**Requirements**:
- Use UUID for primary keys (gen_random_uuid())
- Include proper foreign key constraints
- Add ON DELETE CASCADE where appropriate
- Create indexes for frequently queried columns
- Enable Row Level Security (RLS)
- Add RLS policies for user data isolation
- Include timestamps (created_at, updated_at)
- Add triggers for auto-updating updated_at

**Security**:
- Always create RLS policies
- User can only access their own data
- Use auth.uid() in policies

**Format**:
- Clear table and column names
- Proper data types
- NOT NULL where required
- Default values where appropriate
