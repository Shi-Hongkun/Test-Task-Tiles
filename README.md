# Task Tiles - Modern Project Management Platform

A powerful, intuitive project management platform that adapts to any industry - from HR operations to wedding planning.
Built with modern web technologies and designed for seamless collaboration.

![Task Tiles](https://img.shields.io/badge/Status-Demo%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-orange)

## ✨ Features

### 🚀 Core Functionality

- **Visual Board Management**: Kanban-style boards with drag & drop functionality
- **Multi-Industry Support**: Adaptable workflows for any business domain
- **User Authentication**: Secure login system with role-based access control
- **Real-time Updates**: Live collaboration with instant UI updates
- **Responsive Design**: Beautiful interface that works on all devices

### 🎨 Modern UI/UX

- **Gradient Design System**: Modern visual aesthetics with smooth animations
- **Interactive Components**: Hover effects, transitions, and micro-interactions
- **Intuitive Navigation**: User-friendly interface with clear visual hierarchy
- **Accessible Design**: WCAG compliant with keyboard navigation support

### 🔐 Security & Access Control

- **Role-based Permissions**: Different access levels for different users
- **Secure Authentication**: Protected routes with session management
- **Data Privacy**: User data isolation and privacy protection

## 🏗️ Architecture

### Technology Stack

**Frontend:**

- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

**Backend:**

- Node.js with Express
- TypeScript for type safety
- Prisma ORM for database management
- PostgreSQL for data storage

**Development:**

- Docker for containerization
- Dev Containers for consistent development environment
- pnpm for package management

### Project Structure

```
task-tiles/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript definitions
│   └── public/              # Static assets
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   └── prisma/              # Database schema and migrations
└── .devcontainer/           # Development container configuration
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- VS Code with Dev Containers extension (recommended)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-tiles
   ```

2. **Open in Dev Container**
   - Open the project in VS Code
   - Click "Reopen in Container" when prompted
   - Wait for the container to build and start

3. **Start the development servers**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   pnpm dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd frontend
   pnpm dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:3001
   - Database will be automatically set up with sample data

### Default Ports

- **Frontend**: 5174
- **Backend API**: 3001
- **PostgreSQL**: 5432 (internal)

## 👥 Demo Accounts

The application comes with pre-configured demo accounts to showcase different user roles and permissions:

| User             | Email                | Role               | Access                           |
| ---------------- | -------------------- | ------------------ | -------------------------------- |
| 👰‍♀️ Emma Thompson | emma@techstart.com   | HR Manager & Bride | HR Department + Wedding Planning |
| 🤵‍♂️ David Chen    | david@example.com    | Groom              | Wedding Planning only            |
| 👩‍💼 Yilian Cheng  | yilian@techstart.com | HR Colleague       | HR Department only               |

**Password for all accounts:** `1234`

## 🎯 Use Cases

### HR Department Management

- Employee onboarding workflows
- Performance review tracking
- Training program coordination
- Policy documentation management

### Event Planning

- Wedding planning coordination
- Vendor management
- Timeline tracking
- Budget monitoring

### General Project Management

- Software development sprints
- Marketing campaign planning
- Product launch coordination
- Team collaboration workflows

## 🛠️ Development

### Database Management

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Reset database with sample data
pnpm db:reset

# Seed database
pnpm db:seed
```

### API Endpoints

| Method | Endpoint               | Description                      |
| ------ | ---------------------- | -------------------------------- |
| GET    | `/api/users`           | Get all users                    |
| GET    | `/api/boards`          | Get user's accessible boards     |
| GET    | `/api/boards/:id/full` | Get board with columns and tasks |
| POST   | `/api/boards`          | Create new board                 |
| PUT    | `/api/boards/:id`      | Update board                     |
| DELETE | `/api/boards/:id`      | Delete board                     |

Full API documentation is available at `/backend/API_DOCUMENTATION.md`

### Testing

```bash
# Run backend tests
cd backend
pnpm test

# Run frontend tests
cd frontend
pnpm test
```

## 🎨 Customization

### Theming

The application uses Tailwind CSS with a custom design system. Colors, spacing, and typography can be customized in:

- `frontend/tailwind.config.js`
- `frontend/src/index.css`

### Adding New User Roles

1. Update the database schema in `backend/prisma/schema.prisma`
2. Modify the permission logic in `backend/src/services/boardService.ts`
3. Update the frontend type definitions in `frontend/src/types/index.ts`

## 📈 Performance

- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security

- Password-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention with Prisma
- XSS protection with proper escaping

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern project management tools like Trello and Notion
- Built with love using open-source technologies
- Designed for real-world business applications

---

**Task Tiles** - Transforming how teams collaborate across industries.
