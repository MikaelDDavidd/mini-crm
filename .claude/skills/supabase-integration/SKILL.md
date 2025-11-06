---
name: supabase-integration
description: Handle Supabase database operations, authentication, and RLS policies securely
---

# Supabase Integration Skill

This skill handles all Supabase-related operations following security best practices.

## Authentication

### Supabase Auth Features
- Email/password authentication with bcrypt hashing
- JWT token management (automatic)
- Session handling
- Password reset flows
- Email verification

### Implementation
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

## Row Level Security (RLS)

### Required Setup
1. Enable RLS on all tables
2. Create policies for each operation (SELECT, INSERT, UPDATE, DELETE)
3. Use auth.uid() to match user_id

### Policy Template
```sql
-- SELECT policy
CREATE POLICY "Users can view their own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert their own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own data" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete their own data" ON table_name
  FOR DELETE USING (auth.uid() = user_id);
```

## Database Operations

### Using Supabase Client
```typescript
// Select
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('status', 'new')

// Insert
const { data, error } = await supabase
  .from('leads')
  .insert({ name: 'John Doe', email: 'john@example.com' })

// Update
const { data, error } = await supabase
  .from('leads')
  .update({ status: 'contacted' })
  .eq('id', leadId)

// Delete
const { data, error } = await supabase
  .from('leads')
  .delete()
  .eq('id', leadId)
```

## Real-time Subscriptions

```typescript
const channel = supabase
  .channel('leads-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'leads' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Policies created for all CRUD operations
- [ ] User can only access own data (user_id check)
- [ ] No service key exposed to frontend
- [ ] Environment variables properly set
- [ ] Input validation before database operations
- [ ] Error handling for all operations

## Best Practices

1. **Always use RLS** - Never trust client-side security alone
2. **Validate inputs** - Use Zod schemas before database operations
3. **Handle errors** - Don't expose database errors to users
4. **Use transactions** - For multiple related operations
5. **Index properly** - Add indexes on foreign keys and frequently queried columns
6. **Type safety** - Generate TypeScript types from database schema
