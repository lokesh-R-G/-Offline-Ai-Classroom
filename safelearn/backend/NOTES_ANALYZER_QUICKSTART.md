# Notes Analyzer - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Installation

1. **Install Required Dependencies**
   ```bash
   cd safelearn/backend
   pip install -r requirements.txt
   ```

2. **Verify Installation**
   ```bash
   python -c "from notes_analyzer import NotesAnalyzer; print('✓ NotesAnalyzer imported successfully')"
   ```

---

## 📖 Simple Usage Examples

### Example 1: Analyze Notes Directly

```python
from notes_analyzer import NotesAnalyzer

analyzer = NotesAnalyzer()

# Your study notes
notes = """
CS2301 - Data Structures

Arrays are collections of elements stored in contiguous memory locations.
Linked Lists connect elements using pointers.
Both are fundamental data structures in computer science.
"""

# Analyze the notes
result = analyzer.analyze_notes(notes)

# Print results in required format
print(f"Subject: {result['subject']}")
print(f"Code: {result['subject_code']}")
print(f"Summary: {result['summary']}")
print(f"Concepts: {', '.join(result['key_concepts'])}")
```

### Example 2: Generate Study Guide

```python
guide = analyzer.generate_study_guide(notes)

print(f"Subject: {guide['subject']}")
print(f"Time to study: {guide['study_time_estimate_hours']} hours")
print(f"Difficulty: {guide['difficulty_level']}\n")

print("Study these concepts:")
for concept in guide['key_concepts']:
    print(f"  • {concept}")

print("\nKey definitions:")
for defn in guide['key_definitions']:
    print(f"  • {defn['term']}")
```

### Example 3: Extract Definitions

```python
definitions = analyzer.extract_definitions(notes)

print("Found definitions:")
for defn in definitions:
    print(f"\n{defn['term']}:")
    print(f"  {defn['definition']}")
```

---

## 🌐 Using the API Endpoints

### Step 1: Start the Backend

```bash
cd safelearn/backend
python main.py
```

Output:
```
INFO:     Started server process
✅ SafeLearn Backend Started
📁 Upload directory: uploads
🗄️  Database initialized
```

### Step 2: Upload Notes

```bash
curl -X POST "http://localhost:8000/upload-notes?user_id=1" \
  -F "file=@study_notes.pdf" \
  -F "subject_name=Data Structures"
```

Response:
```json
{
  "id": 1,
  "filename": "study_notes.pdf",
  "file_type": "pdf",
  "word_count": 2450,
  "reading_time_minutes": 12,
  "message": "File uploaded and text extracted successfully"
}
```

### Step 3: Analyze Notes

```bash
curl -X POST "http://localhost:8000/analyze-notes?note_id=1"
```

Response:
```json
{
  "note_id": 1,
  "subject": "Data Structures",
  "subject_code": "CS2301",
  "summary": "Data structures are fundamental concepts...",
  "key_concepts": [
    "Arrays",
    "Linked Lists",
    "Stack",
    "Queue"
  ],
  "content_type": "Textbook Chapter",
  "metrics": {
    "word_count": 2450,
    "estimated_reading_time_minutes": 12,
    "difficulty_level": "Moderate",
    "estimated_grade_level": 11.3
  },
  "message": "Notes analyzed successfully"
}
```

### Step 4: Generate Study Guide

```bash
curl -X POST "http://localhost:8000/generate-study-guide?note_id=1"
```

### Step 5: Extract Definitions

```bash
curl -X POST "http://localhost:8000/extract-definitions?note_id=1"
```

### Step 6: Detect Subject

```bash
curl -X GET "http://localhost:8000/detect-subject/1"
```

---

## 📋 Supported Subject Codes

| Code | Subject | Examples |
|------|---------|----------|
| CS   | Computer Science | CS1001, CS2301, CS3001 |
| MA   | Mathematics | MA1001, MA1101, MA2001 |
| PH   | Physics | PH1001, PH1101, PH2001 |
| CH   | Chemistry | CH1001, CH1101, CH2001 |
| BIO  | Biology | BIO1001, BIO1101, BIO2001 |
| EC   | Electrical Engineering | EC1001, EC2001 |
| ME   | Mechanical Engineering | ME1001, ME2001 |
| EN   | English | EN1001, EN1101, EN2001 |

---

## 📊 Output Format

The analyzer returns results in this standardized format:

```json
{
  "subject": "Data Structures",
  "subject_code": "CS2301",
  "summary": "A concise undergraduate-friendly summary of the notes",
  "key_concepts": [
    "Arrays",
    "Linked Lists",
    "Stack",
    "Queue",
    "Binary Trees"
  ],
  "metrics": {
    "word_count": 2450,
    "estimated_reading_time_minutes": 12,
    "difficulty_level": "Moderate",
    "estimated_grade_level": 11.3
  }
}
```

---

## 🧪 Run Tests

Test the notes analyzer:

```bash
python test_notes_analyzer.py
```

Output:
```
============================================================
SafeLearn - Notes Analyzer Test Suite
============================================================

============================================================
TEST 1: Subject Code Detection
============================================================

✓ PASS: CS2301 - Data Structures
✓ PASS: MA1101 Linear Algebra
...

============================================================
TEST SUMMARY
============================================================

Total: 7/7 tests passed

✓ All tests passed!
```

---

## 📁 Test with Examples

Run the examples file:

```bash
python notes_analyzer_examples.py
```

---

## 💡 Common Tasks

### Task 1: Analyze PDF Notes

```bash
# Upload PDF
NOTE_ID=$(curl -s -X POST "http://localhost:8000/upload-notes?user_id=1" \
  -F "file=@textbook.pdf" | jq -r '.id')

# Analyze it
curl -X POST "http://localhost:8000/analyze-notes?note_id=$NOTE_ID" | jq '.'
```

### Task 2: Get Study Guide

```bash
curl -X POST "http://localhost:8000/generate-study-guide?note_id=1" | \
  jq '.key_concepts, .study_tips'
```

### Task 3: Extract Key Definitions

```bash
curl -X POST "http://localhost:8000/extract-definitions?note_id=1" | \
  jq '.definitions[] | {term: .term, definition: .definition}'
```

### Task 4: Generate Quiz from Analysis

```bash
# Get analysis
ANALYSIS=$(curl -s -X POST "http://localhost:8000/analyze-notes?note_id=1")

# Generate quiz using the concepts
curl -X POST "http://localhost:8000/generate-quiz" \
  -H "Content-Type: application/json" \
  -d '{
    "note_id": 1,
    "num_questions": 5,
    "difficulty": "medium"
  }' | jq '.questions'
```

---

## 🎯 Key Features at a Glance

| Feature | Purpose | Example |
|---------|---------|---------|
| **Subject Detection** | Auto-identify course code | "CS2301" from text |
| **Summary** | Key points in simple language | 3-5 sentence overview |
| **Concepts** | Important terms to study | Arrays, Trees, Algorithms |
| **Definitions** | Explicit definitions found | "Binary tree is..." |
| **Study Guide** | Complete prep package | Includes tips & time estimate |
| **Metrics** | Content analysis | Reading time, difficulty |

---

## 🔧 Configuration

### Adjust Summary Length

```python
# Generate longer summary
summary = analyzer.generate_undergraduate_summary(text, num_sentences=7)
```

### Get More Concepts

```python
# Extract 15 concepts instead of default 8
concepts = analyzer.extract_key_concepts(text, num_concepts=15)
```

### Add Custom Subject

Edit `notes_analyzer.py`:

```python
SUBJECT_MAPPING = {
    'ENG': {  # New subject
        '1001': 'Engineering Fundamentals',
        '2001': 'Advanced Engineering',
    }
}
```

---

## 🐛 Troubleshooting

### Problem: Subject not detected

**Solution:** Use standard format
```
❌ Wrong: "Course CS 2301 notes"
✅ Correct: "CS2301 - Data Structures"
```

### Problem: No definitions extracted

**Solution:** Use standard definition format
```
❌ Wrong: "Arrays store data. They're important."
✅ Correct: "Arrays are defined as collections of elements in memory."
```

### Problem: Empty concepts list

**Solution:** Ensure text has enough content
```
❌ Wrong: "Brief notes" (too short)
✅ Correct: Full chapter or detailed notes
```

---

## 🚄 Performance Tips

| Optimization | Effect | Details |
|--------------|--------|---------|
| Cache results | 10x faster | Reuse analysis for same notes |
| Batch processing | Parallel processing | Analyze multiple files |
| Limit size | Faster processing | Keep notes under 50,000 words |
| Use text files | Fastest | TXT > DOCX > PDF |

---

## 📚 Next Steps

1. **Upload your first note** → See subject detection work
2. **Generate a study guide** → Get organized study materials
3. **Create quizzes** → Test your knowledge
4. **Ask doubts** → Get explanations
5. **Share with friends** → Collaborate on learning

---

## 💬 API Reference

### All Endpoints

```
POST   /upload-notes              - Upload and extract text
POST   /analyze-notes             - Comprehensive analysis
POST   /generate-study-guide      - Complete study guide
POST   /extract-definitions       - Pull out definitions
GET    /detect-subject/{note_id}  - Just subject detection
POST   /summarize                 - Simple summary
POST   /generate-quiz             - Create questions
POST   /ask-doubt                 - Get explanations
```

---

## 📖 Complete Documentation

For detailed documentation, see:
- `NOTES_ANALYZER_GUIDE.md` - Full technical guide
- `API_DOCUMENTATION.md` - All endpoints explained
- `notes_analyzer_examples.py` - Code examples
- `test_notes_analyzer.py` - Test cases

---

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Backend running (`python main.py`)
- [ ] Can upload files
- [ ] Can analyze notes
- [ ] Can generate study guides
- [ ] Can extract definitions
- [ ] Tests passing

---

## 🎓 Learning Path

1. Start with: Simple text file notes
2. Progress to: PDF documents
3. Try: Complex textbooks
4. Combine with: Quiz generation
5. Integrate: Doubt solver

---

**Ready to analyze your notes? Start now:**

```bash
python main.py  # Start backend
# Then visit: http://localhost:8000/docs
```

Enjoy learning with SafeLearn! 📚✨
