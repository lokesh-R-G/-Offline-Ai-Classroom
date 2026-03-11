# SafeLearn - Offline AI Academic Assistant with Women Safety Module

SafeLearn is a full-stack web application designed to be an offline AI academic assistant with a dedicated women safety module. It helps students with their studies while also providing comprehensive safety resources and tools.

## Features

### Academic Features
- **📝 Notes Analysis**: Upload and analyze study notes with AI-powered insights
- **🔑 Key Concept Extraction**: Automatically extract important concepts from notes
- **❓ Quiz Generator**: Generate practice quizzes from your study material
- **💬 Doubt Solver**: Ask any academic question and get AI-powered explanations
- **📊 Progress Tracking**: Track your learning journey

### Women Safety Module
- **🛡️ Safety Tips**: Comprehensive safety guidelines and best practices
- **📞 Emergency Contacts**: Quick access to emergency numbers and support services
- **📱 Fake Call Simulator**: Practice responding to suspicious calls
- **🌍 Safety Communities**: Connect with others for support and advice

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Python FastAPI** - Modern web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **Uvicorn** - ASGI server

## Project Structure

```
safelearn/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database models and setup
│   ├── notes_analyzer.py    # Notes analysis module
│   ├── quiz_generator.py    # Quiz generation module
│   ├── doubt_solver.py      # Doubt solving module
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navigation.tsx      # Navigation bar
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       # Main dashboard
│   │   │   ├── NotesUpload.tsx     # Notes upload and analysis
│   │   │   ├── QuizPage.tsx        # Quiz interface
│   │   │   ├── DoubtSolver.tsx     # Doubt solving interface
│   │   │   ├── SafetyModule.tsx    # Safety tips
│   │   │   ├── EmergencyContacts.tsx  # Emergency contacts
│   │   │   └── FakeCallSimulator.tsx  # Fake call practice
│   │   ├── services/
│   │   │   └── api.ts       # API client
│   │   ├── lib/
│   │   │   └── utils.ts     # Utility functions
│   │   ├── App.tsx          # Root component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── package.json         # NPM dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tailwind.config.ts   # TailwindCSS configuration
│   └── postcss.config.js    # PostCSS configuration
│
└── .gitignore               # Git ignore rules
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd safelearn/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

API Documentation will be available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd safelearn/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### User Management
- `POST /users/` - Create a new user
- `GET /users/{user_id}` - Get user details

### Study Notes
- `POST /notes/` - Create a new study note
- `GET /notes/{note_id}` - Get a specific note
- `GET /notes/user/{user_id}` - Get all notes for a user
- `POST /analyze/` - Analyze study notes

### Quiz
- `POST /quiz/generate/` - Generate quiz from notes
- `GET /quiz/{quiz_id}` - Get a specific quiz

### Doubt Solving
- `POST /doubt/solve/` - Solve a doubt
- `GET /doubt/similar/` - Get similar doubts

### Safety Module - Emergency Contacts
- `POST /safety/emergency-contacts/` - Add emergency contact
- `GET /safety/emergency-contacts/` - Get emergency contacts
- `GET /safety/emergency-contacts/{contact_id}` - Get specific contact

### Safety Module - Safety Tips
- `POST /safety/tips/` - Add safety tip
- `GET /safety/tips/` - Get safety tips
- `GET /safety/tips/{tip_id}` - Get specific tip

### Safety Module - Fake Call
- `POST /safety/fake-call/` - Simulate a fake call

## Features in Detail

### Notes Analysis
Upload your study notes and get:
- Word count and estimated reading time
- Key concepts extracted
- Topic identification
- Complexity score
- AI-generated summary

### Quiz Generation
- Generate multiple choice questions
- Adjustable difficulty levels (Easy, Medium, Hard)
- Customizable number of questions
- Instant feedback on answers

### Doubt Solver
- Ask any academic question
- Get AI-powered explanations
- See related concepts
- Learn from examples

### Safety Tips
- Comprehensive safety guidelines
- Categorized by topic (Personal, Online, Workplace, Travel)
- Practical advice for everyday situations
- Regular updates with new tips

### Emergency Contacts
- Quick access to emergency numbers
- Categorized by type (Police, Medical, Helpline, Counseling)
- Region-specific information
- One-click calling

### Fake Call Simulator
- Practice scenarios:
  - Unknown callers
  - Tech support scams
  - Authority impersonation
  - Persistent callers
- Learn appropriate responses
- Gain confidence in handling suspicious calls

## Development

### Running Tests (Backend)
```bash
cd backend
pytest
```

### Building for Production (Frontend)
```bash
cd frontend
npm run build
```

### Linting (Frontend)
```bash
npm run lint
```

## Future Enhancements

- Offline mode implementation
- AI model integration for actual doubt solving
- Voice-based doubt solver
- Multilingual support
- Mobile app version
- Community features
- Advanced analytics and insights
- Integration with educational platforms

## Contributing

Contributions are welcome! Please follow the existing code style and create meaningful commit messages.

## License

This project is open source and available under the MIT License.

## Safety Notice

The fake call simulator and safety guidance provided in this application are for educational purposes. Always prioritize your actual safety and contact real emergency services in genuine emergencies.

## Support

For issues, questions, or suggestions, please create an issue in the repository or contact the development team.

---

**SafeLearn - Learn Safe, Code Safer** 🛡️
