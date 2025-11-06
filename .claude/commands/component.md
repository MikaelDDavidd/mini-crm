---
description: Create a new React component following project best practices
---

Create a new React component following these guidelines:

**Arguments**: $ARGUMENTS (component name and location)

**Requirements**:
- Follow KISS, SOLID, DRY principles
- TypeScript with strict typing
- Functional component with proper props interface
- Extract repeated logic to custom hooks
- Keep component small and focused (Single Responsibility)
- Use Tailwind CSS for styling
- Mobile-first responsive design
- Proper error boundaries if needed

**File Structure**:
- Component file: ComponentName.tsx
- Test file: ComponentName.test.tsx (if complex logic)
- Types in same file or separate types.ts if shared

**Checklist**:
1. Is this component doing only one thing?
2. Can any logic be extracted to a custom hook?
3. Are repeated UI patterns using existing components?
4. Is it responsive and accessible?
5. Are prop types properly defined?
