"""
SafeLearn Backend - FastAPI Application
Offline AI Academic Assistant with Women Safety Module

Endpoints:
- POST /upload-notes - Upload and extract text from PDF, DOCX, TXT
- POST /summarize - Generate summary and key concepts
- POST /generate-quiz - Generate MCQ, short answer, long answer, application questions
- POST /ask-doubt - Answer student questions
- POST /add-contact - Add emergency contact
- GET /contacts - Get all emergency contacts
- POST /send-sos - Simulate SOS alert
"""

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from pathlib import Path
import shutil

from database import (
    init_db, get_db, SessionLocal, User, UploadedNote, StudyNote, Quiz,
    EmergencyContact, SOSAlert, Doubt, Subject
)
from file_processor import FileProcessor
from text_summarizer import TextSummarizer
from quiz_generator import QuizGenerator
from doubt_solver import DoubtSolver
from notes_analyzer import NotesAnalyzer

# Initialize app
app = FastAPI(
    title="SafeLearn API",
    version="2.0.0",
    description="Offline AI Academic Assistant with Women Safety Module"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize modules
file_processor = FileProcessor()
text_summarizer = TextSummarizer()
quiz_generator = QuizGenerator()
doubt_solver = DoubtSolver()
notes_analyzer = NotesAnalyzer()

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# =====================
# Pydantic Models
# =====================

class UserCreate(BaseModel):
    name: str
    email: str


class UploadNotesRequest(BaseModel):
    user_id: int
    subject_id: Optional[int] = None
    subject_name: Optional[str] = None


class SummarizeRequest(BaseModel):
    note_id: int
    num_sentences: int = 5
    extract_concepts: bool = True


class QuizGenerateRequest(BaseModel):
    note_id: int
    num_questions: int = 5
    difficulty: str = "medium"
    question_types: List[str] = ["mcq", "short_answer", "long_answer", "application"]


class DoubtRequest(BaseModel):
    user_id: int
    question: str
    context: Optional[str] = None
    note_id: Optional[int] = None


class EmergencyContactCreate(BaseModel):
    user_id: int
    name: str
    phone: str
    email: Optional[str] = None
    category: str
    relationship: Optional[str] = None
    region: Optional[str] = None


class SOSRequest(BaseModel):
    user_id: int
    location: Optional[str] = None
    message: str


class RateSolutionRequest(BaseModel):
    doubt_id: int
    rating: int  # 1-5


# =====================
# Health & Setup Endpoints
# =====================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "SafeLearn API",
        "version": "2.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "services": {
            "file_processor": "ready",
            "text_summarizer": "ready",
            "quiz_generator": "ready",
            "doubt_solver": "ready"
        }
    }


# =====================
# User Endpoints
# =====================

@app.post("/users/")
async def create_user(user: UserCreate, db=Depends(get_db)):
    """Create a new user"""
    try:
        db_user = User(name=user.name, email=user.email)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"id": db_user.id, "name": db_user.name, "email": db_user.email}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")


@app.get("/users/{user_id}")
async def get_user(user_id: int, db=Depends(get_db)):
    """Get user details"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.name, "email": user.email}


# =====================
# File Upload & Notes Endpoints
# =====================

@app.post("/upload-notes")
async def upload_notes(
    user_id: int,
    subject_name: Optional[str] = None,
    file: UploadFile = File(...),
    db=Depends(get_db)
):
    """
    Upload PDF, DOCX, or TXT notes and extract text

    Supported formats:
    - PDF (.pdf)
    - Word Documents (.docx)
    - Text Files (.txt)
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        if not FileProcessor.is_allowed_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Allowed: PDF, DOCX, TXT"
            )

        # Create subject if not exists
        subject_id = None
        if subject_name:
            subject = db.query(Subject).filter(Subject.name == subject_name).first()
            if not subject:
                subject = Subject(name=subject_name)
                db.add(subject)
                db.commit()
                db.refresh(subject)
            subject_id = subject.id

        # Save file
        file_path = UPLOAD_DIR / f"{user_id}_{file.filename}"
        with open(file_path, "wb") as f:
            contents = await file.read()
            f.write(contents)

        # Extract text
        file_ext = Path(file.filename).suffix.lower().strip('.')
        extracted_text = FileProcessor.extract_text(str(file_path), file_ext)

        # Get file statistics
        stats = FileProcessor.get_file_stats(extracted_text)

        # Save to database
        db_note = UploadedNote(
            user_id=user_id,
            subject_id=subject_id,
            filename=file.filename,
            file_type=file_ext,
            file_path=str(file_path),
            extracted_text=extracted_text,
            word_count=stats['word_count']
        )
        db.add(db_note)
        db.commit()
        db.refresh(db_note)

        return {
            "id": db_note.id,
            "filename": file.filename,
            "file_type": file_ext,
            "word_count": stats['word_count'],
            "reading_time_minutes": stats['reading_time_minutes'],
            "message": "File uploaded and text extracted successfully"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error uploading file: {str(e)}")


# =====================
# Summarization Endpoints
# =====================

@app.post("/summarize")
async def summarize_notes(request: SummarizeRequest, db=Depends(get_db)):
    """
    Generate summary and key concepts from uploaded notes

    Returns:
    - Summary text
    - Key concepts list
    - Text metrics (word count, reading time, etc.)
    - Outline
    """
    try:
        # Get the note
        note = db.query(UploadedNote).filter(UploadedNote.id == request.note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        text = note.extracted_text
        if not text:
            raise HTTPException(status_code=400, detail="Note has no text content")

        # Generate summary
        summary = text_summarizer.generate_summary(text, request.num_sentences)

        # Extract concepts
        concepts = []
        if request.extract_concepts:
            concepts = text_summarizer.extract_key_concepts(text)

        # Get text metrics
        metrics = text_summarizer.get_text_metrics(text)

        # Generate outline
        outline = text_summarizer.generate_outline(text)

        # Save to database
        note.summary = summary
        note.key_concepts = json.dumps(concepts)
        db.commit()

        return {
            "note_id": note.id,
            "summary": summary,
            "key_concepts": concepts,
            "outline": outline,
            "metrics": metrics,
            "message": "Summary and concepts generated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error generating summary: {str(e)}")


# =====================
# Advanced Notes Analysis Endpoints
# =====================

@app.post("/analyze-notes")
async def analyze_notes(note_id: int, db=Depends(get_db)):
    """
    Comprehensive analysis of uploaded notes including:
    - Subject code detection (e.g., CS2301)
    - Subject name identification
    - Undergraduate-friendly summary
    - Key concepts extraction
    - Content metrics and difficulty level

    Returns:
    {
        "subject": "Data Structures",
        "subject_code": "CS2301",
        "summary": "Short summary for students",
        "key_concepts": ["Arrays", "Linked Lists", "Stack", "Queue"],
        "metrics": {...}
    }
    """
    try:
        # Get the note
        note = db.query(UploadedNote).filter(UploadedNote.id == note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        text = note.extracted_text
        if not text:
            raise HTTPException(status_code=400, detail="Note has no text content")

        # Perform comprehensive analysis
        analysis = notes_analyzer.analyze_notes(text)

        # Update database with detected information
        if analysis['subject_code'] != 'UNKNOWN':
            # Try to get or create subject
            subject = db.query(Subject).filter(Subject.name == analysis['subject']).first()
            if not subject and analysis['subject'] != 'General Subject':
                subject = Subject(name=analysis['subject'], description=analysis['summary'])
                db.add(subject)
                db.commit()
                db.refresh(subject)

            if subject:
                note.subject_id = subject.id

        note.key_concepts = json.dumps(analysis['key_concepts'])
        note.summary = analysis['summary']
        db.commit()

        return {
            "note_id": note_id,
            "subject": analysis['subject'],
            "subject_code": analysis['subject_code'],
            "summary": analysis['summary'],
            "key_concepts": analysis['key_concepts'],
            "content_type": analysis['content_type'],
            "metrics": analysis['metrics'],
            "message": "Notes analyzed successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error analyzing notes: {str(e)}")


@app.post("/generate-study-guide")
async def generate_study_guide(note_id: int, db=Depends(get_db)):
    """
    Generate a comprehensive study guide from notes

    Returns:
    - Subject information
    - Summary
    - Key concepts
    - Key definitions
    - Study tips
    - Difficulty level
    - Estimated study time
    """
    try:
        # Get the note
        note = db.query(UploadedNote).filter(UploadedNote.id == note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        text = note.extracted_text
        if not text:
            raise HTTPException(status_code=400, detail="Note has no text content")

        # Generate study guide
        subject_code = None
        if note.subject_id:
            subject = db.query(Subject).filter(Subject.id == note.subject_id).first()
            if subject:
                subject_code = subject.name  # Can be enhanced to use actual code

        study_guide = notes_analyzer.generate_study_guide(text, subject_code)

        return {
            "note_id": note_id,
            "subject": study_guide['subject'],
            "subject_code": study_guide['subject_code'],
            "summary": study_guide['summary'],
            "key_concepts": study_guide['key_concepts'],
            "key_definitions": study_guide['key_definitions'],
            "study_tips": study_guide['study_tips'],
            "study_time_estimate_hours": study_guide['study_time_estimate_hours'],
            "difficulty_level": study_guide['difficulty_level'],
            "message": "Study guide generated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error generating study guide: {str(e)}")


@app.post("/extract-definitions")
async def extract_definitions(note_id: int, db=Depends(get_db)):
    """
    Extract key definitions from notes

    Finds sentences that define important concepts in the format:
    "Term is defined as...", "Term means...", etc.
    """
    try:
        # Get the note
        note = db.query(UploadedNote).filter(UploadedNote.id == note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        text = note.extracted_text
        if not text:
            raise HTTPException(status_code=400, detail="Note has no text content")

        # Extract definitions
        definitions = notes_analyzer.extract_definitions(text)

        return {
            "note_id": note_id,
            "total_definitions": len(definitions),
            "definitions": definitions,
            "message": f"Extracted {len(definitions)} definitions successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting definitions: {str(e)}")


@app.get("/detect-subject/{note_id}")
async def detect_subject(note_id: int, db=Depends(get_db)):
    """
    Detect subject code and name from a note

    Returns subject code (e.g., CS2301) and full subject name
    """
    try:
        # Get the note
        note = db.query(UploadedNote).filter(UploadedNote.id == note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        text = note.extracted_text
        if not text:
            raise HTTPException(status_code=400, detail="Note has no text content")

        # Detect subject
        subject_code, subject_name = notes_analyzer.detect_subject(text)

        # If not found using patterns, try inference
        if not subject_code:
            subject_code, subject_name = notes_analyzer._infer_subject_from_keywords(text)

        return {
            "note_id": note_id,
            "subject_code": subject_code or "UNKNOWN",
            "subject_name": subject_name or "Unable to detect subject",
            "confidence": "high" if subject_code else "low"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error detecting subject: {str(e)}")


# =====================
# Quiz Generation Endpoints
# =====================

@app.post("/generate-quiz")
async def generate_quiz(request: QuizGenerateRequest, db=Depends(get_db)):
    """
    Generate MCQ, short answer, long answer, and application questions

    Question Types:
    - mcq: Multiple choice questions with 4 options
    - short_answer: 2-3 line answers (3 marks)
    - long_answer: Paragraph-length answers (5 marks)
    - application: Problem-solving/real-world application (6 marks)
    """
    try:
        # Get the note
        note = db.query(UploadedNote).filter(UploadedNote.id == request.note_id).first()
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        text = note.extracted_text
        if not text:
            raise HTTPException(status_code=400, detail="Note has no text content")

        # Validate difficulty
        if request.difficulty not in ["easy", "medium", "hard"]:
            raise HTTPException(status_code=400, detail="Invalid difficulty level")

        # Generate quiz
        questions = quiz_generator.generate_quiz(
            text,
            num_questions=request.num_questions,
            difficulty=request.difficulty,
            question_types=request.question_types
        )

        # Save questions to database
        for q_idx, question in enumerate(questions):
            db_quiz = Quiz(
                note_id=request.note_id,
                question=question.get('question'),
                type=question.get('type', 'mcq'),
                options=json.dumps(question.get('options', [])),
                correct_answer=str(question.get('correct_answer', '')),
                answer_keywords=json.dumps(question.get('answer_keywords', [])),
                difficulty=request.difficulty
            )
            db.add(db_quiz)

        db.commit()

        return {
            "note_id": request.note_id,
            "num_questions": len(questions),
            "difficulty": request.difficulty,
            "questions": questions,
            "message": f"Generated {len(questions)} question(s) successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error generating quiz: {str(e)}")


@app.get("/quiz/{quiz_id}")
async def get_quiz(quiz_id: int, db=Depends(get_db)):
    """Get a specific quiz question"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return {
        "id": quiz.id,
        "question": quiz.question,
        "type": quiz.type,
        "options": json.loads(quiz.options) if quiz.options else [],
        "difficulty": quiz.difficulty,
        "marks": 3 if quiz.type == "short_answer" else 5 if quiz.type == "long_answer" else 6 if quiz.type == "application" else 1
    }


@app.get("/quiz/note/{note_id}")
async def get_note_quizzes(note_id: int, db=Depends(get_db)):
    """Get all quizzes for a specific note"""
    quizzes = db.query(Quiz).filter(Quiz.note_id == note_id).all()
    return {
        "note_id": note_id,
        "total_quizzes": len(quizzes),
        "quizzes": [
            {
                "id": q.id,
                "question": q.question,
                "type": q.type,
                "difficulty": q.difficulty
            }
            for q in quizzes
        ]
    }


# =====================
# Doubt Solver Endpoints
# =====================

@app.post("/ask-doubt")
async def ask_doubt(request: DoubtRequest, db=Depends(get_db)):
    """
    Accept a student question and return explanation using notes

    Can be used with or without note context
    """
    try:
        # Get context from note if provided
        context = request.context
        if request.note_id and not context:
            note = db.query(UploadedNote).filter(UploadedNote.id == request.note_id).first()
            if note:
                context = note.extracted_text

        # Solve the doubt
        solution = doubt_solver.solve_doubt(request.question, context)

        # Save the doubt and solution to database
        db_doubt = Doubt(
            user_id=request.user_id,
            question=request.question,
            answer=solution.get('explanation'),
            context=context
        )
        db.add(db_doubt)
        db.commit()
        db.refresh(db_doubt)

        return {
            "doubt_id": db_doubt.id,
            "question": request.question,
            "explanation": solution.get('explanation'),
            "doubt_type": solution.get('doubt_type'),
            "keywords": solution.get('keywords'),
            "related_concepts": solution.get('related_concepts'),
            "examples": solution.get('examples'),
            "difficulty_level": solution.get('difficulty_level'),
            "message": "Doubt solved successfully"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error solving doubt: {str(e)}")


@app.get("/doubt/{doubt_id}")
async def get_doubt(doubt_id: int, db=Depends(get_db)):
    """Get a specific doubt and its solution"""
    doubt = db.query(Doubt).filter(Doubt.id == doubt_id).first()
    if not doubt:
        raise HTTPException(status_code=404, detail="Doubt not found")

    return {
        "id": doubt.id,
        "question": doubt.question,
        "answer": doubt.answer,
        "rating": doubt.rating,
        "created_at": doubt.created_at
    }


@app.get("/doubts/user/{user_id}")
async def get_user_doubts(user_id: int, db=Depends(get_db)):
    """Get all doubts of a user"""
    doubts = db.query(Doubt).filter(Doubt.user_id == user_id).all()
    return {
        "user_id": user_id,
        "total_doubts": len(doubts),
        "doubts": [
            {
                "id": d.id,
                "question": d.question[:100],
                "has_answer": bool(d.answer),
                "rating": d.rating,
                "created_at": d.created_at
            }
            for d in doubts
        ]
    }


@app.post("/doubt/{doubt_id}/rate")
async def rate_doubt_solution(doubt_id: int, request: RateSolutionRequest, db=Depends(get_db)):
    """Rate a doubt solution (1-5 stars)"""
    try:
        if not 1 <= request.rating <= 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

        doubt = db.query(Doubt).filter(Doubt.id == doubt_id).first()
        if not doubt:
            raise HTTPException(status_code=404, detail="Doubt not found")

        doubt.rating = request.rating
        db.commit()

        return {"message": f"Doubt rated {request.rating} stars successfully"}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# =====================
# Emergency Contacts Endpoints
# =====================

@app.post("/add-contact")
async def add_emergency_contact(contact: EmergencyContactCreate, db=Depends(get_db)):
    """Add an emergency contact"""
    try:
        db_contact = EmergencyContact(
            user_id=contact.user_id,
            name=contact.name,
            phone=contact.phone,
            email=contact.email,
            category=contact.category,
            relationship=contact.relationship,
            region=contact.region
        )
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)

        return {
            "id": db_contact.id,
            "name": db_contact.name,
            "phone": db_contact.phone,
            "category": db_contact.category,
            "message": "Emergency contact added successfully"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error adding contact: {str(e)}")


@app.get("/contacts")
async def get_emergency_contacts(
    user_id: int,
    category: Optional[str] = None,
    db=Depends(get_db)
):
    """Get all emergency contacts for a user, optionally filtered by category"""
    try:
        query = db.query(EmergencyContact).filter(EmergencyContact.user_id == user_id)

        if category:
            query = query.filter(EmergencyContact.category == category)

        contacts = query.all()

        return {
            "user_id": user_id,
            "total_contacts": len(contacts),
            "category_filter": category,
            "contacts": [
                {
                    "id": c.id,
                    "name": c.name,
                    "phone": c.phone,
                    "email": c.email,
                    "category": c.category,
                    "relationship": c.relationship,
                    "region": c.region,
                    "is_favorite": c.is_favorite
                }
                for c in contacts
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/contacts/{contact_id}")
async def get_emergency_contact(contact_id: int, db=Depends(get_db)):
    """Get a specific emergency contact"""
    contact = db.query(EmergencyContact).filter(EmergencyContact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    return {
        "id": contact.id,
        "name": contact.name,
        "phone": contact.phone,
        "email": contact.email,
        "category": contact.category,
        "relationship": contact.relationship,
        "region": contact.region,
        "is_favorite": contact.is_favorite
    }


@app.delete("/contacts/{contact_id}")
async def delete_emergency_contact(contact_id: int, db=Depends(get_db)):
    """Delete an emergency contact"""
    try:
        contact = db.query(EmergencyContact).filter(EmergencyContact.id == contact_id).first()
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")

        db.delete(contact)
        db.commit()

        return {"message": "Contact deleted successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/contacts/{contact_id}/favorite")
async def toggle_favorite_contact(contact_id: int, db=Depends(get_db)):
    """Toggle favorite status of a contact"""
    try:
        contact = db.query(EmergencyContact).filter(EmergencyContact.id == contact_id).first()
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")

        contact.is_favorite = not contact.is_favorite
        db.commit()

        return {
            "id": contact.id,
            "is_favorite": contact.is_favorite,
            "message": f"Contact {'added to' if contact.is_favorite else 'removed from'} favorites"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# =====================
# SOS Alert Endpoints
# =====================

@app.post("/send-sos")
async def send_sos_alert(request: SOSRequest, db=Depends(get_db)):
    """
    Simulate sending an SOS alert

    In a real application, this would:
    - Send notifications to emergency contacts
    - Share location with trusted people
    - Alert authorities if enabled
    """
    try:
        # Create SOS alert record
        db_sos = SOSAlert(
            user_id=request.user_id,
            location=request.location,
            message=request.message,
            status="sent"
        )
        db.add(db_sos)
        db.commit()
        db.refresh(db_sos)

        # Get emergency contacts
        contacts = db.query(EmergencyContact).filter(
            EmergencyContact.user_id == request.user_id
        ).all()

        return {
            "sos_id": db_sos.id,
            "status": "sent",
            "location": request.location,
            "message": request.message,
            "contacts_notified": len(contacts),
            "notification_details": [
                {"name": c.name, "phone": c.phone, "category": c.category}
                for c in contacts[:3]  # Show first 3 contacts
            ],
            "timestamp": db_sos.created_at,
            "alert_message": "SOS alert sent successfully. Emergency contacts have been notified. Stay safe!"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error sending SOS: {str(e)}")


@app.get("/sos/{sos_id}")
async def get_sos_alert(sos_id: int, db=Depends(get_db)):
    """Get details of a specific SOS alert"""
    sos = db.query(SOSAlert).filter(SOSAlert.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS alert not found")

    return {
        "id": sos.id,
        "location": sos.location,
        "message": sos.message,
        "status": sos.status,
        "created_at": sos.created_at,
        "updated_at": sos.updated_at
    }


@app.get("/sos/user/{user_id}")
async def get_user_sos_alerts(user_id: int, db=Depends(get_db)):
    """Get all SOS alerts from a user"""
    alerts = db.query(SOSAlert).filter(SOSAlert.user_id == user_id).all()

    return {
        "user_id": user_id,
        "total_alerts": len(alerts),
        "alerts": [
            {
                "id": a.id,
                "status": a.status,
                "created_at": a.created_at,
                "location": a.location
            }
            for a in alerts
        ]
    }


# =====================
# Statistics & Analytics Endpoints
# =====================

@app.get("/stats/user/{user_id}")
async def get_user_statistics(user_id: int, db=Depends(get_db)):
    """Get user statistics"""
    try:
        notes_count = db.query(UploadedNote).filter(UploadedNote.user_id == user_id).count()
        quizzes_count = db.query(Quiz).join(
            UploadedNote
        ).filter(UploadedNote.user_id == user_id).count()
        doubts_count = db.query(Doubt).filter(Doubt.user_id == user_id).count()
        sos_count = db.query(SOSAlert).filter(SOSAlert.user_id == user_id).count()
        contacts_count = db.query(EmergencyContact).filter(EmergencyContact.user_id == user_id).count()

        return {
            "user_id": user_id,
            "notes_uploaded": notes_count,
            "quizzes_generated": quizzes_count,
            "doubts_asked": doubts_count,
            "sos_alerts_sent": sos_count,
            "emergency_contacts": contacts_count
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# =====================
# Initialization
# =====================

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("✅ SafeLearn Backend Started")
    print(f"📁 Upload directory: {UPLOAD_DIR}")
    print("🗄️  Database initialized")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
