# ⚡ SafeLearn Quick Start Guide

Get SafeLearn running in **5 minutes**!

---

## Prerequisites
- Node.js v16+
- Python 3.8+
- Git
- Terminal/Command Prompt

---

## Quick Start (TL;DR)

### Terminal 1 - Backend
```bash
cd safelearn/backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Terminal 2 - Frontend
```bash
cd safelearn/frontend
npm install
npm run dev
```

### Open Browser
- **Frontend:** http://localhost:5173
- **Backend API Docs:** http://localhost:8000/docs

---

## That's It! 🎉

You're now running SafeLearn locally. Start using these features:

✅ **Dashboard** - Overview of all features
✅ **Upload Notes** - Paste study notes and get AI analysis
✅ **Quiz Generator** - Create quizzes from your notes
✅ **Ask Doubt** - Get answers to academic questions
✅ **Safety Module** - Browse women safety tips
✅ **Emergency Contacts** - Manage and call emergency numbers
✅ **Fake Call Simulator** - Practice responding to suspicious calls

---

## Common Tasks

### Restart Backend After Code Changes
```bash
# Stop: Ctrl+C
# Restart: python main.py
```

### Restart Frontend After Code Changes
```bash
# Automatic with HMR (Hot Module Replacement)
# Just save the file - browser updates instantly
```

### Check if Servers Are Running
```bash
curl http://localhost:8000      # Backend
curl http://localhost:5173      # Frontend
```

### Clear Cache & Reinstall
```bash
# Frontend
cd safelearn/frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd safelearn/backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Troubleshooting

**"Port 8000/5173 already in use?"**
```bash
# Find what's using the port
lsof -i :8000  # macOS/Linux
# Kill it or use different port
```

**"Module not found errors?"**
```bash
# Frontend
npm install

# Backend
pip install -r requirements.txt
```

**"API calls failing?"**
- Ensure backend is running on http://localhost:8000
- Check http://localhost:8000/docs for available endpoints
- Open browser console (F12) for error details

---

## Full Documentation

For detailed setup, configuration, and troubleshooting:
→ See **SETUP_AND_INTEGRATION_GUIDE.md**

For frontend implementation details:
→ See **FRONTEND_IMPLEMENTATION_COMPLETE.md**

For backend API reference:
→ See **API_DOCUMENTATION.md**

---

## Next Steps

1. Try uploading study notes and see AI analysis
2. Generate a quiz from your notes
3. Ask questions using the Doubt Solver
4. Explore the Safety Module for women safety tips
5. Add emergency contacts for your region

---

**Happy learning! 📚**

Questions? Check the troubleshooting section above or see full documentation files.
