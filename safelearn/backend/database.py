import sqlite3
from pathlib import Path
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database setup
DATABASE_URL = "sqlite:///./safelearn.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class UploadedNote(Base):
    __tablename__ = "uploaded_notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    subject_id = Column(Integer, index=True)
    filename = Column(String)
    file_type = Column(String)  # pdf, docx, txt
    file_path = Column(String)
    extracted_text = Column(Text)
    summary = Column(Text, nullable=True)
    key_concepts = Column(Text, nullable=True)  # JSON string of list
    word_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class StudyNote(Base):
    __tablename__ = "study_notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    summary = Column(Text, nullable=True)
    key_concepts = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    note_id = Column(Integer, index=True)
    question = Column(Text)
    type = Column(String)  # mcq, short_answer, long_answer, application
    options = Column(Text, nullable=True)  # JSON string for MCQ options
    correct_answer = Column(String, nullable=True)
    answer_keywords = Column(Text, nullable=True)  # JSON string for short/long answer
    difficulty = Column(String, default="medium")
    created_at = Column(DateTime, default=datetime.utcnow)


class Doubt(Base):
    __tablename__ = "doubts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    question = Column(Text)
    answer = Column(Text, nullable=True)
    context = Column(Text, nullable=True)  # Related note content
    rating = Column(Integer, nullable=True)  # 1-5 star rating
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    name = Column(String)
    phone = Column(String)
    email = Column(String, nullable=True)
    category = Column(String)  # police, medical, helpline, counseling, personal
    relationship = Column(String, nullable=True)
    region = Column(String, nullable=True)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    location = Column(String, nullable=True)
    message = Column(Text)
    status = Column(String, default="sent")  # sent, acknowledged, resolved
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SafetyTip(Base):
    __tablename__ = "safety_tips"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    category = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


# Initialize database
def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

