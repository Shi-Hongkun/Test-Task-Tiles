# Task Tiles API Documentation

## Overview

The Task Tiles API provides RESTful endpoints for managing boards, columns, and tasks in a Trello-like project
management system.

**Base URL**: `http://localhost:3000/api` **Content-Type**: `application/json`

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string
}
```

## Authentication

Currently, no authentication is required. Authentication will be added in future versions.

## Endpoints

### Health Check

#### GET /health

Check API and database connection status.

**Response**:

```json
{
  "status": "OK",
  "timestamp": "2024-12-04T16:02:40.123Z",
  "database": "connected"
}
```

### Boards

#### GET /api/boards

Get all boards.

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "cltj6x8vh0000iu4k8l2l3a6b",
      "name": "My Project Board",
      "description": "Board description",
      "createdAt": "2024-12-04T16:02:40.123Z",
      "updatedAt": "2024-12-04T16:02:40.123Z"
    }
  ],
  "message": "Boards retrieved successfully"
}
```

#### GET /api/boards/:id

Get a specific board by ID.

**Parameters**:

- `id` (string): Board ID

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0000iu4k8l2l3a6b",
    "name": "My Project Board",
    "description": "Board description",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:40.123Z"
  },
  "message": "Board retrieved successfully"
}
```

#### GET /api/boards/:id/with-columns

Get a board with its columns.

**Parameters**:

- `id` (string): Board ID

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0000iu4k8l2l3a6b",
    "name": "My Project Board",
    "description": "Board description",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:40.123Z",
    "columns": [
      {
        "id": "cltj6x8vh0001iu4k8l2l3a6c",
        "name": "To Do",
        "position": 0,
        "boardId": "cltj6x8vh0000iu4k8l2l3a6b",
        "createdAt": "2024-12-04T16:02:40.123Z"
      }
    ]
  },
  "message": "Board with columns retrieved successfully"
}
```

#### GET /api/boards/:id/full

Get a board with columns and all tasks.

**Parameters**:

- `id` (string): Board ID

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0000iu4k8l2l3a6b",
    "name": "My Project Board",
    "description": "Board description",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:40.123Z",
    "columns": [
      {
        "id": "cltj6x8vh0001iu4k8l2l3a6c",
        "name": "To Do",
        "position": 0,
        "boardId": "cltj6x8vh0000iu4k8l2l3a6b",
        "createdAt": "2024-12-04T16:02:40.123Z",
        "tasks": [
          {
            "id": "cltj6x8vh0002iu4k8l2l3a6d",
            "title": "Task Title",
            "description": "Task description",
            "position": 0,
            "columnId": "cltj6x8vh0001iu4k8l2l3a6c",
            "createdAt": "2024-12-04T16:02:40.123Z",
            "updatedAt": "2024-12-04T16:02:40.123Z"
          }
        ]
      }
    ]
  },
  "message": "Board with full data retrieved successfully"
}
```

#### POST /api/boards

Create a new board with default columns (To Do, In Progress, Done).

**Request Body**:

```json
{
  "name": "My New Board",
  "description": "Optional description"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0000iu4k8l2l3a6b",
    "name": "My New Board",
    "description": "Optional description",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:40.123Z"
  },
  "message": "Board created successfully"
}
```

#### PUT /api/boards/:id

Update board name and/or description.

**Parameters**:

- `id` (string): Board ID

**Request Body**:

```json
{
  "name": "Updated Board Name",
  "description": "Updated description"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0000iu4k8l2l3a6b",
    "name": "Updated Board Name",
    "description": "Updated description",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:41.456Z"
  },
  "message": "Board updated successfully"
}
```

#### DELETE /api/boards/:id

Delete a board and all its columns and tasks (cascading delete).

**Parameters**:

- `id` (string): Board ID

**Response**:

```json
{
  "success": true,
  "message": "Board deleted successfully"
}
```

### Columns

#### GET /api/boards/:boardId/columns

Get all columns for a specific board.

**Parameters**:

- `boardId` (string): Board ID

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "cltj6x8vh0001iu4k8l2l3a6c",
      "name": "To Do",
      "position": 0,
      "boardId": "cltj6x8vh0000iu4k8l2l3a6b",
      "createdAt": "2024-12-04T16:02:40.123Z",
      "tasks": []
    }
  ],
  "message": "Columns retrieved successfully"
}
```

#### GET /api/columns/:id

Get a specific column by ID with its tasks.

**Parameters**:

- `id` (string): Column ID

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0001iu4k8l2l3a6c",
    "name": "To Do",
    "position": 0,
    "boardId": "cltj6x8vh0000iu4k8l2l3a6b",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "tasks": []
  },
  "message": "Column retrieved successfully"
}
```

#### POST /api/columns

Create a new column.

**Request Body**:

```json
{
  "name": "New Column",
  "position": 3,
  "boardId": "cltj6x8vh0000iu4k8l2l3a6b"
}
```

**Note**: If `position` is not provided, it will be automatically set to the next available position.

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0003iu4k8l2l3a6e",
    "name": "New Column",
    "position": 3,
    "boardId": "cltj6x8vh0000iu4k8l2l3a6b",
    "createdAt": "2024-12-04T16:02:40.123Z"
  },
  "message": "Column created successfully"
}
```

#### PUT /api/columns/:id

Update column name.

**Parameters**:

- `id` (string): Column ID

**Request Body**:

```json
{
  "name": "Updated Column Name"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0003iu4k8l2l3a6e",
    "name": "Updated Column Name",
    "position": 3,
    "boardId": "cltj6x8vh0000iu4k8l2l3a6b",
    "createdAt": "2024-12-04T16:02:40.123Z"
  },
  "message": "Column updated successfully"
}
```

#### PUT /api/columns/:id/position

Update column position (for drag & drop reordering).

**Parameters**:

- `id` (string): Column ID

**Request Body**:

```json
{
  "position": 1
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0003iu4k8l2l3a6e",
    "name": "Column Name",
    "position": 1,
    "boardId": "cltj6x8vh0000iu4k8l2l3a6b",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "tasks": []
  },
  "message": "Column position updated successfully"
}
```

#### DELETE /api/columns/:id

Delete a column and all its tasks.

**Parameters**:

- `id` (string): Column ID

**Response**:

```json
{
  "success": true,
  "message": "Column deleted successfully"
}
```

### Tasks

#### GET /api/columns/:columnId/tasks

Get all tasks for a specific column.

**Parameters**:

- `columnId` (string): Column ID

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "cltj6x8vh0002iu4k8l2l3a6d",
      "title": "Task Title",
      "description": "Task description",
      "position": 0,
      "columnId": "cltj6x8vh0001iu4k8l2l3a6c",
      "createdAt": "2024-12-04T16:02:40.123Z",
      "updatedAt": "2024-12-04T16:02:40.123Z"
    }
  ],
  "message": "Tasks retrieved successfully"
}
```

#### GET /api/tasks/:id

Get a specific task by ID.

**Parameters**:

- `id` (string): Task ID

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0002iu4k8l2l3a6d",
    "title": "Task Title",
    "description": "Task description",
    "position": 0,
    "columnId": "cltj6x8vh0001iu4k8l2l3a6c",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:40.123Z"
  },
  "message": "Task retrieved successfully"
}
```

#### POST /api/tasks

Create a new task.

**Request Body**:

```json
{
  "title": "New Task",
  "description": "Optional task description",
  "position": 0,
  "columnId": "cltj6x8vh0001iu4k8l2l3a6c"
}
```

**Note**: If `position` is not provided, it will be automatically set to the next available position in the column.

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0004iu4k8l2l3a6f",
    "title": "New Task",
    "description": "Optional task description",
    "position": 0,
    "columnId": "cltj6x8vh0001iu4k8l2l3a6c",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:40.123Z"
  },
  "message": "Task created successfully"
}
```

#### PUT /api/tasks/:id

Update task title, description, or column.

**Parameters**:

- `id` (string): Task ID

**Request Body**:

```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "columnId": "cltj6x8vh0005iu4k8l2l3a6g"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0004iu4k8l2l3a6f",
    "title": "Updated Task Title",
    "description": "Updated description",
    "position": 0,
    "columnId": "cltj6x8vh0005iu4k8l2l3a6g",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:41.456Z"
  },
  "message": "Task updated successfully"
}
```

#### PUT /api/tasks/:id/position

Update task position and/or move between columns (for drag & drop).

**Parameters**:

- `id` (string): Task ID

**Request Body**:

```json
{
  "columnId": "cltj6x8vh0005iu4k8l2l3a6g",
  "position": 2
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "cltj6x8vh0004iu4k8l2l3a6f",
    "title": "Task Title",
    "description": "Task description",
    "position": 2,
    "columnId": "cltj6x8vh0005iu4k8l2l3a6g",
    "createdAt": "2024-12-04T16:02:40.123Z",
    "updatedAt": "2024-12-04T16:02:41.789Z"
  },
  "message": "Task position updated successfully"
}
```

#### DELETE /api/tasks/:id

Delete a task.

**Parameters**:

- `id` (string): Task ID

**Response**:

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "name",
        "message": "name is required"
      }
    ]
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Board not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal Server Error",
  "data": {
    "stack": "Error stack trace (development only)",
    "code": "INTERNAL_ERROR"
  }
}
```

## Testing

The API includes a comprehensive test suite with 20 test cases covering:

- CRUD operations for boards, columns, and tasks
- Error handling and validation
- Position management for drag & drop functionality
- Database integrity and cascading deletes

Run tests with:

```bash
cd backend
pnpm test
```

## Database Schema

The API uses PostgreSQL with Prisma ORM. The database schema includes:

- **boards**: Project boards with name and description
- **columns**: Workflow columns (To Do, In Progress, Done) with position ordering
- **tasks**: Task cards with title, description, and position ordering

All entities use CUID identifiers and include created/updated timestamps. Cascading deletes ensure data integrity when
removing boards or columns.
