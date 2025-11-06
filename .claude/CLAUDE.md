# Mini CRM Project

## Overview
Complete and responsive CRM application with modern UI/UX design, optimized for both desktop and mobile devices.

## Tech Stack

### Frontend
- React 19 + TypeScript - Framework and language
- Vite 7 - Build tool
- Tailwind CSS 3.4 - Styling
- Zustand - State management
- TanStack Query (React Query) - Cache and data fetching management
- Shadcn/UI (Radix UI + Tailwind) - Ready-to-use UI components
- Recharts - Charts and visualizations
- Socket.IO Client - Real-time communication
- Axios - HTTP client
- Lucide React - Icons
- React Hook Form - Form management
- Zod - Schema validation
- date-fns - Date manipulation

### Backend
- Node.js + Express - Server framework
- Supabase - Database and authentication
- Socket.IO - Real-time communication
- Zod - Schema validation

### Development & Quality
- ESLint - Linting
- Prettier - Code formatting
- Vitest - Testing framework
- Testing Library - React component testing
- Husky + lint-staged - Git hooks for code quality
- TypeScript 5.9 - Type checking

## Project Structure
```
/frontend - React application
/backend - Node.js API server
/.claude - Claude Code configuration
  /commands - Custom slash commands
  /skills - Project skills
  CLAUDE.md - Project memory
```

## Requirements

### Core Features
- User authentication for secure access
- Main interface with Kanban-style pipeline
- Manual lead insertion via form
- Lead import via spreadsheet (.csv or .xlsx)
- Search and filters (name, stage, date, source)
- Data export to spreadsheet
- Detail screen for each lead
- Complete interaction history

### Lead Details
- Name
- Email
- Phone
- Company
- Notes
- Status
- Interaction history

### Design Guidelines
- Modern, clean and easy-to-use layout
- Prioritize UX for common tasks: add, move, search, edit, export
- Functional interface on desktop and mobile
- Field validations, masks and value formatting
- Fully responsive design
- Professional color scheme
- Intuitive navigation

## Code Standards & Best Practices

### Core Principles

#### KISS (Keep It Simple, Stupid)
- Write simple, straightforward code
- Avoid over-engineering solutions
- Prefer clarity over cleverness
- One function should do one thing well
- Keep components small and focused

#### SOLID Principles
- **Single Responsibility**: Each module/component has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for their base types
- **Interface Segregation**: Many specific interfaces over one general interface
- **Dependency Inversion**: Depend on abstractions, not concretions

#### DRY (Don't Repeat Yourself)
- Extract repeated logic into reusable functions
- Create custom hooks for repeated React patterns
- Componentize repeated UI patterns
- Use utility functions for common operations
- Share types between frontend and backend

### General
- All code in English
- No comments in code (self-documenting code)
- Strict TypeScript typing
- Functional and clean code patterns
- Component-based architecture
- Pure functions when possible
- Immutable data structures

### File Organization
- Feature-based folder structure
- Separated concerns (components, hooks, utils, types)
- Atomic design principles for UI components
- Colocation of related files
- Clear naming conventions

### State Management
- Zustand for global state (keep minimal)
- TanStack Query for server state (single source of truth)
- Local state with React hooks when appropriate
- Avoid prop drilling - use composition
- Derive state when possible instead of storing

### API Integration
- RESTful endpoints
- Real-time updates with Socket.IO
- Optimistic updates for better UX
- Error handling and loading states
- Retry logic for failed requests
- Request cancellation on unmount

## Development Workflow
- Feature branch workflow
- Component-driven development
- Mobile-first responsive design
- Progressive enhancement

## Security & Authentication

### Supabase Authentication
- Use Supabase Auth for user management
- Passwords hashed with bcrypt (handled by Supabase)
- JWT tokens for session management
- Row Level Security (RLS) enabled on all tables
- User can only access their own data

### Best Practices
- Never store passwords in plain text
- Use environment variables for sensitive data
- Validate all inputs on frontend and backend
- Sanitize user inputs to prevent XSS
- Use HTTPS in production
- Implement rate limiting
- CORS configured properly

### Data Security
- RLS policies on all Supabase tables
- Server-side validation with Zod schemas
- Client-side validation for UX
- Secure WebSocket connections

## Database Structure

### Tables
- **users**: Managed by Supabase Auth
- **leads**: Lead information with user_id foreign key
- **lead_interactions**: History of interactions per lead

### Key Concepts
- UUID for all primary keys
- Timestamps for created_at and updated_at
- Soft deletes where needed
- Indexes on frequently queried columns
- Foreign keys with CASCADE deletes

## Component Architecture

### Component Types
- **Pages**: Top-level route components
- **Features**: Business logic components (leads, auth)
- **UI**: Reusable presentational components
- **Layout**: Structure components (header, sidebar, container)

### Component Rules
- Extract repeated UI into components
- Keep JSX simple and readable
- Use composition over inheritance
- Props should be typed interfaces
- Extract complex logic to custom hooks
- One component per file

## Important Notes
- Application must be 100% functional
- Backend fully integrated
- Database properly configured
- All features working correctly
- No prototypes or interfaces without backend
- Real-time updates for collaborative features
- Proper error handling and user feedback
- All repeated patterns must be componentized
- Follow KISS, SOLID, and DRY principles strictly
