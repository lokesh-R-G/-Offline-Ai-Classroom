"""
Notes Analyzer Module
Analyzes uploaded study notes and extracts:
- Subject code detection (e.g., CS2301)
- Subject name identification
- Summary generation (undergraduate-friendly)
- Key concepts extraction
"""

import re
from typing import List, Dict, Optional, Tuple
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
import nltk

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')


class NotesAnalyzer:
    """Analyze study notes and extract academic information"""

    # Subject code to subject name mapping
    SUBJECT_MAPPING = {
        # Computer Science
        'CS': {
            '1001': 'Introduction to Computer Science',
            '1101': 'Programming Fundamentals',
            '2001': 'Data Structures',
            '2101': 'Algorithms',
            '2201': 'Database Systems',
            '2301': 'Data Structures',
            '2401': 'Computer Organization',
            '3001': 'Operating Systems',
            '3101': 'Compiler Design',
            '3201': 'Computer Networks',
            '3301': 'Web Development',
        },
        # Mathematics
        'MA': {
            '1001': 'Calculus I',
            '1101': 'Linear Algebra',
            '1201': 'Discrete Mathematics',
            '2001': 'Calculus II',
            '2101': 'Abstract Algebra',
            '2201': 'Real Analysis',
        },
        # Physics
        'PH': {
            '1001': 'Physics I - Mechanics',
            '1101': 'Physics II - Electricity & Magnetism',
            '2001': 'Physics III - Optics',
            '2101': 'Modern Physics',
        },
        # Chemistry
        'CH': {
            '1001': 'Chemistry I - General Chemistry',
            '1101': 'Chemistry II - Organic Chemistry',
            '2001': 'Physical Chemistry',
            '2101': 'Analytical Chemistry',
        },
        # Biology
        'BIO': {
            '1001': 'Biology I - Cell Biology',
            '1101': 'Biology II - Genetics',
            '2001': 'Molecular Biology',
            '2101': 'Ecology',
        },
        # Engineering
        'EC': {
            '1001': 'Electrical Engineering Basics',
            '2001': 'Circuit Theory',
            '2101': 'Digital Electronics',
        },
        'ME': {
            '1001': 'Engineering Mechanics',
            '2001': 'Thermodynamics',
            '2101': 'Fluid Mechanics',
        },
        # English
        'EN': {
            '1001': 'English Composition',
            '1101': 'Literature & Writing',
            '2001': 'Advanced Writing',
        },
    }

    # Keywords associated with concepts
    CONCEPT_INDICATORS = {
        'algorithm': ['implement', 'step', 'pseudocode', 'complexity', 'runtime'],
        'theorem': ['proof', 'proved', 'proven', 'lemma', 'corollary'],
        'formula': ['equation', 'calculate', 'compute', 'derive'],
        'property': ['characteristic', 'feature', 'attribute', 'property'],
        'method': ['process', 'procedure', 'technique', 'approach'],
        'example': ['instance', 'illustration', 'case', 'demo'],
    }

    def __init__(self):
        """Initialize the analyzer with stop words"""
        self.stop_words = set(stopwords.words('english'))
        # Add common academic stop words
        self.stop_words.update({
            'abstract', 'conclusion', 'introduction', 'references',
            'chapter', 'section', 'page', 'figure', 'table', 'note'
        })

    def analyze_notes(self, content: str) -> Dict:
        """
        Comprehensive analysis of study notes

        Args:
            content: Extracted text from uploaded notes

        Returns:
            Dictionary with all analysis results
        """
        # Detect subject code and name
        subject_code, subject_name = self.detect_subject(content)

        # Generate summary
        summary = self.generate_undergraduate_summary(content)

        # Extract key concepts
        key_concepts = self.extract_key_concepts(content, subject_code)

        # Calculate metrics
        metrics = self._calculate_metrics(content)

        return {
            'subject': subject_name or 'General Subject',
            'subject_code': subject_code or 'UNKNOWN',
            'summary': summary,
            'key_concepts': key_concepts,
            'metrics': metrics,
            'content_type': self._identify_content_type(content)
        }

    def detect_subject(self, content: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Detect subject code and identify subject name

        Patterns supported:
        - CS2301
        - CS 2301
        - CS-2301
        - [CS2301]
        - (CS2301)

        Args:
            content: The text content

        Returns:
            Tuple of (subject_code, subject_name)
        """
        # Pattern to match subject codes like CS2301, MA1001, etc.
        patterns = [
            r'\b([A-Z]{2,4})[\s\-]?(\d{4})\b',  # CS2301, CS 2301, CS-2301
            r'\[([A-Z]{2,4})[\s\-]?(\d{4})\]',   # [CS2301]
            r'\(([A-Z]{2,4})[\s\-]?(\d{4})\)',   # (CS2301)
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                subject_prefix = match.group(1)
                subject_code_number = match.group(2)
                full_code = f"{subject_prefix}{subject_code_number}"

                # Try to find subject name
                subject_name = None
                if subject_prefix in self.SUBJECT_MAPPING:
                    subject_name = self.SUBJECT_MAPPING[subject_prefix].get(subject_code_number)

                if subject_name:
                    return full_code, subject_name

                # If not in mapping, return just the code
                return full_code, None

        # Fallback: try to infer from content
        inferred = self._infer_subject_from_keywords(content)
        return inferred[0], inferred[1]

    def _infer_subject_from_keywords(self, content: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Infer subject from keywords in content

        Args:
            content: The text content

        Returns:
            Tuple of (subject_code, subject_name)
        """
        content_lower = content.lower()

        # Weight keywords for different subjects
        subject_keywords = {
            'CS': ['algorithm', 'data structure', 'binary tree', 'array', 'linked list', 'hash table',
                   'sorting', 'searching', 'complexity', 'compilation', 'network', 'database'],
            'MA': ['theorem', 'proof', 'derivative', 'integral', 'matrix', 'vector', 'equation',
                   'solution', 'limit', 'convergence'],
            'PH': ['force', 'velocity', 'acceleration', 'momentum', 'energy', 'field', 'wave',
                   'particle', 'electricity', 'magnetism'],
            'CH': ['molecule', 'atom', 'bond', 'reaction', 'element', 'compound', 'oxidation',
                   'equilibrium', 'acid', 'base'],
            'BIO': ['cell', 'organism', 'gene', 'protein', 'dna', 'enzyme', 'evolution',
                    'ecosystem', 'mutation', 'chromosome'],
        }

        scores = {}
        for subject, keywords in subject_keywords.items():
            score = sum(1 for kw in keywords if kw in content_lower)
            scores[subject] = score

        # Get the subject with highest score
        if scores and max(scores.values()) > 0:
            best_subject = max(scores, key=scores.get)
            return best_subject, f"Detected as {best_subject} course"

        return None, None

    def generate_undergraduate_summary(self, content: str, num_sentences: int = 3) -> str:
        """
        Generate a simple, undergraduate-friendly summary

        Args:
            content: The text content
            num_sentences: Number of sentences in summary

        Returns:
            Simple summary text
        """
        try:
            sentences = sent_tokenize(content)
        except:
            # Fallback if sentence tokenization fails
            sentences = [s.strip() for s in content.split('.') if s.strip()]

        if not sentences:
            return content[:200] + '...' if len(content) > 200 else content

        # Score sentences based on keyword frequency and position
        sentence_scores = {}

        # Get important words (excluding stop words)
        words = word_tokenize(content.lower())
        important_words = set(w for w in words if w.isalnum() and w not in self.stop_words and len(w) > 3)

        for i, sentence in enumerate(sentences):
            # Prefer earlier sentences (they often contain main ideas)
            position_score = 1 / (i + 1)

            # Score based on important words
            sentence_words = set(w.lower() for w in word_tokenize(sentence) if w.isalnum())
            word_score = len(sentence_words & important_words) / len(important_words) if important_words else 0

            # Combined score
            sentence_scores[i] = (word_score * 0.7 + position_score * 0.3)

        # Get top sentences maintaining order
        top_indices = sorted(
            sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:num_sentences],
            key=lambda x: x[0]
        )

        summary = '. '.join(sentences[idx] for idx, _ in top_indices)
        return summary

    def extract_key_concepts(self, content: str, subject_code: Optional[str] = None, num_concepts: int = 8) -> List[str]:
        """
        Extract key concepts suitable for undergraduate study

        Args:
            content: The text content
            subject_code: Optional subject code for context
            num_concepts: Number of concepts to extract

        Returns:
            List of key concepts ranked by importance
        """
        # Tokenize and clean
        words = word_tokenize(content)
        words_lower = [w.lower() for w in words]

        # Extract noun phrases and important terms
        concepts = []

        # 1. Extract capitalized phrases (likely proper nouns/concepts)
        capitalized_pattern = r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b'
        capitalized_phrases = re.findall(capitalized_pattern, content)
        concepts.extend(capitalized_phrases)

        # 2. Extract words appearing in concept indicator contexts
        sentences = sent_tokenize(content)
        for sentence in sentences:
            sentence_lower = sentence.lower()
            for concept_type, indicators in self.CONCEPT_INDICATORS.items():
                for indicator in indicators:
                    if indicator in sentence_lower:
                        # Extract important words from this sentence
                        sentence_words = word_tokenize(sentence_lower)
                        for word in sentence_words:
                            if (word.isalnum() and word not in self.stop_words and
                                len(word) > 3 and word not in concepts):
                                concepts.append(word.capitalize())
                        break

        # 3. Extract frequently occurring words (excluding very common ones)
        from collections import Counter
        filtered_words = [w for w in words_lower if w.isalnum() and w not in self.stop_words and len(w) > 3]
        word_freq = Counter(filtered_words)

        for word, freq in word_freq.most_common(num_concepts * 3):
            if freq >= 2 and word.capitalize() not in concepts:  # At least 2 occurrences
                concepts.append(word.capitalize())

        # Remove duplicates and limit
        concepts = list(dict.fromkeys(concepts))[:num_concepts]

        return concepts if concepts else ['General Concepts', 'Theory', 'Practice', 'Application']

    def _identify_content_type(self, content: str) -> str:
        """
        Identify the type of content (textbook, lecture notes, research paper, etc.)

        Args:
            content: The text content

        Returns:
            Content type classification
        """
        content_lower = content.lower()

        if any(word in content_lower for word in ['abstract', 'introduction', 'methodology', 'conclusion', 'references']):
            return 'Research Paper / Formal Document'
        elif any(word in content_lower for word in ['lecture', 'slide', 'today', 'class']):
            return 'Lecture Notes'
        elif any(word in content_lower for word in ['exercise', 'problem', 'solution', 'answer']):
            return 'Problem Set / Exercises'
        elif any(word in content_lower for word in ['chapter', 'section', 'example', 'summary']):
            return 'Textbook Chapter'
        else:
            return 'Study Notes'

    def _calculate_metrics(self, content: str) -> Dict:
        """
        Calculate various metrics about the content

        Args:
            content: The text content

        Returns:
            Dictionary with metrics
        """
        words = word_tokenize(content)
        sentences = sent_tokenize(content)

        # Basic counts
        word_count = len(words)
        unique_words = len(set(w.lower() for w in words if w.isalnum()))
        sentence_count = len(sentences)

        # Calculate averages
        avg_words_per_sentence = word_count / sentence_count if sentence_count > 0 else 0
        avg_word_length = sum(len(w) for w in words if w.isalnum()) / word_count if word_count > 0 else 0

        # Estimate grade level using Flesch-Kincaid approximation
        grade_level = 0.39 * avg_words_per_sentence + 11.8 * avg_word_length - 15.59
        grade_level = max(1, min(18, grade_level))

        # Calculate difficulty (simple heuristic)
        if grade_level < 8:
            difficulty = 'Easy'
        elif grade_level < 12:
            difficulty = 'Moderate'
        else:
            difficulty = 'Advanced'

        return {
            'word_count': word_count,
            'unique_word_count': unique_words,
            'sentence_count': sentence_count,
            'avg_words_per_sentence': round(avg_words_per_sentence, 2),
            'avg_word_length': round(avg_word_length, 2),
            'estimated_reading_time_minutes': max(1, word_count // 200),
            'estimated_grade_level': round(grade_level, 1),
            'difficulty_level': difficulty,
            'vocabulary_richness': round(unique_words / word_count * 100, 2) if word_count > 0 else 0
        }

    def extract_definitions(self, content: str) -> List[Dict]:
        """
        Extract potential definitions from the content

        Args:
            content: The text content

        Returns:
            List of potential definitions
        """
        definitions = []

        # Pattern: "Term is defined as..."
        pattern1 = r'(\w+)\s+(?:is|means|refers to)\s+(.+?)(?:\.|;|,)'
        matches = re.finditer(pattern1, content, re.IGNORECASE)

        for match in matches:
            term = match.group(1).strip()
            definition = match.group(2).strip()
            if len(term.split()) <= 3 and len(definition) < 200:
                definitions.append({'term': term, 'definition': definition})

        return definitions[:10]  # Return top 10 definitions

    def generate_study_guide(self, content: str, subject_code: Optional[str] = None) -> Dict:
        """
        Generate a comprehensive study guide from notes

        Args:
            content: The text content
            subject_code: Optional subject code

        Returns:
            Dictionary with study guide components
        """
        analysis = self.analyze_notes(content)
        definitions = self.extract_definitions(content)

        return {
            'subject': analysis['subject'],
            'subject_code': analysis['subject_code'],
            'summary': analysis['summary'],
            'key_concepts': analysis['key_concepts'],
            'key_definitions': definitions,
            'study_tips': [
                'Review key concepts regularly',
                'Practice problem-solving exercises',
                'Create visual diagrams for complex topics',
                'Test yourself with quiz questions',
                'Form study groups to discuss difficult concepts'
            ],
            'study_time_estimate_hours': max(1, analysis['metrics']['estimated_reading_time_minutes'] // 60),
            'difficulty_level': analysis['metrics']['difficulty_level']
        }
