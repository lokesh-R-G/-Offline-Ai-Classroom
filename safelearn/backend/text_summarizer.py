"""
Summarization Module
Generates summaries and extracts key concepts from text
"""

import re
from typing import List, Dict
from collections import Counter
import nltk

# Download required NLTK data if not already present
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords


class TextSummarizer:
    """Generate summaries and extract concepts from text"""

    def __init__(self):
        self.stop_words = set(stopwords.words('english'))

    def generate_summary(self, text: str, num_sentences: int = 5) -> str:
        """
        Generate extractive summary using sentence frequency

        Args:
            text: The input text to summarize
            num_sentences: Number of sentences to include in summary

        Returns:
            Summary text
        """
        if not text or len(text.split()) < 10:
            return text

        # Tokenize into sentences
        sentences = sent_tokenize(text)

        if len(sentences) <= num_sentences:
            return text

        # Calculate word frequencies
        words = word_tokenize(text.lower())
        word_freq = Counter(w for w in words if w.isalnum() and w not in self.stop_words)

        # Score sentences
        sentence_scores = {}
        for i, sentence in enumerate(sentences):
            words_in_sentence = word_tokenize(sentence.lower())
            score = sum(word_freq.get(w, 0) for w in words_in_sentence if w.isalnum())
            sentence_scores[i] = score

        # Get top sentences maintaining order
        top_sentences = sorted(
            sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:num_sentences],
            key=lambda x: x[0]
        )

        summary = ' '.join(sentences[idx] for idx, _ in top_sentences)
        return summary

    def extract_key_concepts(self, text: str, num_concepts: int = 10) -> List[str]:
        """
        Extract key concepts/keywords from text

        Args:
            text: The input text
            num_concepts: Number of concepts to extract

        Returns:
            List of key concepts
        """
        # Tokenize and clean
        words = word_tokenize(text.lower())
        words_filtered = [
            w for w in words
            if w.isalnum() and w not in self.stop_words and len(w) > 2
        ]

        # Get word frequencies
        word_freq = Counter(words_filtered)

        # Extract noun phrases (simple approach: capitalized words)
        noun_phrases = self._extract_noun_phrases(text)

        # Combine and rank
        all_concepts = noun_phrases + [w for w, _ in word_freq.most_common(num_concepts * 2)]
        concept_freq = Counter(all_concepts)

        return [concept for concept, _ in concept_freq.most_common(num_concepts)]

    def _extract_noun_phrases(self, text: str) -> List[str]:
        """Extract potential noun phrases (capitalized sequences)"""
        # Find sequences of capitalized words
        pattern = r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b'
        phrases = re.findall(pattern, text)
        return phrases[:10]

    def generate_outline(self, text: str) -> List[str]:
        """
        Generate outline from text by finding main points

        Args:
            text: Input text

        Returns:
            List of main points (outline)
        """
        sentences = sent_tokenize(text)
        # Take every nth sentence based on text length
        step = max(1, len(sentences) // 5)  # Aim for 5 main points
        outline = [sent.strip()[:100] + '...' if len(sent.strip()) > 100 else sent.strip()
                   for sent in sentences[::step]]
        return outline

    def get_text_metrics(self, text: str) -> Dict:
        """
        Calculate metrics about the text

        Args:
            text: Input text

        Returns:
            Dictionary with text metrics
        """
        sentences = sent_tokenize(text)
        words = word_tokenize(text)
        words_filtered = [w for w in words if w.isalnum()]

        unique_words = len(set(words_filtered))
        avg_word_length = sum(len(w) for w in words_filtered) / len(words_filtered) if words_filtered else 0
        avg_sentence_length = len(words_filtered) / len(sentences) if sentences else 0

        # Flesch Kincaid Grade Level approximation
        grade_level = 0.39 * avg_sentence_length + 11.8 * avg_word_length - 15.59
        grade_level = max(1, min(18, grade_level))  # Clamp between 1 and 18

        return {
            'word_count': len(words_filtered),
            'unique_word_count': unique_words,
            'sentence_count': len(sentences),
            'average_word_length': round(avg_word_length, 2),
            'average_sentence_length': round(avg_sentence_length, 2),
            'vocabulary_diversity': round(unique_words / len(words_filtered) * 100, 2) if words_filtered else 0,
            'estimated_grade_level': round(grade_level, 1),
            'reading_time_minutes': max(1, len(words_filtered) // 200)
        }
