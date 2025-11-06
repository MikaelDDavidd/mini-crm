---
name: crm-component
description: Create React components for CRM following KISS, SOLID, DRY principles and project patterns
---

# CRM Component Generator

This skill creates React components for the mini CRM project following KISS, SOLID, and DRY principles.

## Component Structure

All components should follow this structure:

### File Organization
```
/frontend/src/components/
  /[feature-name]/
    Component.tsx
    Component.test.tsx
    types.ts
    hooks.ts (if needed)
    utils.ts (if needed)
```

### Component Template

```typescript
import { FC } from 'react'

interface ComponentNameProps {
  // Props definition
}

export const ComponentName: FC<ComponentNameProps> = ({ }) => {
  return (
    <div>
      {/* Component content */}
    </div>
  )
}
```

## Best Practices

### KISS (Keep It Simple)
1. One component does one thing
2. Simple, readable JSX
3. Avoid premature optimization
4. Clear, descriptive names

### SOLID Principles
1. **Single Responsibility**: Component has one clear purpose
2. **Open/Closed**: Extend with props, not modification
3. **Interface Segregation**: Accept only needed props

### DRY (Don't Repeat Yourself)
1. Extract repeated UI into smaller components
2. Use composition for variants
3. Create custom hooks for repeated logic
4. Reuse existing UI components

### Technical
1. TypeScript strictly typed interfaces
2. Tailwind CSS for styling
3. Mobile-first responsive design
4. Lucide React for icons
5. Proper accessibility (ARIA labels)
6. Error boundaries for complex components

## Examples

### Form Component
- Use React Hook Form + Zod validation
- Include proper error messages
- Add loading states
- Implement field masks

### Data Display Component
- Use TanStack Query for data fetching
- Add loading and error states
- Implement pagination if needed
- Make it responsive

### Interactive Component
- Add proper event handlers
- Implement optimistic updates
- Use Zustand for state if global
- Add animations with Tailwind

## Testing

Each component should have:
- Unit tests with Vitest
- Component tests with Testing Library
- Accessibility tests
- Responsive design tests
