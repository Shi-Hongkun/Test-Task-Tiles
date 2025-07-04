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

### 2025-07-04
- **Decision**: Frontend Architecture Selection
  - **Choice**: React + TypeScript + Tailwind CSS
  - **Drag & Drop**: React DnD or @dnd-kit/core
  - **State Management**: React Context API or Redux Toolkit
  - **Status**: ✅ Approved by User

- **Decision**: Backend Architecture Selection
  - **Choice**: Node.js + Express + TypeScript
  - **Database**: PostgreSQL with Prisma ORM
  - **API Style**: RESTful API
  - **Status**: ✅ Approved by User

- **Decision**: Database Schema Design
  - **Tables**: boards, columns, tasks
  - **Relationships**: board -> columns -> tasks (cascading deletes)
  - **ID Strategy**: UUID for all primary keys
  - **Status**: 🟡 Proposed (awaiting implementation)

- **Decision**: Package Management Tool Selection
  - **Choice**: pnpm (similar to Python's uv)
  - **Reasons**: Faster than npm, disk efficient, modern dependency resolution
  - **Alternative considered**: npm (default), yarn (popular)
  - **Status**: ✅ Approved by User

- **Decision**: Project Structure & Environment Management
  - **Dev Container**: VS Code dev container for consistent development
  - **Docker**: Multi-service orchestration with docker-compose
  - **Environment Strategy**: Docker + Dev Container + pnpm + nvm
  - **Status**: ✅ Approved by User

- **Decision**: Repository Structure
  - **Choice**: Monorepo (single repository)
  - **Rationale**: 
    - Shared TypeScript types between frontend and backend
    - Simplified development setup and deployment
    - Better suited for small team/individual projects
    - Unified version control and tooling
  - **Structure**: frontend/ + backend/ + shared/ directories
  - **Status**: ✅ Approved by User

### 2024-12-28 (Phase 1 Completion)
- **Decision**: Project Structure & Configuration Setup
  - **Completed**: Directory structure creation, workspace configuration, dev container setup
  - **Created Files**:
    - Root: `package.json`, `pnpm-workspace.yaml`, `env.example`, `.prettierrc`, `.gitignore` (updated)
    - Docker: `docker-compose.yml`, `docker-compose.dev.yml`
    - Dev Container: `.devcontainer/devcontainer.json`, `.devcontainer/docker-compose.yml`, `.devcontainer/Dockerfile`
    - VS Code: `.vscode/settings.json`, `.vscode/extensions.json`, `.vscode/launch.json`
    - Directories: `frontend/`, `backend/`, `shared/` with basic structure
  - **Status**: ✅ Phase 1 Complete - Ready for git push

### 2024-12-28 (Phase 2 Progress)
- **Decision**: Package Configuration & TypeScript Setup
  - **Completed**: Package.json files creation, TypeScript configuration, Prisma schema
  - **Created Files**:
    - Frontend: `frontend/package.json`, `frontend/tsconfig.json` (React + Vite + @dnd-kit)
    - Backend: `backend/package.json`, `backend/tsconfig.json` (Express + Prisma + tsx)
    - Shared: `shared/package.json`, `shared/tsconfig.json` (共享类型定义)
    - Database: `backend/prisma/schema.prisma` (PostgreSQL schema with cascading deletes)
  - **Key Technology Decisions**:
    - **Frontend Build Tool**: Vite (替代 Create React App，更快的开发体验)
    - **Backend Dev Tool**: tsx (替代 ts-node，更快的 TypeScript 执行)
    - **Drag & Drop**: @dnd-kit/core (现代化的拖拽库，性能优秀)
    - **Database IDs**: cuid() (替代 UUID，更短且 URL 友好)
    - **Monorepo TypeScript**: 使用 TypeScript project references 提高编译效率
  - **Additional Files Created**:
    - Frontend: `index.html`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`
    - Frontend Components: `src/main.tsx`, `src/App.tsx`, `src/index.css`, basic page components
    - Backend: `src/index.ts` (Express server setup), `.env.example`
    - Docker: `Dockerfile`, `Dockerfile.dev`, `nginx.conf` for each service
    - Config: `.eslintrc.js`, shared types in `shared/src/types/`
    - Testing: Vitest configuration, test files in `__tests__/` directories
  - **Status**: ✅ Phase 2 Complete - All configuration files and basic structure created

### 2024-12-28 (Phase 2 Extension - Testing Setup)
- **Decision**: Testing Framework Integration
  - **Completed**: Comprehensive testing setup with Vitest
  - **Created Files**:
    - Backend: `backend/src/__tests__/index.test.ts`, `backend/vitest.config.ts`
    - Frontend: `frontend/src/__tests__/App.test.tsx`, `frontend/src/__tests__/pages/BoardsPage.test.tsx`
    - Frontend: `frontend/src/test-setup.ts`, `frontend/vitest.config.ts`
    - Shared: `shared/src/__tests__/types.test.ts`, `shared/vitest.config.ts`
    - Updated: `package.json` files with testing dependencies
  - **Key Technology Decisions**:
    - **Testing Framework**: Vitest (替代 Jest，更快且与 Vite 原生集成)
    - **Frontend Testing**: @testing-library/react + jsdom
    - **Backend Testing**: supertest for HTTP endpoint testing
    - **Test Structure**: `__tests__/` directories (similar to Python pytest structure)
    - **Coverage**: V8 coverage provider for accurate TypeScript coverage
  - **Status**: ✅ Testing Setup Complete - Ready for development with TDD approach


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