# SafeLearn - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd safelearn/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

The backend will run on `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

### Step 2: Frontend Setup (in a new terminal)

```bash
# Navigate to frontend directory
cd safelearn/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📋 What's Included

### Backend Features
✅ FastAPI with CORS support
✅ SQLite database with SQLAlchemy ORM
✅ RESTful API endpoints for:
  - User management
  - Study notes upload and analysis
  - Quiz generation
  - Doubt solving
  - Emergency contacts
  - Safety tips
  - Fake call simulation

### Frontend Features
✅ React with TypeScript
✅ React Router for navigation
✅ Responsive TailwindCSS design
✅ Interactive pages for:
  - Dashboard with stats
  - Notes upload and analysis
  - Quiz generator
  - Doubt solver
  - Safety tips gallery
  - Emergency contacts directory
  - Fake call practice simulator

## 🛠️ Available Commands

### Backend
```bash
# Run the server
python main.py

# Run with auto-reload
uvicorn main:app --reload

# Access interactive docs
# Visit http://localhost:8000/docs
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📁 Project Structure

```
safelearn/
├── backend/
│   ├── main.py              # Main app
│   ├── database.py          # DB models
│   ├── notes_analyzer.py    # Notes processing
│   ├── quiz_generator.py    # Quiz logic
│   ├── doubt_solver.py      # Doubt handling
│   └── requirements.txt     # Dependencies
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/          # Page components
    │   ├── services/       # API calls
    │   └── lib/            # Utilities
    ├── package.json        # Dependencies
    └── vite.config.ts      # Build config
```

## 🎯 Next Steps

1. **Explore the API**:
   - Visit `http://localhost:8000/docs` for interactive API documentation
   - Test endpoints using the built-in Swagger UI

2. **Try the Features**:
   - Upload study notes and see analysis
   - Generate quizzes from notes
   - Ask doubts and get explanations
   - Browse safety tips
   - Access emergency contacts
   - Practice with fake calls

3. **Customize**:
   - Update emergency contacts with local numbers
   - Add more safety tips relevant to your region
   - Integrate AI model for doubt solving
   - Add more quiz scenarios

4. **Deploy**:
   - Backend: Use Heroku, AWS, or your preferred server
   - Frontend: Deploy to Vercel, Netlify, or your CDN

## 🐛 Troubleshooting

**Backend not starting?**
- Check Python version: `python --version` (should be 3.8+)
- Ensure virtual environment is activated
- Check if port 8000 is already in use

**Frontend not loading?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check if port 5173 is available
- Clear browser cache

**Database issues?**
- Delete `safelearn.db` file in backend folder
- Database will be recreated automatically on next run

## 📚 Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Support

For issues or questions:
1. Check the main README.md for detailed information
2. Review API documentation at `/docs`
3. Check browser console for frontend errors
4. Check backend terminal for server errors

---

**Happy Learning! 🎓 Stay Safe! 🛡️**
