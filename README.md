<<<<<<< HEAD
# TaskFlow - MERN Task Management Dashboard

Production-ready MERN task management platform with authentication, projects, tasks, Kanban workflow, analytics, realtime notifications, and team collaboration.

## Monorepo Structure

```txt
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    seed/
    services/
    sockets/
    utils/
frontend/
  src/
    api/
    app/
    components/
    features/
    hooks/
    pages/
```

## Features Implemented

- JWT auth (register/login/me/profile/change-password/forgot/reset)
- Role-aware users (`admin`, `manager`, `member`)
- Projects CRUD + archive
- Tasks CRUD + filtering + sorting + CSV export
- Kanban status workflow (`todo`, `in-progress`, `completed`)
- Comments system for tasks
- Notifications API + realtime socket events
- Analytics API + dashboard cards/charts
- Dark/light theme toggle
- Responsive dashboard + auth pages
- Seed script with demo users/projects/tasks

## Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## Demo Credentials (after seeding)

- `admin@taskflow.com / Password123!`
- `manager@taskflow.com / Password123!`
- `member@taskflow.com / Password123!`

## Environment Variables

### backend/.env

- `PORT`
- `CLIENT_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### frontend/.env

- `VITE_API_URL`
- `VITE_SOCKET_URL`

## API Documentation (Key Endpoints)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `PATCH /api/auth/profile`
- `PATCH /api/auth/change-password`

### Tasks
- `GET /api/tasks?status=&priority=&search=&assignee=&project=&sortBy=`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/export/csv`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `PATCH /api/projects/:id`
- `PATCH /api/projects/:id/archive`

### Comments / Notifications / Analytics
- `GET|POST /api/tasks/:taskId/comments`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/analytics`

## Deployment Guide

### Frontend (Vercel)
1. Import `frontend` folder in Vercel.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add env: `VITE_API_URL`, `VITE_SOCKET_URL`.

### Backend (Render/Railway)
1. Deploy `backend` folder as Node service.
2. Start command: `npm start`.
3. Add all backend env vars.
4. Set `CLIENT_URL` to deployed frontend URL.

### MongoDB Atlas
1. Create cluster and database user.
2. Add network access.
3. Put Atlas connection string in `MONGO_URI`.

## Advanced Feature Notes

Implemented foundation includes:
- AI-free priority suggestion engine (keyword-driven)
- Productivity score API
- Pomodoro/settings module placeholders
- Realtime presence events over Socket.io

Extensible stubs can be layered for:
- OAuth (Google/GitHub)
- Team chat
- Voice notes + file sharing
- Time tracking
- Recurring tasks
- Multi-workspace tenancy hardening

## Production Hardening Checklist

- Add request/response schema validation for all routes
- Add refresh token rotation and secure cookies
- Integrate Cloudinary upload route for attachments
- Add background jobs for due reminders and digest insights
- Add tests (unit + integration + e2e)
- Add CI/CD pipelines and lint/format configs
=======
# MERN-task-managemnt-dashboard-project
TaskFlow is a full-stack MERN task management dashboard with authentication, project collaboration, task tracking, analytics, realtime updates, and responsive UI for teams and productivity management.
>>>>>>> e289a9dce7a7dbdba616d59d7618f2d3fca05529
