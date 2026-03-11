# SafeLearn Backend API Documentation

## Overview

SafeLearn Backend is a FastAPI application providing endpoints for an offline AI academic assistant with women safety features. All data is stored in SQLite.

**Base URL:** `http://localhost:8000`
**API Version:** 2.0.0
**Documentation:** `http://localhost:8000/docs` (Interactive Swagger UI)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Health & Setup](#health--setup)
3. [User Management](#user-management)
4. [File Upload & Notes](#file-upload--notes)
5. [Summarization](#summarization)
6. [Quiz Generation](#quiz-generation)
7. [Doubt Solver](#doubt-solver)
8. [Emergency Contacts](#emergency-contacts)
9. [SOS Alerts](#sos-alerts)
10. [Statistics](#statistics)
11. [Error Handling](#error-handling)
12. [Database Schema](#database-schema)

---

## Authentication

Currently, the API does not require authentication. In a production environment, implement JWT or OAuth2 authentication.

---

## Health & Setup

### GET /

Health check endpoint.

**Response:**
```json
{
  "message": "SafeLearn API",
  "version": "2.0.0",
  "status": "running"
}
```

### GET /health

Detailed health check with service status.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "services": {
    "file_processor": "ready",
    "text_summarizer": "ready",
    "quiz_generator": "ready",
    "doubt_solver": "ready"
  }
}
```

---

## User Management

### POST /users/

Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Status Codes:**
- `200`: User created successfully
- `400`: Invalid input or user already exists

---

### GET /users/{user_id}

Get user details.

**Parameters:**
- `user_id` (int, required): User ID

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Status Codes:**
- `200`: Success
- `404`: User not found

---

## File Upload & Notes

### POST /upload-notes

Upload PDF, DOCX, or TXT files and extract text.

**Parameters:**
- `user_id` (int, required): User ID
- `subject_name` (string, optional): Subject name
- `file` (file, required): The file to upload

**Supported File Types:**
- `.pdf` - PDF documents
- `.docx` - Word documents
- `.txt` - Text files

**Request Example (multipart/form-data):**
```
user_id: 1
subject_name: Biology
file: [binary file data]
```

**Response:**
```json
{
  "id": 1,
  "filename": "biology_notes.pdf",
  "file_type": "pdf",
  "word_count": 2450,
  "reading_time_minutes": 12,
  "message": "File uploaded and text extracted successfully"
}
```

**Status Codes:**
- `200`: File uploaded successfully
- `400`: Invalid file type or upload error
- `404`: User not found

---

## Summarization

### POST /summarize

Generate summary and key concepts from uploaded notes.

**Request Body:**
```json
{
  "note_id": 1,
  "num_sentences": 5,
  "extract_concepts": true
}
```

**Parameters:**
- `note_id` (int, required): ID of uploaded note
- `num_sentences` (int, optional): Number of sentences in summary (default: 5)
- `extract_concepts` (bool, optional): Extract key concepts (default: true)

**Response:**
```json
{
  "note_id": 1,
  "summary": "This is a brief summary of the key points from your notes...",
  "key_concepts": [
    "Photosynthesis",
    "Chlorophyll",
    "Light reactions",
    "Dark reactions",
    "ATP"
  ],
  "outline": [
    "Introduction to photosynthesis...",
    "Process of light absorption...",
    "Chlorophyll role..."
  ],
  "metrics": {
    "word_count": 2450,
    "unique_word_count": 680,
    "sentence_count": 145,
    "average_word_length": 5.2,
    "average_sentence_length": 16.9,
    "vocabulary_diversity": 27.76,
    "estimated_grade_level": 11.3,
    "reading_time_minutes": 12
  },
  "message": "Summary and concepts generated successfully"
}
```

**Status Codes:**
- `200`: Summary generated successfully
- `400`: Invalid parameters or no text content
- `404`: Note not found

---

## Quiz Generation

### POST /generate-quiz

Generate MCQ, short answer, long answer, and application questions.

**Request Body:**
```json
{
  "note_id": 1,
  "num_questions": 5,
  "difficulty": "medium",
  "question_types": ["mcq", "short_answer", "long_answer", "application"]
}
```

**Parameters:**
- `note_id` (int, required): ID of uploaded note
- `num_questions` (int, optional): Number of questions (default: 5)
- `difficulty` (string, optional): Difficulty level - "easy", "medium", "hard" (default: "medium")
- `question_types` (array, optional): Types of questions to generate

**Question Types:**

1. **MCQ (Multiple Choice Questions)**
   - 4 options
   - 1 mark each
   - Suitable for quick assessments

2. **Short Answer**
   - 2-3 lines of text
   - 3 marks each
   - Tests basic understanding

3. **Long Answer**
   - 1-2 paragraphs
   - 5 marks each
   - Tests comprehensive knowledge

4. **Application**
   - Problem-solving/real-world scenarios
   - 6 marks each
   - Tests practical application

**Response:**
```json
{
  "note_id": 1,
  "num_questions": 5,
  "difficulty": "medium",
  "questions": [
    {
      "type": "mcq",
      "question": "What is photosynthesis?",
      "options": [
        "Process of converting light to chemical energy",
        "Process of breaking down food",
        "Process of absorbing oxygen",
        "Process of releasing carbon"
      ],
      "correct_answer": 0,
      "difficulty": "medium",
      "explanation": "..."
    },
    {
      "type": "short_answer",
      "question": "Explain chlorophyll. (Answer in 2-3 lines)",
      "answer_keywords": ["pigment", "absorbs", "light"],
      "sample_answer": "Sample answer text",
      "difficulty": "medium",
      "marks": 3
    },
    {
      "type": "long_answer",
      "question": "Discuss the light-dependent and light-independent reactions of photosynthesis. (Answer in 1-2 paragraphs)",
      "answer_keywords": ["light", "reactions", "dark", "ATP", "glucose"],
      "sample_answer": "Detailed answer text",
      "difficulty": "medium",
      "marks": 5
    },
    {
      "type": "application",
      "question": "How can photosynthesis principles be applied to solving climate change? (Provide a detailed example)",
      "difficulty": "medium",
      "marks": 6,
      "hints": [
        "Think about how photosynthesis relates to climate change",
        "Consider real-world examples",
        "Explain the reasoning behind your answer"
      ]
    }
  ],
  "message": "Generated 5 question(s) successfully"
}
```

**Status Codes:**
- `200`: Quiz generated successfully
- `400`: Invalid parameters or no text content
- `404`: Note not found

---

### GET /quiz/{quiz_id}

Get a specific quiz question.

**Parameters:**
- `quiz_id` (int, required): Quiz question ID

**Response:**
```json
{
  "id": 1,
  "question": "What is photosynthesis?",
  "type": "mcq",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "difficulty": "medium",
  "marks": 1
}
```

---

### GET /quiz/note/{note_id}

Get all quizzes for a specific note.

**Parameters:**
- `note_id` (int, required): Note ID

**Response:**
```json
{
  "note_id": 1,
  "total_quizzes": 5,
  "quizzes": [
    {
      "id": 1,
      "question": "What is photosynthesis?",
      "type": "mcq",
      "difficulty": "medium"
    }
  ]
}
```

---

## Doubt Solver

### POST /ask-doubt

Accept a student question and return explanation using notes.

**Request Body:**
```json
{
  "user_id": 1,
  "question": "What is the difference between mitosis and meiosis?",
  "context": "Optional additional context",
  "note_id": 1
}
```

**Parameters:**
- `user_id` (int, required): User ID
- `question` (string, required): Student's doubt/question
- `context` (string, optional): Additional context
- `note_id` (int, optional): Note ID to use as context

**Response:**
```json
{
  "doubt_id": 1,
  "question": "What is the difference between mitosis and meiosis?",
  "explanation": "Based on the study material: [detailed explanation]",
  "doubt_type": "what",
  "keywords": ["mitosis", "meiosis", "difference"],
  "related_concepts": [
    "Cell division",
    "Chromosomes",
    "Genetic material"
  ],
  "examples": [
    "Example 1: Mitosis produces identical cells...",
    "Example 2: Meiosis produces gametes..."
  ],
  "difficulty_level": "intermediate",
  "message": "Doubt solved successfully"
}
```

**Status Codes:**
- `200`: Doubt solved successfully
- `400`: Invalid parameters
- `404`: Note not found

---

### GET /doubt/{doubt_id}

Get a specific doubt and its solution.

**Parameters:**
- `doubt_id` (int, required): Doubt ID

**Response:**
```json
{
  "id": 1,
  "question": "What is the difference between mitosis and meiosis?",
  "answer": "Explanation text...",
  "rating": null,
  "created_at": "2024-03-11T10:30:00"
}
```

---

### GET /doubts/user/{user_id}

Get all doubts of a user.

**Parameters:**
- `user_id` (int, required): User ID

**Response:**
```json
{
  "user_id": 1,
  "total_doubts": 3,
  "doubts": [
    {
      "id": 1,
      "question": "What is mitosis?",
      "has_answer": true,
      "rating": null,
      "created_at": "2024-03-11T10:30:00"
    }
  ]
}
```

---

### POST /doubt/{doubt_id}/rate

Rate a doubt solution (1-5 stars).

**Request Body:**
```json
{
  "doubt_id": 1,
  "rating": 4
}
```

**Parameters:**
- `rating` (int, required): Rating from 1-5

**Response:**
```json
{
  "message": "Doubt rated 4 stars successfully"
}
```

**Status Codes:**
- `200`: Rating submitted
- `400`: Invalid rating (must be 1-5)
- `404`: Doubt not found

---

## Emergency Contacts

### POST /add-contact

Add an emergency contact.

**Request Body:**
```json
{
  "user_id": 1,
  "name": "Police Department",
  "phone": "100",
  "email": "police@example.com",
  "category": "police",
  "relationship": "Emergency Service",
  "region": "India"
}
```

**Parameters:**
- `user_id` (int, required): User ID
- `name` (string, required): Contact name
- `phone` (string, required): Phone number
- `email` (string, optional): Email address
- `category` (string, required): Category - "police", "medical", "helpline", "counseling", "personal"
- `relationship` (string, optional): Relationship to user
- `region` (string, optional): Region/Location

**Response:**
```json
{
  "id": 1,
  "name": "Police Department",
  "phone": "100",
  "category": "police",
  "message": "Emergency contact added successfully"
}
```

**Status Codes:**
- `200`: Contact added
- `400`: Invalid input

---

### GET /contacts

Get all emergency contacts for a user.

**Query Parameters:**
- `user_id` (int, required): User ID
- `category` (string, optional): Filter by category

**Response:**
```json
{
  "user_id": 1,
  "total_contacts": 5,
  "category_filter": null,
  "contacts": [
    {
      "id": 1,
      "name": "Police Department",
      "phone": "100",
      "email": null,
      "category": "police",
      "relationship": "Emergency Service",
      "region": "India",
      "is_favorite": false
    }
  ]
}
```

---

### GET /contacts/{contact_id}

Get a specific emergency contact.

**Parameters:**
- `contact_id` (int, required): Contact ID

**Response:**
```json
{
  "id": 1,
  "name": "Police Department",
  "phone": "100",
  "email": null,
  "category": "police",
  "relationship": "Emergency Service",
  "region": "India",
  "is_favorite": false
}
```

---

### DELETE /contacts/{contact_id}

Delete an emergency contact.

**Parameters:**
- `contact_id` (int, required): Contact ID

**Response:**
```json
{
  "message": "Contact deleted successfully"
}
```

---

### PUT /contacts/{contact_id}/favorite

Toggle favorite status of a contact.

**Parameters:**
- `contact_id` (int, required): Contact ID

**Response:**
```json
{
  "id": 1,
  "is_favorite": true,
  "message": "Contact added to favorites"
}
```

---

## SOS Alerts

### POST /send-sos

Simulate sending an SOS alert to emergency contacts.

**Request Body:**
```json
{
  "user_id": 1,
  "location": "Main Street, Downtown",
  "message": "Need immediate help"
}
```

**Parameters:**
- `user_id` (int, required): User ID
- `location` (string, optional): Current location
- `message` (string, required): SOS message

**Response:**
```json
{
  "sos_id": 1,
  "status": "sent",
  "location": "Main Street, Downtown",
  "message": "Need immediate help",
  "contacts_notified": 5,
  "notification_details": [
    {
      "name": "Mom",
      "phone": "9876543210",
      "category": "personal"
    },
    {
      "name": "Police Department",
      "phone": "100",
      "category": "police"
    },
    {
      "name": "Medical Emergency",
      "phone": "102",
      "category": "medical"
    }
  ],
  "timestamp": "2024-03-11T10:30:00",
  "alert_message": "SOS alert sent successfully. Emergency contacts have been notified. Stay safe!"
}
```

**Status Codes:**
- `200`: SOS sent
- `400`: Error sending SOS

---

### GET /sos/{sos_id}

Get details of a specific SOS alert.

**Parameters:**
- `sos_id` (int, required): SOS alert ID

**Response:**
```json
{
  "id": 1,
  "location": "Main Street, Downtown",
  "message": "Need immediate help",
  "status": "sent",
  "created_at": "2024-03-11T10:30:00",
  "updated_at": "2024-03-11T10:30:00"
}
```

---

### GET /sos/user/{user_id}

Get all SOS alerts from a user.

**Parameters:**
- `user_id` (int, required): User ID

**Response:**
```json
{
  "user_id": 1,
  "total_alerts": 2,
  "alerts": [
    {
      "id": 1,
      "status": "sent",
      "created_at": "2024-03-11T10:30:00",
      "location": "Main Street"
    }
  ]
}
```

---

## Statistics

### GET /stats/user/{user_id}

Get user statistics.

**Parameters:**
- `user_id` (int, required): User ID

**Response:**
```json
{
  "user_id": 1,
  "notes_uploaded": 3,
  "quizzes_generated": 15,
  "doubts_asked": 8,
  "sos_alerts_sent": 0,
  "emergency_contacts": 5
}
```

---

## Error Handling

All errors follow this format:

**Error Response:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `422`: Unprocessable Entity (validation error)
- `500`: Internal Server Error

---

## Database Schema

### Tables

#### users
- `id` (Integer, PK)
- `name` (String)
- `email` (String, unique)
- `created_at` (DateTime)

#### subjects
- `id` (Integer, PK)
- `name` (String, unique)
- `description` (Text)
- `created_at` (DateTime)

#### uploaded_notes
- `id` (Integer, PK)
- `user_id` (Integer, FK)
- `subject_id` (Integer, FK)
- `filename` (String)
- `file_type` (String) - pdf, docx, txt
- `file_path` (String)
- `extracted_text` (Text)
- `summary` (Text)
- `key_concepts` (Text) - JSON
- `word_count` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### quizzes
- `id` (Integer, PK)
- `note_id` (Integer, FK)
- `question` (Text)
- `type` (String) - mcq, short_answer, long_answer, application
- `options` (Text) - JSON
- `correct_answer` (String)
- `answer_keywords` (Text) - JSON
- `difficulty` (String)
- `created_at` (DateTime)

#### doubts
- `id` (Integer, PK)
- `user_id` (Integer, FK)
- `question` (Text)
- `answer` (Text)
- `context` (Text)
- `rating` (Integer) - 1-5
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### emergency_contacts
- `id` (Integer, PK)
- `user_id` (Integer, FK)
- `name` (String)
- `phone` (String)
- `email` (String)
- `category` (String)
- `relationship` (String)
- `region` (String)
- `is_favorite` (Boolean)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### sos_alerts
- `id` (Integer, PK)
- `user_id` (Integer, FK)
- `location` (String)
- `message` (Text)
- `status` (String) - sent, acknowledged, resolved
- `created_at` (DateTime)
- `updated_at` (DateTime)

---

## Rate Limiting

Currently not implemented. Consider adding in production:
- 100 requests per minute per user
- 1000 requests per hour per IP

## CORS

All origins are currently allowed. Update in production:
```python
allow_origins=["https://yourdomain.com"]
```

## Security Notes

1. **Enable HTTPS** in production
2. **Add Authentication** - Implement JWT or OAuth2
3. **Validate Uploads** - Limit file sizes (max 50MB recommended)
4. **Sanitize Input** - Validate all user inputs
5. **Hide Sensitive Data** - Use environment variables for secrets
6. **Rate Limiting** - Prevent abuse
7. **CORS** - Restrict to specific origins

---

## Support

For issues or questions:
1. Check API documentation at `/docs`
2. Review error messages carefully
3. Ensure backend is running: `python main.py`
4. Check database connection
5. Review console logs for detailed error messages
