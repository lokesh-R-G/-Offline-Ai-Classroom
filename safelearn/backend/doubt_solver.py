"""
Doubt Solver Module
Handles answering student doubts with context from notes
"""

from typing import Optional, List, Dict
from nltk.tokenize import sent_tokenize, word_tokenize
from difflib import SequenceMatcher
import nltk

# Ensure punkt tokenizer is downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')


class DoubtSolver:
    """Solve student doubts using note context and question matching"""

    def __init__(self):
        self.model_name = "offline-ai-model"
        self.doubt_keywords = {
            'what': ['definition', 'meaning', 'explanation'],
            'how': ['process', 'method', 'procedure'],
            'why': ['reason', 'cause', 'rationale'],
            'when': ['timing', 'situation', 'circumstance'],
            'where': ['location', 'context', 'place'],
            'which': ['choice', 'option', 'selection'],
            'who': ['person', 'character', 'entity']
        }

    def solve_doubt(self, doubt: str, context: Optional[str] = None) -> dict:
        """
        Solve a student's doubt with or without context

        Args:
            doubt: The student's question/doubt
            context: Optional context from their notes

        Returns:
            Dictionary with explanation and related concepts
        """
        # Analyze the doubt
        doubt_type = self._classify_doubt(doubt)
        doubt_keywords = self._extract_keywords(doubt)

        explanation = ""
        examples = []
        related_concepts = []

        if context:
            # Find relevant sentences from context
            relevant_sentences = self._find_relevant_sentences(doubt, context)
            explanation = self._generate_explanation(doubt, relevant_sentences, doubt_type)
            examples = self._extract_examples(relevant_sentences)
            related_concepts = self._find_related_concepts(relevant_sentences, doubt_keywords)
        else:
            # Generate generic explanation
            explanation = self._generate_generic_explanation(doubt, doubt_type)

        response = {
            "doubt": doubt,
            "doubt_type": doubt_type,
            "explanation": explanation,
            "related_concepts": related_concepts,
            "examples": examples,
            "difficulty_level": self._assess_difficulty(doubt),
            "keywords": doubt_keywords
        }
        return response

    def _classify_doubt(self, doubt: str) -> str:
        """Classify the type of doubt (what, how, why, etc.)"""
        doubt_lower = doubt.lower().strip()
        first_word = doubt_lower.split()[0].rstrip('?')

        return first_word if first_word in self.doubt_keywords else "general"

    def _extract_keywords(self, doubt: str) -> List[str]:
        """Extract key words from the doubt"""
        words = word_tokenize(doubt.lower())
        # Filter out common stop words and keep content words
        stop_words = {'what', 'how', 'why', 'when', 'where', 'which', 'who', 'is', 'are', 'the', 'a', 'an'}
        keywords = [w for w in words if w.isalnum() and w not in stop_words]
        return keywords[:5]  # Top 5 keywords

    def _find_relevant_sentences(self, doubt: str, context: str, num_results: int = 3) -> List[str]:
        """Find sentences from context most relevant to the doubt"""
        sentences = sent_tokenize(context)
        if not sentences:
            return []

        # Score sentences based on similarity to doubt
        scores = []
        for sentence in sentences:
            similarity = self._calculate_similarity(doubt, sentence)
            scores.append((sentence, similarity))

        # Return top sentences sorted by score
        top_sentences = sorted(scores, key=lambda x: x[1], reverse=True)[:num_results]
        return [sent for sent, _ in top_sentences if sent]

    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts"""
        matcher = SequenceMatcher(None, text1.lower(), text2.lower())
        return matcher.ratio()

    def _generate_explanation(
        self,
        doubt: str,
        relevant_sentences: List[str],
        doubt_type: str
    ) -> str:
        """Generate explanation based on doubt type and relevant content"""
        if not relevant_sentences:
            return self._generate_generic_explanation(doubt, doubt_type)

        context_text = ' '.join(relevant_sentences)

        if doubt_type == 'what':
            return f"Based on the study material: {context_text}"
        elif doubt_type == 'how':
            return f"The process involves: {context_text}"
        elif doubt_type == 'why':
            return f"The reason is: {context_text}"
        else:
            return f"Regarding your question: {context_text}"

    def _generate_generic_explanation(self, doubt: str, doubt_type: str) -> str:
        """Generate generic explanation when no context is available"""
        type_responses = {
            'what': f"To understand '{doubt.replace('What is ', '').rstrip('?')}', you should refer to your study materials or textbooks for detailed information.",
            'how': f"To learn how to do this, break down the process into steps and practice with examples.",
            'why': f"Understanding the 'why' requires understanding underlying concepts. Review related topics.",
            'general': f"Your doubt: {doubt} is a good question. Try to find related concepts in your study material."
        }
        return type_responses.get(doubt_type, type_responses['general'])

    def _extract_examples(self, sentences: List[str]) -> List[str]:
        """Extract example sentences or create synthetic examples"""
        examples = []
        for sentence in sentences:
            if 'example' in sentence.lower() or 'such as' in sentence.lower():
                examples.append(sentence.strip())

        # If no examples found, create one
        if not examples and sentences:
            examples = [f"For instance, from the study material: {sentences[0][:100]}..."]

        return examples[:3]  # Return up to 3 examples

    def _find_related_concepts(self, sentences: List[str], doubt_keywords: List[str]) -> List[str]:
        """Find related concepts from sentences"""
        concepts = set()

        for sentence in sentences:
            words = word_tokenize(sentence.lower())
            # Find capitalized words (potential concepts)
            for i, word in enumerate(words):
                if i > 0 and words[i][0].isupper() and len(word) > 3:
                    concepts.add(word.rstrip('.,!?'))

        # Add related concepts based on keywords
        for keyword in doubt_keywords:
            if keyword in ['understand', 'learn', 'explain']:
                concepts.add('Fundamental Concepts')
            elif keyword in ['important', 'significant']:
                concepts.add('Key Points')

        return list(concepts)[:5]  # Return up to 5 concepts

    def _assess_difficulty(self, doubt: str) -> str:
        """Assess difficulty level of the doubt"""
        word_count = len(doubt.split())
        unique_words = len(set(doubt.lower().split()))

        if word_count < 5 or unique_words < 3:
            return "basic"
        elif word_count < 15:
            return "intermediate"
        else:
            return "advanced"

    def get_similar_doubts(self, doubt: str, doubt_list: List[Dict] = None) -> List[Dict]:
        """
        Get similar doubts from database

        Args:
            doubt: The reference doubt
            doubt_list: List of doubts to search (from database)

        Returns:
            List of similar doubts
        """
        if not doubt_list:
            return []

        similar_doubts = []
        for stored_doubt in doubt_list:
            similarity = self._calculate_similarity(doubt, stored_doubt.get('question', ''))
            if similarity > 0.5:  # 50% similarity threshold
                similar_doubts.append({
                    'doubt': stored_doubt,
                    'similarity_score': round(similarity, 2)
                })

        # Sort by similarity score
        similar_doubts.sort(key=lambda x: x['similarity_score'], reverse=True)
        return similar_doubts[:5]  # Return top 5 similar doubts

    def rate_solution(self, solution_id: int, rating: int) -> bool:
        """
        Rate a solution (1-5 stars)

        Args:
            solution_id: ID of the solution to rate
            rating: Rating from 1-5

        Returns:
            Success status
        """
        if 1 <= rating <= 5:
            # In a real app, this would update the database
            return True
        return False

    def follow_up_doubt(self, original_doubt: str, follow_up: str, context: Optional[str] = None) -> dict:
        """
        Handle follow-up doubts related to previous questions

        Args:
            original_doubt: The original question
            follow_up: The follow-up question
            context: Optional context from notes

        Returns:
            Solution to follow-up doubt
        """
        # Process follow-up with context of original doubt
        combined_context = f"Context: {original_doubt}. Follow-up question: {follow_up}"
        return self.solve_doubt(follow_up, context or combined_context)

    def suggest_next_topics(self, doubt: str, context: Optional[str] = None) -> List[str]:
        """
        Suggest related topics to study based on the doubt

        Args:
            doubt: The student's doubt
            context: Optional context

        Returns:
            List of suggested topics
        """
        keywords = self._extract_keywords(doubt)
        suggestions = []

        topic_mapping = {
            'define': ['Terminology', 'Concepts', 'Definitions'],
            'why': ['Rationale', 'Background', 'Context'],
            'how': ['Methods', 'Procedures', 'Applications'],
            'example': ['Case Studies', 'Real-world Applications', 'Practical Usage']
        }

        for keyword in keywords:
            for key, topics in topic_mapping.items():
                if key in keyword:
                    suggestions.extend(topics)

        return list(set(suggestions))[:5]  # Return top 5 unique suggestions

