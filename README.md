# Mini CRM

Complete and responsive CRM application built with modern technologies.

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3.4
- Zustand (State Management)
- TanStack Query (Data Fetching)
- Shadcn/UI (UI Components)
- Recharts (Charts)
- Socket.IO Client (Real-time)
- React Hook Form + Zod (Forms & Validation)

### Backend
- Node.js + Express
- Supabase (Database & Auth)
- Socket.IO (Real-time)
- TypeScript

## Setup

### 1. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the `supabase-setup.sql` file
3. Get your project URL and anon key from Settings > API

### 2. Environment Variables

#### Frontend
Create `frontend/.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

#### Backend
Create `backend/.env`:
```
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
CORS_ORIGIN=http://localhost:5173
```

### 3. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 4. Run Development Servers

#### Frontend
```bash
cd frontend
npm run dev
```
Access at http://localhost:5173

#### Backend
```bash
cd backend
npm run dev
```
API running at http://localhost:3001

## Features

- User authentication
- Kanban-style pipeline
- Manual lead creation
- Lead import (.csv, .xlsx)
- Search and filters
- Data export
- Lead details view
- Interaction history
- Real-time updates

## Project Structure

```
/frontend           - React application
  /src
    /components     - React components
    /lib           - Utilities and configs
    /hooks         - Custom hooks
    /store         - Zustand stores
    /types         - TypeScript types
    /services      - API services

/backend           - Node.js API
  /src
    /routes        - Express routes
    /controllers   - Request handlers
    /services      - Business logic
    /types         - TypeScript types
    /middleware    - Express middleware

/.claude           - Claude Code configuration
  /commands        - Custom commands
  /skills          - Project skills
  CLAUDE.md        - Project memory
```

## Development

### Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run lint:fix     # Fix lint issues
npm run format       # Format code
npm test             # Run tests
```

### Code Standards

- All code in English
- No comments (self-documenting code)
- Strict TypeScript typing
- Functional and clean code
- Component-based architecture

## License

Private project for university demonstration.
