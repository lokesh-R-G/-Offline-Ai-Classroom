# 🚀 SafeLearn Full-Stack Setup & Integration Guide

**Date:** 2026-03-11
**Status:** ✅ Complete Setup & Integration Instructions
**Application:** SafeLearn - Women Safety & Educational Platform

---

## 📖 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Full-Stack Application](#running-the-full-stack-application)
6. [API Integration Testing](#api-integration-testing)
7. [Environment Configuration](#environment-configuration)
8. [Troubleshooting](#troubleshooting)
9. [Development Workflow](#development-workflow)
10. [Deployment Guide](#deployment-guide)

---

## Prerequisites

### System Requirements
- **Node.js:** v16.0.0 or higher
- **npm:** v7.0.0 or higher
- **Python:** v3.8 or higher
- **pip:** Latest version
- **Git:** Latest version

### Optional Tools
- **Docker & Docker Compose:** For containerized deployment
- **VS Code:** Recommended IDE with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Python
  - REST Client
  - ESLint
  - Prettier

### Verify Installation
```bash
node --version    # Should be v16+
npm --version     # Should be v7+
python --version  # Should be 3.8+
git --version     # Latest
```

---

## Project Structure

```
SafeLearn/
├── safelearn/
│   ├── backend/                    # FastAPI backend server
│   │   ├── main.py                # Application entry point
│   │   ├── requirements.txt        # Python dependencies
│   │   ├── models/                # Database models
│   │   ├── routes/                # API endpoints
│   │   ├── schemas/               # Pydantic schemas
│   │   └── database.sqlite        # SQLite database
│   │
│   └── frontend/                   # React frontend (Vite + TypeScript)
│       ├── src/
│       │   ├── components/        # React components & UI
│       │   ├── pages/             # Page components
│       │   ├── services/          # API services (api.ts)
│       │   ├── App.tsx            # Main app component
│       │   └── main.tsx           # Entry point
│       ├── package.json           # npm dependencies
│       ├── vite.config.ts         # Vite configuration
│       ├── tsconfig.json          # TypeScript config
│       └── tailwind.config.ts     # Tailwind CSS config
│
├── FRONTEND_IMPLEMENTATION_COMPLETE.md     # Frontend documentation
├── API_DOCUMENTATION.md                    # Backend API reference
└── SETUP_AND_INTEGRATION_GUIDE.md         # This file
```

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd safelearn/backend
```

### 2. Create Virtual Environment
```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Expected packages:**
- fastapi (web framework)
- uvicorn (ASGI server)
- sqlalchemy (ORM)
- pydantic (data validation)
- python-multipart (file uploads)
- nlp-libraries (text processing)

### 4. Initialize Database (First Time Only)
```bash
python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### 5. Populate Sample Data (Optional)
```bash
python -c "from sample_data import populate_db; populate_db()"
```

### 6. Run Backend Server
```bash
python main.py
# or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
```

### 7. Verify Backend is Running
```bash
curl http://localhost:8000/docs
# Or visit in browser: http://localhost:8000/docs
```

You should see **Swagger UI** with all available endpoints.

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd safelearn/frontend
```

### 2. Install Dependencies
```bash
npm install
```

**Expected packages:**
- react (18.2)
- vite (5.0)
- typescript (5.2)
- tailwindcss (3.3)
- shadcn/ui components
- react-router-dom (6.20)
- axios (1.6)
- lucide-react (icons)

### 3. Verify Installation
```bash
npm list | grep -E "react|vite|typescript|tailwindcss"
```

### 4. Run Development Server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.4.21  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 5. Access Frontend in Browser
Open: **http://localhost:5173**

You should see the SafeLearn dashboard with all navigation options.

---

## Running the Full-Stack Application

### Terminal Setup (Recommended: Use Multiple Tabs/Windows)

#### Terminal 1: Backend Server
```bash
cd safelearn/backend
source venv/bin/activate      # or: venv\Scripts\activate (Windows)
python main.py
```

#### Terminal 2: Frontend Server
```bash
cd safelearn/frontend
npm run dev
```

### Verify Both Servers Running
- **Backend:** http://localhost:8000 (API Server)
- **Backend Docs:** http://localhost:8000/docs (Swagger UI)
- **Frontend:** http://localhost:5173 (React App)

### Expected System Flow

```
┌─────────────────────────┐
│   React Frontend        │
│  (localhost:5173)       │
│                         │
│ - Dashboard             │
│ - Upload Notes          │
│ - Quiz Generation       │
│ - Doubt Solver          │
│ - Safety Module         │
│ - Emergency Contacts    │
│ - Fake Call Simulator   │
└────────────┬────────────┘
             │
      HTTP/JSON API
      (Axios Client)
             │
┌────────────▼────────────┐
│   FastAPI Backend       │
│  (localhost:8000)       │
│                         │
│ - /analyze/             │
│ - /quiz/generate/       │
│ - /doubt/solve/         │
│ - /safety/tips/         │
│ - /safety/emergency-    │
│   contacts/             │
│ - /notes/               │
└────────────┬────────────┘
             │
      SQLAlchemy ORM
             │
┌────────────▼────────────┐
│   SQLite Database       │
│ (database.sqlite)       │
│                         │
│ - Users                 │
│ - Notes                 │
│ - Quizzes               │
│ - Safety Tips           │
│ - Contacts              │
└─────────────────────────┘
```

---

## API Integration Testing

### 1. Test Backend Health
```bash
curl -X GET http://localhost:8000/

# Expected Response: { "message": "Welcome to SafeLearn" }
```

### 2. Test Analyze Notes Endpoint
```bash
curl -X POST http://localhost:8000/analyze/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Photosynthesis",
    "content": "Photosynthesis is the process by which plants convert light energy into chemical energy..."
  }'
```

### 3. Test Quiz Generation
```bash
curl -X POST http://localhost:8000/quiz/generate/ \
  -H "Content-Type: application/json" \
  -d '{}' \
  -G \
  -d 'note_id=1' \
  -d 'num_questions=5' \
  -d 'difficulty=medium'
```

### 4. Test Doubt Solver
```bash
curl -X POST http://localhost:8000/doubt/solve/ \
  -H "Content-Type: application/json" \
  -d '{
    "doubt": "What is photosynthesis?",
    "context": "Chapter 5 Biology"
  }'
```

### 5. Test Safety Tips
```bash
curl -X GET http://localhost:8000/safety/tips/
```

### 6. Test Emergency Contacts
```bash
curl -X GET http://localhost:8000/safety/emergency-contacts/
```

### Using REST Client (VS Code)
Create `requests.rest` file in project root:

```rest
### Health Check
GET http://localhost:8000/

### Analyze Notes
POST http://localhost:8000/analyze/
Content-Type: application/json

{
  "title": "Chapter 5: Photosynthesis",
  "content": "Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose molecules. It occurs in two main stages: light-dependent reactions and light-independent reactions (Calvin cycle)."
}

### Generate Quiz
POST http://localhost:8000/quiz/generate/?note_id=1&num_questions=5&difficulty=medium
Content-Type: application/json

### Solve Doubt
POST http://localhost:8000/doubt/solve/
Content-Type: application/json

{
  "doubt": "What is the difference between mitochondria and chloroplast?",
  "context": "Cell Biology"
}

### Get Safety Tips
GET http://localhost:8000/safety/tips/

### Get Emergency Contacts
GET http://localhost:8000/safety/emergency-contacts/
```

---

## Environment Configuration

### Frontend Environment Variables

Create `.env` file in `safelearn/frontend/`:

```bash
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true

# App Configuration
VITE_APP_NAME=SafeLearn
VITE_APP_VERSION=1.0.0
```

Access in React:
```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

### Backend Environment Variables

Create `.env` file in `safelearn/backend/`:

```bash
# Database
DATABASE_URL=sqlite:///./database.sqlite

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true

# CORS Settings
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Feature Configuration
ENABLE_NLP_ANALYSIS=true
ENABLE_QUIZ_GENERATION=true
ENABLE_SAFETY_MODULE=true
```

### Production Configuration

Update for production:

**Frontend (`safelearn/frontend/.env.production`):**
```bash
VITE_API_BASE_URL=https://api.safelearn.com
VITE_API_TIMEOUT=45000
VITE_ENABLE_ERROR_REPORTING=false
```

**Backend (`safelearn/backend/.env.production`):**
```bash
DATABASE_URL=postgresql://user:password@prod-db:5432/safelearn
API_RELOAD=false
CORS_ORIGINS=["https://safelearn.com"]
DEBUG=false
```

---

## Troubleshooting

### Backend Issues

#### Issue: Port 8000 already in use
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Use different port
uvicorn main:app --port 8001
```

#### Issue: Module import errors
```bash
# Verify virtual environment is activated
which python  # Should show venv path

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

#### Issue: Database errors
```bash
# Reset database
rm database.sqlite

# Recreate tables
python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Frontend Issues

#### Issue: Port 5173 already in use
```bash
# Kill process using port
lsof -i :5173  # macOS/Linux

# Use different port
npm run dev -- --port 5174
```

#### Issue: npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: TypeScript errors
```bash
# Clear build cache
rm -rf dist .vite

# Rebuild
npm run build

# Check for type errors
npx tsc --noEmit
```

#### Issue: API calls failing
- Verify backend is running: `curl http://localhost:8000`
- Check API_BASE_URL in `/src/services/api.ts`
- Check browser console (F12) for CORS errors
- Verify request format matches backend expectations

### Common CORS Error
If you see *"Access to XMLHttpRequest blocked by CORS policy"*:

**Backend Fix (main.py):**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Development Workflow

### 1. Start Both Servers
```bash
# Terminal 1
cd safelearn/backend
python main.py

# Terminal 2
cd safelearn/frontend
npm run dev
```

### 2. Make Code Changes

**Frontend:**
- Edit files in `safelearn/frontend/src/`
- Changes hot-reload automatically (HMR)
- View updates in browser immediately

**Backend:**
- Edit files in `safelearn/backend/`
- Server reloads automatically (--reload flag)
- Test via `http://localhost:8000/docs`

### 3. Test Changes

**Frontend Testing:**
```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

**Backend Testing:**
```bash
# Visit Swagger UI
http://localhost:8000/docs

# Test endpoints interactively
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: Add specific feature description"
git push origin main
```

---

## Build & Deployment

### Production Build - Frontend
```bash
cd safelearn/frontend
npm run build
```

**Output:**
```
dist/index.html                   0.49 kB │ gzip:  0.32 kB
dist/assets/index-*.css          31.92 kB │ gzip:  5.86 kB
dist/assets/index-*.js          291.41 kB │ gzip: 94.07 kB
```

### Production Build - Backend
```bash
cd safelearn/backend
# Just run with --reload=false for production
python -m uvicorn main:app --reload=false --host 0.0.0.0 --port 8000
```

### Docker Deployment (Optional)

**Docker Compose (`docker-compose.yml`):**
```yaml
version: '3.8'

services:
  backend:
    build: ./safelearn/backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./database.sqlite
    volumes:
      - ./data:/app/data

  frontend:
    build: ./safelearn/frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://backend:8000

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
      - frontend
```

**Run with Docker Compose:**
```bash
docker-compose up
```

---

## Performance Optimization

### Frontend Optimization
```bash
# Build analysis
npm run build -- --analyze

# Lazy load pages
# Already configured in App.tsx with React.lazy()

# Tree shake unused code
# Vite automatically handles in production
```

### Backend Optimization
```python
# Database query optimization
# Use SQLAlchemy relationships efficiently

# Add caching headers
from fastapi.middleware.gzip import GZIPMiddleware
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# Database indexes
# Already configured on critical fields
```

---

## Monitoring & Logging

### Frontend Logging
```typescript
// Development
console.log('Debug info:', data)

// Production (via error boundary)
// Integrate with service like Sentry
```

### Backend Logging
```python
import logging

logger = logging.getLogger(__name__)
logger.info("Request received")
logger.error("Error occurred", exc_info=True)
```

---

## Security Checklist

- ✅ Environment variables not hardcoded
- ✅ CORS properly configured
- ✅ SQL injection protected (SQLAlchemy ORM)
- ✅ XSS protected (React escaping)
- ✅ Input validation on backend (Pydantic)
- ✅ No sensitive data in localStorage
- ✅ HTTPS ready (TLS configuration)
- ✅ Rate limiting ready (implement as needed)

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Start Backend | `cd safelearn/backend && python main.py` |
| Start Frontend | `cd safelearn/frontend && npm run dev` |
| View API Docs | `http://localhost:8000/docs` |
| View Frontend | `http://localhost:5173` |
| Build Frontend | `cd safelearn/frontend && npm run build` |
| Run Tests | `cd safelearn/frontend && npm run lint` |
| Type Check | `cd safelearn/frontend && npx tsc --noEmit` |

---

## Additional Resources

- **Backend API Documentation:** See `API_DOCUMENTATION.md`
- **Frontend Implementation:** See `FRONTEND_IMPLEMENTATION_COMPLETE.md`
- **Women Safety Features:** See `WOMEN_SAFETY_GUIDE.md`

---

## Support & Issues

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Verify both servers are running
3. Check browser console (F12) for errors
4. Run `npm run build` to check for build errors
5. Review backend logs for API errors

---

**SafeLearn Full-Stack Setup Complete!** 🎉

You now have a fully functional development environment for the SafeLearn application.

**Next Steps:**
1. ✅ Start both backend and frontend servers
2. ✅ Open http://localhost:5173 in browser
3. ✅ Test features and API integration
4. ✅ Make changes and iterate
5. ✅ Build for production when ready

---

**Version:** 1.0.0
**Last Updated:** 2026-03-11
**Status:** Production Ready

