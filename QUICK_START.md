# Quick Start Guide

## ✅ Your Setup is Already Unified!

You can run the entire application with just **one command**.

## Start Everything

From the **root directory**, run:

```bash
npm run dev
```

This single command starts:
- ✅ Frontend (Next.js) on http://localhost:3000
- ✅ Backend (NestJS) on http://localhost:4000
- ✅ Both run concurrently

## Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 4000 | http://localhost:4000/api/v1 |

## How It Works

The `npm run dev` command uses `concurrently` to run both:
```json
{
  "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\""
}
```

## Frontend → Backend Communication

The frontend is already configured to call the backend API:
- Frontend calls: `http://localhost:4000/api/v1/*`
- Configured in: `frontend/.env.local`
- API client: `frontend/src/lib/api.ts`

## Access Your Site

### Public Pages
- **Home**: http://localhost:3000
- **Gallery**: http://localhost:3000/gallery
- **About**: http://localhost:3000/about
- **Services**: http://localhost:3000/services
- **Contact**: http://localhost:3000/contact

### Admin Panel
- **Login**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin
- **Media**: http://localhost:3000/admin/media
- **Appointments**: http://localhost:3000/admin/appointments

### API Documentation
- **Swagger**: http://localhost:4000/api

## Stop Everything

Press `Ctrl+C` in the terminal where `npm run dev` is running.

This stops both frontend and backend.

## Other Commands

### Install Dependencies
```bash
npm run install:all
```
Installs dependencies for both frontend and backend.

### Build for Production
```bash
npm run build
```
Builds both frontend and backend.

### Start Production
```bash
npm run start
```
Starts both in production mode.

### Docker
```bash
npm run docker:up    # Start with Docker
npm run docker:down  # Stop Docker
```

## Troubleshooting

### Port Already in Use

**Frontend (3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Backend (4000):**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### Frontend Can't Connect to Backend

1. Check backend is running: http://localhost:4000/api
2. Check `frontend/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:4000`
3. Restart both services

### Database Connection Error

1. Check PostgreSQL is running
2. Check credentials in `backend/.env`
3. Run: `cd backend && npm run db:check`

## Development Workflow

### 1. Start Development
```bash
npm run dev
```

### 2. Make Changes
- Frontend code: `frontend/src/`
- Backend code: `backend/src/`
- Both auto-reload on save

### 3. Test
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

### 4. Stop
Press `Ctrl+C`

## Summary

✅ **One Command**: `npm run dev`
✅ **Two Ports**: 3000 (frontend) + 4000 (backend)
✅ **Fully Integrated**: Frontend calls backend automatically
✅ **Auto-Reload**: Both services reload on code changes

**You're all set! Just run `npm run dev` and start developing!** 🚀
