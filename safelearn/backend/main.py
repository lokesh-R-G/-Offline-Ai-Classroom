"""
SafeLearn Backend - FastAPI Application
Offline AI Academic Assistant with Women Safety Module
"""

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from database import init_db, get_db, SessionLocal, User, StudyNote, Quiz, EmergencyContact, SafetyTip
from notes_analyzer import NotesAnalyzer
from quiz_generator import QuizGenerator
from doubt_solver import DoubtSolver

# Initialize app
app = FastAPI(title="SafeLearn API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize modules
notes_analyzer = NotesAnalyzer()
quiz_generator = QuizGenerator()
doubt_solver = DoubtSolver()

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: str


class StudyNoteCreate(BaseModel):
    title: str
    content: str


class DoubtRequest(BaseModel):
    doubt: str
    context: Optional[str] = None


class EmergencyContactCreate(BaseModel):
    name: str
    phone: str
    category: str
    region: Optional[str] = None


class SafetyTipCreate(BaseModel):
    title: str
    content: str
    category: str


# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "SafeLearn API",
        "version": "1.0.0",
        "status": "running"
    }


# User endpoints
@app.post("/users/")
async def create_user(user: UserCreate, db=Depends(get_db)):
    """Create a new user"""
    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/{user_id}")
async def get_user(user_id: int, db=Depends(get_db)):
    """Get user details"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Study Notes endpoints
@app.post("/notes/")
async def create_note(note: StudyNoteCreate, user_id: int, db=Depends(get_db)):
    """Create a new study note"""
    db_note = StudyNote(
        user_id=user_id,
        title=note.title,
        content=note.content
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@app.get("/notes/{note_id}")
async def get_note(note_id: int, db=Depends(get_db)):
    """Get a specific study note"""
    note = db.query(StudyNote).filter(StudyNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.get("/notes/user/{user_id}")
async def get_user_notes(user_id: int, db=Depends(get_db)):
    """Get all notes for a user"""
    notes = db.query(StudyNote).filter(StudyNote.user_id == user_id).all()
    return notes


# Notes Analysis endpoint
@app.post("/analyze/")
async def analyze_notes(note: StudyNoteCreate):
    """Analyze study notes and extract insights"""
    analysis = notes_analyzer.analyze_notes(note.content)
    return {
        "title": note.title,
        "analysis": analysis
    }


# Quiz Generation endpoint
@app.post("/quiz/generate/")
async def generate_quiz(
    note_id: int,
    num_questions: int = 5,
    difficulty: str = "medium",
    db=Depends(get_db)
):
    """Generate quiz from study notes"""
    note = db.query(StudyNote).filter(StudyNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    questions = quiz_generator.generate_quiz(
        note.content,
        num_questions=num_questions,
        difficulty=difficulty
    )
    return {
        "note_id": note_id,
        "questions": questions,
        "num_questions": len(questions)
    }


@app.get("/quiz/{quiz_id}")
async def get_quiz(quiz_id: int, db=Depends(get_db)):
    """Get a specific quiz"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


# Doubt Solver endpoint
@app.post("/doubt/solve/")
async def solve_doubt(request: DoubtRequest):
    """Solve a student's doubt"""
    solution = doubt_solver.solve_doubt(request.doubt, request.context)
    return solution


@app.get("/doubt/similar/")
async def get_similar_doubts(doubt: str):
    """Get similar doubts"""
    similar = doubt_solver.get_similar_doubts(doubt)
    return {"similar_doubts": similar}


# Women Safety Module - Emergency Contacts
@app.post("/safety/emergency-contacts/")
async def create_emergency_contact(
    contact: EmergencyContactCreate,
    db=Depends(get_db)
):
    """Add emergency contact"""
    db_contact = EmergencyContact(
        name=contact.name,
        phone=contact.phone,
        category=contact.category,
        region=contact.region
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@app.get("/safety/emergency-contacts/")
async def get_emergency_contacts(category: Optional[str] = None, db=Depends(get_db)):
    """Get emergency contacts"""
    query = db.query(EmergencyContact)
    if category:
        query = query.filter(EmergencyContact.category == category)
    contacts = query.all()
    return contacts


@app.get("/safety/emergency-contacts/{contact_id}")
async def get_emergency_contact(contact_id: int, db=Depends(get_db)):
    """Get specific emergency contact"""
    contact = db.query(EmergencyContact).filter(EmergencyContact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


# Women Safety Module - Safety Tips
@app.post("/safety/tips/")
async def create_safety_tip(tip: SafetyTipCreate, db=Depends(get_db)):
    """Add safety tip"""
    db_tip = SafetyTip(
        title=tip.title,
        content=tip.content,
        category=tip.category
    )
    db.add(db_tip)
    db.commit()
    db.refresh(db_tip)
    return db_tip


@app.get("/safety/tips/")
async def get_safety_tips(category: Optional[str] = None, db=Depends(get_db)):
    """Get safety tips"""
    query = db.query(SafetyTip)
    if category:
        query = query.filter(SafetyTip.category == category)
    tips = query.all()
    return tips


@app.get("/safety/tips/{tip_id}")
async def get_safety_tip(tip_id: int, db=Depends(get_db)):
    """Get specific safety tip"""
    tip = db.query(SafetyTip).filter(SafetyTip.id == tip_id).first()
    if not tip:
        raise HTTPException(status_code=404, detail="Tip not found")
    return tip


# Fake Call Simulation endpoint
@app.post("/safety/fake-call/")
async def simulate_fake_call():
    """Simulate a fake call for practice"""
    return {
        "status": "call_initiated",
        "call_type": "incoming",
        "caller_id": "Unknown",
        "message": "Practice your response to this call",
        "duration_limit": 60  # seconds
    }


if __name__ == "__main__":
    init_db()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
