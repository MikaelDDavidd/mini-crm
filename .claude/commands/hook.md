---
description: Create a custom React hook following best practices
---

Create a custom React hook following these guidelines:

**Arguments**: $ARGUMENTS (hook name and purpose)

**Requirements**:
- Name starts with "use" prefix
- Pure function when possible
- Single responsibility
- Proper TypeScript return types
- Handle cleanup in useEffect when needed
- Consider memoization (useMemo/useCallback) for expensive operations

**Common Hook Patterns**:
- **Data Fetching**: Use TanStack Query, not custom hooks
- **Form Management**: Use React Hook Form + Zod
- **Local State**: Simple useState/useReducer
- **Business Logic**: Extract from components

**Example Structure**:
```typescript
export const useHookName = (params: ParamsType) => {
  // Hook logic
  return { data, methods }
}
```
