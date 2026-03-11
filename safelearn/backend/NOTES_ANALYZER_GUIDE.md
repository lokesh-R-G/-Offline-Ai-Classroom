# Notes Analyzer Module - Complete Guide

## Overview

The `NotesAnalyzer` module provides comprehensive analysis of student study notes with the following capabilities:

1. **Subject Code Detection** - Automatically identifies course codes (e.g., CS2301)
2. **Subject Name Identification** - Maps codes to actual subject names
3. **Undergraduate-Friendly Summaries** - Creates simple, easy-to-understand summaries
4. **Key Concept Extraction** - Identifies and ranks important concepts
5. **Definition Extraction** - Pulls out key definitions from text
6. **Study Guide Generation** - Creates complete study guides with tips and timelines
7. **Content Analysis** - Analyzes difficulty level, reading time, and vocabulary

---

## Core Features

### 1. Subject Code Detection

The analyzer can detect subject codes in multiple formats:

```
Supported Formats:
- CS2301        (no separator)
- CS 2301       (space separator)
- CS-2301       (dash separator)
- [CS2301]      (brackets)
- (CS2301)      (parentheses)
```

**Supported Subjects:**
- **CS** - Computer Science (CS1001, CS2301, CS3001, etc.)
- **MA** - Mathematics (MA1001, MA1101, MA2001, etc.)
- **PH** - Physics (PH1001, PH1101, PH2001, etc.)
- **CH** - Chemistry (CH1001, CH1101, CH2001, etc.)
- **BIO** - Biology (BIO1001, BIO1101, BIO2001, etc.)
- **EC** - Electrical Engineering (EC1001, EC2001, etc.)
- **ME** - Mechanical Engineering (ME1001, ME2001, etc.)
- **EN** - English (EN1001, EN1101, EN2001, etc.)

**Example:**
```
Input: "CS2301 - Data Structures"
Output: {
  "subject_code": "CS2301",
  "subject_name": "Data Structures"
}
```

### 2. Undergraduate-Friendly Summaries

Generates concise summaries using a scoring algorithm that considers:

- **Content importance**: Words that appear frequently relative to stop words
- **Position bias**: Earlier sentences often contain main ideas
- **Sentence coherence**: Maintains logical flow and order

**Features:**
- Removes jargon and complexity
- Uses simple language suitable for students
- Typically 3-5 sentences for comprehensive understanding
- Maintains original sentence structure

**Example:**
```
Input: Complex 500-word chapter on photosynthesis
Output: "Photosynthesis is a biological process where plants convert light energy
         into chemical energy. This process involves light-dependent and light-independent
         reactions that together create glucose and oxygen for the plant."
```

### 3. Key Concept Extraction

Identifies important concepts through multiple methods:

**Method 1: Capitalized Phrases**
- Extracts sequences of capitalized words
- Often indicates proper nouns or formal concepts

**Method 2: Contextual Indicators**
- Detects key concepts in contexts like:
  - "define X as..."
  - "X is important because..."
  - "X applies to..."

**Method 3: Frequency Analysis**
- Identifies words appearing multiple times
- Filters common words and very short words

**Method 4: Synonym Recognition**
- Groups related concepts
- Handles variations and related terminology

**Output:** Ranked list of 8 concepts (or fewer if not enough found)

### 4. Definition Extraction

Finds explicit definitions in the text using pattern matching:

**Patterns Detected:**
```
"X is defined as Y"
"X means Y"
"X refers to Y"
"X is a Y"
```

**Example:**
```
Input: "A binary tree is defined as a tree data structure where each node has at most two children."
Output: {
  "term": "binary tree",
  "definition": "a tree data structure where each node has at most two children"
}
```

---

## API Endpoints

### 1. POST /analyze-notes

**Comprehensive analysis of uploaded notes**

**Request:**
```bash
POST /analyze-notes?note_id=1
```

**Response:**
```json
{
  "note_id": 1,
  "subject": "Data Structures",
  "subject_code": "CS2301",
  "summary": "A concise summary of the note content...",
  "key_concepts": [
    "Arrays",
    "Linked Lists",
    "Stack",
    "Queue",
    "Binary Trees",
    "Sorting",
    "Algorithms",
    "Complexity"
  ],
  "content_type": "Textbook Chapter",
  "metrics": {
    "word_count": 2450,
    "unique_word_count": 680,
    "sentence_count": 145,
    "avg_words_per_sentence": 16.9,
    "avg_word_length": 5.2,
    "estimated_reading_time_minutes": 12,
    "estimated_grade_level": 11.3,
    "difficulty_level": "Moderate",
    "vocabulary_richness": 27.76
  },
  "message": "Notes analyzed successfully"
}
```

### 2. POST /generate-study-guide

**Generate a complete study guide**

**Request:**
```bash
POST /generate-study-guide?note_id=1
```

**Response:**
```json
{
  "note_id": 1,
  "subject": "Data Structures",
  "subject_code": "CS2301",
  "summary": "Summary text...",
  "key_concepts": [
    "Arrays",
    "Linked Lists",
    "Stack",
    "Queue"
  ],
  "key_definitions": [
    {
      "term": "Binary Tree",
      "definition": "A tree data structure where each node has at most two children"
    },
    {
      "term": "Sorting Algorithm",
      "definition": "A procedure to arrange elements in a specific order"
    }
  ],
  "study_tips": [
    "Review key concepts regularly",
    "Practice problem-solving exercises",
    "Create visual diagrams for complex topics",
    "Test yourself with quiz questions",
    "Form study groups to discuss difficult concepts"
  ],
  "study_time_estimate_hours": 2,
  "difficulty_level": "Moderate",
  "message": "Study guide generated successfully"
}
```

### 3. POST /extract-definitions

**Extract key definitions from notes**

**Request:**
```bash
POST /extract-definitions?note_id=1
```

**Response:**
```json
{
  "note_id": 1,
  "total_definitions": 5,
  "definitions": [
    {
      "term": "Algorithm",
      "definition": "A step-by-step procedure for solving a problem or performing a computation"
    },
    {
      "term": "Data Structure",
      "definition": "A specialized format for organizing and storing data that enables efficient access"
    }
  ],
  "message": "Extracted 5 definitions successfully"
}
```

### 4. GET /detect-subject/{note_id}

**Detect subject code and name**

**Request:**
```bash
GET /detect-subject/1
```

**Response:**
```json
{
  "note_id": 1,
  "subject_code": "CS2301",
  "subject_name": "Data Structures",
  "confidence": "high"
}
```

---

## Usage Examples

### Example 1: Using the Module Directly

```python
from notes_analyzer import NotesAnalyzer

analyzer = NotesAnalyzer()

# Sample notes
notes = """
CS2301 - Data Structures

A data structure is an organized format for storing and managing data efficiently.
Common data structures include:
- Arrays: Elements stored in contiguous memory
- Linked Lists: Elements connected via pointers
- Trees: Hierarchical data structures
"""

# Analyze
result = analyzer.analyze_notes(notes)

print(f"Subject: {result['subject']}")
print(f"Code: {result['subject_code']}")
print(f"Summary: {result['summary']}")
print(f"Concepts: {', '.join(result['key_concepts'])}")
```

### Example 2: Generating a Study Guide

```python
# Generate comprehensive study guide
study_guide = analyzer.generate_study_guide(notes)

print(f"Subject: {study_guide['subject']}")
print(f"Summary: {study_guide['summary']}\n")

print("Key Concepts to Study:")
for i, concept in enumerate(study_guide['key_concepts'], 1):
    print(f"  {i}. {concept}")

print("\nStudy Tips:")
for tip in study_guide['study_tips']:
    print(f"  • {tip}")

print(f"\nEstimated Study Time: {study_guide['study_time_estimate_hours']} hours")
print(f"Difficulty: {study_guide['difficulty_level']}")
```

### Example 3: Extracting Definitions

```python
definitions = analyzer.extract_definitions(notes)

print("Key Definitions:")
for defn in definitions:
    print(f"\n{defn['term']}:")
    print(f"  {defn['definition']}")
```

### Example 4: Using API Endpoints

**Step 1: Upload notes**
```bash
curl -X POST "http://localhost:8000/upload-notes?user_id=1" \
  -F "file=@notes.pdf" \
  -F "subject_name=Data Structures"
```

**Response:** `{"id": 1, "filename": "notes.pdf", ...}`

**Step 2: Analyze the uploaded notes**
```bash
curl -X POST "http://localhost:8000/analyze-notes?note_id=1"
```

**Step 3: Generate study guide**
```bash
curl -X POST "http://localhost:8000/generate-study-guide?note_id=1"
```

**Step 4: Generate quiz based on analysis**
```bash
curl -X POST "http://localhost:8000/generate-quiz" \
  -H "Content-Type: application/json" \
  -d '{
    "note_id": 1,
    "num_questions": 5,
    "difficulty": "medium",
    "question_types": ["mcq", "short_answer"]
  }'
```

---

## Content Classification

The analyzer classifies content as:

- **Research Paper / Formal Document** - Contains: abstract, methodology, conclusion, references
- **Lecture Notes** - Contains: lecture, slide, class, today
- **Problem Set / Exercises** - Contains: exercise, problem, solution, answer
- **Textbook Chapter** - Contains: chapter, section, summary, example
- **Study Notes** - Default classification

---

## Difficulty Levels

Content is classified based on estimated reading grade level:

- **Easy** - Grade level < 8 (Simple language, basic concepts)
- **Moderate** - Grade level 8-12 (Standard undergraduate material)
- **Advanced** - Grade level > 12 (Complex topics, specialized terminology)

---

## Metrics Explained

### word_count
Total number of words in the document

### unique_word_count
Number of distinct words (vocabulary size)

### sentence_count
Total number of sentences

### avg_words_per_sentence
Average words per sentence (higher = more complex)

### avg_word_length
Average number of characters per word (longer words = more technical)

### estimated_reading_time_minutes
Time needed to read the document (based on 200 words/minute)

### estimated_grade_level
Flesch-Kincaid reading grade level (1-18)

### vocabulary_richness
Percentage of unique words compared to total words (higher = more diverse vocabulary)

---

## Subject Code Database

### CS - Computer Science
```
CS1001 - Introduction to Computer Science
CS1101 - Programming Fundamentals
CS2001 - Data Structures
CS2101 - Algorithms
CS2201 - Database Systems
CS2301 - Data Structures
CS2401 - Computer Organization
CS3001 - Operating Systems
CS3101 - Compiler Design
CS3201 - Computer Networks
CS3301 - Web Development
```

### MA - Mathematics
```
MA1001 - Calculus I
MA1101 - Linear Algebra
MA1201 - Discrete Mathematics
MA2001 - Calculus II
MA2101 - Abstract Algebra
MA2201 - Real Analysis
```

### PH - Physics
```
PH1001 - Physics I - Mechanics
PH1101 - Physics II - Electricity & Magnetism
PH2001 - Physics III - Optics
PH2101 - Modern Physics
```

### CH - Chemistry
```
CH1001 - Chemistry I - General Chemistry
CH1101 - Chemistry II - Organic Chemistry
CH2001 - Physical Chemistry
CH2101 - Analytical Chemistry
```

### BIO - Biology
```
BIO1001 - Biology I - Cell Biology
BIO1101 - Biology II - Genetics
BIO2001 - Molecular Biology
BIO2101 - Ecology
```

---

## Performance Considerations

### Processing Time (approximate)
- 1000 words: < 100ms
- 5000 words: < 500ms
- 10000 words: < 1 second
- 50000 words: 2-3 seconds

### Memory Usage
- Minimal for typical notes (< 10MB text)
- Scales linearly with document size

### Recommendations
- Limit file uploads to 50MB
- Process large documents asynchronously
- Cache analysis results for repeated queries

---

## Error Handling

**Common Errors:**

1. **Subject Code Not Detected**
   - The module will infer from keywords
   - Returns "UNKNOWN" if unable to detect

2. **No Definitions Found**
   - Returns empty list
   - Definitions are extracted only if explicitly stated in text

3. **Poor Summary Quality**
   - Occurs with very short documents (< 100 words)
   - Returns original text or first few sentences

4. **Concept Extraction Issues**
   - Handles various text formats and languages
   - Graceful degradation for low-quality OCR text

---

## Customization

### Adding New Subject Codes

Edit `SUBJECT_MAPPING` in `notes_analyzer.py`:

```python
SUBJECT_MAPPING = {
    'ENG': {
        '1001': 'Engineering Fundamentals',
        '2001': 'Structural Analysis',
    },
    # ... more subjects
}
```

### Adjusting Summary Length

Pass `num_sentences` parameter:

```python
summary = analyzer.generate_undergraduate_summary(text, num_sentences=7)
```

### Changing Concept Count

Modify the extraction:

```python
concepts = analyzer.extract_key_concepts(text, num_concepts=15)
```

---

## Best Practices

1. **Upload Quality Content**
   - Avoid OCR errors by uploading clear PDFs
   - Text files work best for accuracy

2. **Use Subject Names**
   - Helps the analyzer better identify concepts
   - Provide context when uploading

3. **Review Results**
   - Check if detected subject code is correct
   - Manually add notes if auto-detection fails

4. **Follow Up with Quizzes**
   - Use extracted concepts for quiz generation
   - Create targeted questions for key topics

5. **Generate Multiple Resources**
   - Use analyzer output to create:
     - Study guides
     - Flash cards
     - Practice questions
     - Revision notes

---

## Troubleshooting

**Q: Subject code not being detected**
- A: Ensure the code is in a clear format (e.g., "CS2301")
- Try rephrasing or adding subject name

**Q: Summary seems incomplete**
- A: Increase `num_sentences` parameter
- Check if source text has enough content

**Q: Key concepts not captured**
- A: Concepts are extracted from explicit mentions and frequency
- Add more context or details to notes

**Q: Definitions not extracted**
- A: Ensure definitions use standard phrases ("is defined as", "means", etc.)
- Extract manually if using non-standard format

---

## Integration Tips

### With Quiz Generator
```python
analysis = analyzer.analyze_notes(text)
concepts = analysis['key_concepts']
quiz_questions = quiz_gen.generate_quiz(text, num_questions=len(concepts)*2)
```

### With Doubt Solver
```python
context = analysis['summary'] + ' ' + ', '.join(analysis['key_concepts'])
doubt_answer = doubt_solver.solve_doubt(student_question, context)
```

### With Frontend
```javascript
// Frontend receives analysis results
const analysis = await fetch('/analyze-notes?note_id=1').then(r => r.json());

// Display subject info
document.getElementById('subject').textContent = analysis.subject;
document.getElementById('concepts').innerHTML =
  analysis.key_concepts.map(c => `<span class="tag">${c}</span>`).join('');
```

---

## Summary

The Notes Analyzer provides a complete solution for processing, analyzing, and extracting insights from student study notes. It's designed with undergraduates in mind, making complex information accessible and actionable.

**Key Takeaways:**
✓ Automatically detects subject codes and names
✓ Generates simple, student-friendly summaries
✓ Extracts and ranks important concepts
✓ Provides comprehensive study guides
✓ Analyzes content difficulty and metrics
✓ Scales from small notes to large textbooks
✓ Integrates seamlessly with other SafeLearn modules
