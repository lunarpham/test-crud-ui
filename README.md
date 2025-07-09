# User/Project Management Dashboard

A web application for managing users and projects with full CRUD operations, built with React, TypeScript, and Tailwind CSS.

## Features

- **User Management**: Create, read, update, and delete users
- **Project Management**: Full CRUD operations for projects with user assignments
- **Authentication**: Login/register system with profile management
- **Authorization**: CRUD operations require authorized access

## Tech Stack

- **Frontend**: React 19, TypeScript, React Router v7
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite
- **Icons**: Lucide React

## Project Structure

```
src/
├── auth/                   # Authentication components
├── components/
│   ├── layout/            # Layout components (Sidebar, Modals)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom hooks (useUser, useProject)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── constants/         # App constants and routes
└── pages/                 # Page components
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd test-crud-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## API Integration

The application connects to a REST API with the following endpoints:

- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

## Key Components

### Authentication

- Login/Register forms
- Protected routes
- User profile management
- Session handling
