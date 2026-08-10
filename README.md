# Task Tracker

A full-stack task management application with user accounts, categories, and authenticated task management.

## Description

This project includes a React frontend and a Node.js/Express backend connected to a MySQL database using Sequelize.

Users can register, log in, create categories, and manage their own tasks with search, filtering, and pagination support.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Sequelize, JSON Web Tokens (JWT), bcryptjs
- Database: MySQL
- Deployment: Vercel(Frontend), Railway(Backend and Database)
- Source Control: Git and GitHub

## Project Structure

task-tracker/
├── frontend/                  # React application using Vite
├── server/                   # Express API server
│   └── src/
│       ├── config/
│       │   └── database.js    # Sequelize database connection
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── server.js
├── .gitignore
└── README.md

## Local Setup

### Prerequisites

- Node.js 18+ installed
- MySQL installed and running
- npm available

### Backend Setup

1. Navigate to the backend folder:
   bash
   cd server
   
2. Install dependencies:
   bash
   npm install
   
3. Create a .env file in server/ with the following values:
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   JWT_SECRET=your_jwt_secret

4. Start the server:
   bash
   npm run dev
   

The backend runs on `http://localhost:8080`.

### Frontend Setup

1. Navigate to the frontend folder:
   bash
   cd frontend
   
2. Install dependencies:
   bash
   npm install
   
3. Start the frontend app:
   bash
   npm run dev
   

The frontend is configured to run on `http://localhost:5173`.

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Categories
- GET /api/categories
- POST /api/categories

### Tasks
- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

### Health Check
- GET /api/health

### Database

- The application uses MySQL with Sequelize ORM. The database contains related entities for users, categories, and tasks. Tasks are associated with users and categories, allowing authenticated users to manage their own task data. Sequelize automatically synchronizes the database models when the backend starts.

### Features
- User registration
- User login and JWT authentication
- Protected API routes
- User-specific task management
- Category management
- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Task search
- Task filtering
- Task pagination
- Basic request validation
- Error handling
- Responsive frontend UI

## Known Limitations
- Task search is limited to title matching.
- No email verification or password reset flow is implemented.
- Sequelize automatically synchronizes database models on startup instead of using migrations.

## Notes
- The backend uses Sequelize to automatically sync database models on startup.
- Use a strong JWT_SECRET value in production.
