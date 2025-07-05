# Task Tiles Project Design Notes

## Project Overview

- **Project Name**: Task Tiles
- **Inspiration**: Trello
- **Core Feature**: Visual project board with drag-and-drop card management

## Requirements Analysis

### Core Functional Requirements

1. **Board Management**
   - Create new project boards
   - Manage board settings and configuration

2. **Column Management**
   - Add columns (e.g., "To Do", "In Progress", "Done")
   - Delete/edit columns
   - Column ordering and reordering

3. **Task Tile Management**
   - Create task tiles with title and description
   - Edit task tile content
   - Delete task tiles
   - Drag & drop functionality for status updates

4. **Data Persistence**
   - Must have valid persistence backend (PostgreSQL, etc.)
   - Data consistency guarantee

## Technical Requirements

- **Frontend**: Must have user interface
- **Backend**: API service required
- **Database**: PostgreSQL (or other relational database)
- **Containerization**: Dockerfile required for each service
- **Deployment**: Cloud platform deployment support

## CRITICAL REQUIREMENT

⚠️ **ALL DOCUMENTATION AND CODE COMMENTS MUST BE IN ENGLISH**

- This is a mandatory requirement from the project specification.
- These rules must be strictly followed throughout the project.
- All README files, code comments, documentation must be in English.
- All Key decisions should be recorded in this file.
- If key decisions section is too redundant, make it concise

## Key Decision Log

### Core Architecture (2024-12-28)

- **Tech Stack**: React + TypeScript + Tailwind CSS (frontend), Node.js + Express + Prisma (backend)
- **Database**: PostgreSQL with cuid() IDs, cascading deletes
- **Package Manager**: pnpm (faster than npm, similar to Python's uv)
- **Build Tools**: Vite (frontend), tsx (backend dev server)
- **Testing**: Vitest with @testing-library/react and supertest
- **Development**: VS Code Dev Container + Docker + pnpm workspace

### Implementation Progress

- **✅ Phase 1**: Project structure, Docker, dev container setup COMPLETED
- **✅ Phase 2**: Package configuration, TypeScript, Prisma schema, testing framework COMPLETED
- **✅ Phase 3**: Core backend API implementation COMPLETED
  - ✅ TypeScript types and DTOs
  - ✅ Database services with Prisma ORM
  - ✅ API controllers with comprehensive error handling
  - ✅ RESTful API routes (Board, Column, Task)
  - ✅ Validation and error middleware
  - ✅ Database migrations and schema deployment
  - ✅ Comprehensive test suite (20 test cases, all passing)
- **✅ Phase 4**: Frontend React implementation COMPLETED
  - ✅ TypeScript types and API services
  - ✅ React Context state management
  - ✅ UI component library (Button, Modal, Input, Card)
  - ✅ Board, Column, Task components
  - ✅ Form components for CRUD operations
  - ✅ Page components and routing
- **✅ Phase 5**: Drag & Drop functionality COMPLETED
  - ✅ @dnd-kit integration
  - ✅ Task dragging within and between columns
  - ✅ Real-time position updates
  - ✅ Visual drag feedback
- **✅ Phase 6**: Frontend-Backend integration COMPLETED
  - ✅ API service layer
  - ✅ Error handling and user feedback
  - ✅ Loading states management
  - ✅ Data synchronization
- **✅ Phase 7**: Testing and quality assurance COMPLETED
  - ✅ Backend API tests (20 tests passing)
  - ✅ TypeScript compilation
  - ✅ End-to-end functionality verification
- **✅ Phase 8**: Production build and deployment COMPLETED
  - ✅ Frontend production build
  - ✅ Docker deployment setup
  - ✅ Environment configuration

🎉 **PROJECT FULLY COMPLETED** - Task Tiles is now a complete, production-ready project management application!

## Architecture Design

### Frontend Architecture (✅ Approved)

- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: React DnD or @dnd-kit/core
- **State Management**: React Context API or Redux Toolkit
- **UI Design**: Modern card-based design with responsive layout

### Backend Architecture (✅ Approved)

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma (recommended)
- **Authentication**: JWT (if needed)
- **API Style**: RESTful API

### Database Schema (Proposed)

```sql
-- Boards table
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Columns table
CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id UUID REFERENCES columns(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Plan

### Phase 1: Project Setup (✅ Complete)

1. **Repository Structure**
   - Create frontend/ and backend/ directories
   - Setup package.json files
   - Configure TypeScript for both projects
   - Setup ESLint and Prettier

2. **Database Setup**
   - Docker Compose for PostgreSQL
   - Prisma schema definition
   - Initial migration scripts

3. **Development Environment**
   - Docker configuration
   - Environment variables setup
   - Development scripts

### Phase 2: Core Backend (🎯 Ready to Start)

1. **API Foundation**
   - Express server setup
   - Middleware configuration
   - Error handling
   - CORS setup

2. **Database Models**
   - Prisma schema implementation
   - Seed data creation
   - Migration scripts

3. **Core API Endpoints**
   - CRUD operations for boards
   - CRUD operations for columns
   - CRUD operations for tasks
   - Task position management for drag & drop

### Phase 3: Frontend Foundation (⏳ Pending)

1. **React Setup**
   - Create React App with TypeScript
   - Tailwind CSS configuration
   - Project structure setup

2. **Core Components**
   - Board component
   - Column component
   - Task tile component
   - Drag & drop implementation

3. **State Management**
   - API service layer
   - Context/Redux setup
   - Data synchronization

### Phase 4: Integration & Testing (⏳ Pending)

1. **Frontend-Backend Integration**
   - API calls implementation
   - Error handling
   - Loading states

2. **Testing**
   - Unit tests for components
   - API endpoint tests
   - Integration tests

3. **Docker & Deployment**
   - Dockerfile for each service
   - Docker Compose for local development
   - Production deployment setup

### Database Layer Options

**Option A: PostgreSQL + Prisma ORM (Recommended)**

- ✅ Type safety with TypeScript
- ✅ Automatic migration management
- ✅ Simple, readable code
- ✅ Great development experience
- ✅ Similar to SQLAlchemy (Python) - familiar ORM concept
- ❌ Additional learning curve (but minimal if familiar with ORMs)
- ❌ Extra dependency

**Option B: PostgreSQL + Direct SQL**

- ✅ Full control over SQL queries
- ✅ No additional dependencies
- ✅ Potentially better performance for complex queries
- ❌ More boilerplate code
- ❌ Manual migration management
- ❌ No automatic type safety

### Project Structure & Environment Management

#### Directory Structure (Recommended)

```
task-tiles/
├── .devcontainer/              # Dev Container configuration
│   ├── devcontainer.json       # Dev Container settings
│   └── docker-compose.yml      # Dev Container services
├── .vscode/                    # VS Code settings
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json       # Dependency lock (like requirements.txt)
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── Dockerfile
├── backend/                    # Node.js + Express backend
│   ├── src/
│   ├── prisma/                 # Database schema & migrations
│   ├── package.json
│   ├── package-lock.json       # Dependency lock
│   ├── tsconfig.json           # TypeScript configuration
│   └── Dockerfile
├── docker-compose.yml          # Multi-service orchestration
├── docker-compose.dev.yml      # Development environment
├── .gitignore
├── README.md
└── DESIGN_NOTES.md
```

#### Package Management Options

**Option A: npm (Default, like pip)**

- ✅ Built into Node.js
- ✅ Universal compatibility
- ✅ Simple and reliable
- ❌ Slower than alternatives

**Option B: pnpm (like uv - faster, modern)**

- ✅ Much faster than npm
- ✅ Disk space efficient
- ✅ Better dependency resolution
- ❌ Less common, newer tool

**Option C: yarn (Popular alternative)**

- ✅ Fast and reliable
- ✅ Good workspace support
- ✅ Wide adoption
- ❌ Extra tool to learn

### Environment Management Strategy

1. **Docker** - For service isolation (database, backend, frontend)
2. **Dev Container** - For consistent development environment
3. **Node Version Manager (nvm)** - For Node.js version management
4. **Package Manager** - For dependency management (npm/pnpm/yarn)

### Next Steps

#### 🎯 Ready to Start Implementation

1. **✅ APPROVED**: Package manager (pnpm)
2. **✅ APPROVED**: Directory structure (monorepo with dev container)
3. **✅ APPROVED**: Database layer (PostgreSQL + Prisma ORM)
4. **✅ APPROVED**: Frontend & Backend architecture

#### 🟡 Remaining Technical Decisions

1. **Decision Needed**: Choose between React Context API vs Redux Toolkit
   - **Recommendation**: React Context API (simpler for MVP)
2. **Decision Needed**: Choose between React DnD vs @dnd-kit/core
   - **Recommendation**: @dnd-kit/core (modern, better performance)

#### 🚀 Phase 1: Project Setup Progress

**✅ COMPLETED:**

1. ✅ Created directory structure (frontend/, backend/, shared/)
2. ✅ Setup pnpm workspace configuration (pnpm-workspace.yaml)
3. ✅ Configured dev container (.devcontainer/)
4. ✅ Setup Docker Compose files (docker-compose.yml, docker-compose.dev.yml)
5. ✅ Created VS Code workspace configuration (.vscode/)
6. ✅ Created root package.json with workspace scripts
7. ✅ Created environment template (env.example)

**🟡 NEXT STEPS - Phase 2: Package Configuration**

1. Create frontend/package.json
2. Create backend/package.json
3. Create shared/package.json
4. Create TypeScript config files (tsconfig.json)
5. Create Prisma schema (backend/prisma/schema.prisma)
6. Create Dockerfile files for each service
7. Create basic placeholder files

**📋 Missing Files (will be created in Phase 2):**

- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/Dockerfile`
- `frontend/Dockerfile.dev`
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/Dockerfile`
- `backend/Dockerfile.dev`
- `backend/prisma/schema.prisma`
- `shared/package.json`
- `shared/tsconfig.json`
- `.eslintrc.js`
- Basic placeholder files for each directory
