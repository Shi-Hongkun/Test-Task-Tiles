# 🎯 Task Tiles

> A modern, intuitive project management board inspired by Trello

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Required-orange.svg)](https://www.postgresql.org/)

## 📋 Project Overview

Task Tiles is a visual project management application that enables users to organize their work using an intuitive board-based interface. Users can create boards, add customizable columns, and manage task tiles through drag-and-drop functionality.

### 🎨 Core Features

- **🏗️ Board Management**: Create and manage multiple project boards
- **📊 Column Management**: Add, edit, and organize workflow columns (To Do, In Progress, Done)
- **🎴 Task Tiles**: Create, edit, and delete task cards with title and description
- **🖱️ Drag & Drop**: Seamlessly move tasks between columns to update their status
- **💾 Data Persistence**: Robust backend with PostgreSQL database integration

## 🚀 Quick Start

### Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - `npm install -g pnpm`
- **Docker** and **Docker Compose**
- **VS Code** (recommended for Dev Container)
- **Git**

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-tiles.git
   cd task-tiles
   ```

2. **Install dependencies**
   ```bash
   # Install pnpm globally (if not already installed)
   npm install -g pnpm

   # Install all dependencies (monorepo)
   pnpm install

   # Or install for specific services
   pnpm --filter frontend install
   pnpm --filter backend install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   # Edit .env with your database credentials
   ```

### 🏃‍♂️ Running the Application

#### Option 1: Dev Container (Recommended)
```bash
# Open in VS Code
code .

# VS Code will prompt to "Reopen in Container"
# This provides a fully configured development environment
```

#### Option 2: Local Development
```bash
# Start the database
docker-compose up -d postgres

# Start the backend
pnpm --filter backend dev

# Start the frontend (in another terminal)
pnpm --filter frontend dev
```

#### Option 3: Full Docker Development
```bash
# Start all services including database
docker-compose -f docker-compose.dev.yml up --build
```

#### Production Mode with Docker
```bash
# Build and run all services
docker-compose up --build

# Access the application at http://localhost:3000
```

## 🛠️ Development Environment Options

### 1. **Dev Container (Recommended)**
```bash
# Prerequisites: VS Code + Docker + Dev Containers extension
# Simply open the project in VS Code and select "Reopen in Container"
# Everything is automatically configured!
```

### 2. **Local Development**
```bash
# Prerequisites: Node.js + pnpm + Docker
# More control, but requires local setup
```

### 3. **Full Docker**
```bash
# Prerequisites: Docker + Docker Compose only
# Fully isolated but slower for development
```

## 🐳 Docker Deployment

### Building Docker Images

```bash
# Build frontend image
docker build -t task-tiles-frontend ./frontend

# Build backend image
docker build -t task-tiles-backend ./backend
```

### Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 🌐 Cloud Deployment

This application is designed for easy deployment to cloud platforms:

- **AWS**: Use ECS with RDS for PostgreSQL
- **Google Cloud**: Deploy with Cloud Run and Cloud SQL
- **Azure**: Use Container Instances with Azure Database for PostgreSQL
- **Heroku**: Deploy with Heroku Postgres add-on

Detailed deployment guides are available in the `/docs` directory.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │◄──►│     Backend     │◄──►│   PostgreSQL    │
│   (React TS)    │    │  (Node.js TS)   │    │    Database     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
task-tiles/
├── .devcontainer/              # Dev Container configuration
│   ├── devcontainer.json       # Dev Container settings
│   └── docker-compose.yml      # Dev Container services
├── .vscode/                    # VS Code settings
│   ├── settings.json           # Workspace settings
│   ├── extensions.json         # Recommended extensions
│   └── launch.json             # Debug configuration
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── Dockerfile             # Frontend Docker image
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   ├── prisma/                # Database schema & migrations
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── package.json           # Backend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   └── Dockerfile             # Backend Docker image
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development orchestration
├── pnpm-workspace.yaml         # pnpm monorepo configuration
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
└── DESIGN_NOTES.md             # Design decisions & notes
```

### Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React DnD/@dnd-kit
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Package Manager**: pnpm (fast, efficient, like Python's uv)
- **Development**: VS Code Dev Container, Docker, Docker Compose
- **Authentication**: JWT (planned)

## 📚 API Documentation

### Main Endpoints

- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id/columns` - Get board columns
- `POST /api/columns` - Create new column
- `GET /api/columns/:id/tasks` - Get column tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

Full API documentation is available at `/docs/api.md`.

## 🧪 Testing

```bash
# Run frontend tests
pnpm --filter frontend test

# Run backend tests
pnpm --filter backend test

# Run all tests
pnpm test

# Run integration tests
pnpm test:integration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📝 Code Standards

- **Language**: All documentation and code comments must be in English
- **Package Manager**: Use pnpm consistently across the project
- **Formatting**: Use Prettier for code formatting
- **Linting**: ESLint configuration provided
- **Testing**: Write tests for new features
- **TypeScript**: Strict mode enabled for both frontend and backend

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Project Status

- ✅ Project Setup and Architecture Planning
- ✅ Technology Stack Selection
- ✅ Directory Structure Design
- ✅ Development Environment Configuration
- 🟡 Ready for Implementation Phase
- ⏳ Core Features Implementation
- ⏳ Testing and Documentation
- ⏳ Cloud Deployment Setup

---

**Note**: This application requires a valid persistence backend. A PostgreSQL database connection is mandatory for full functionality.