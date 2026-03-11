"""
Quiz Generator Module
Generates MCQ, short answer, long answer, and application questions from content
"""

import re
from typing import List, Dict
from nltk.tokenize import sent_tokenize
import nltk

# Ensure punkt tokenizer is downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')


class QuizGenerator:
    """Generate various types of quiz questions from content"""

    def __init__(self):
        self.difficulty_levels = ["easy", "medium", "hard"]
        self.question_templates = {
            'easy': [
                "What is {concept}?",
                "Define {concept}.",
                "Which of the following is {concept}?",
                "What does {concept} mean?",
            ],
            'medium': [
                "How does {concept} relate to {concept2}?",
                "Explain the relationship between {concept} and {concept2}.",
                "Why is {concept} important in {topic}?",
                "What is the significance of {concept}?",
            ],
            'hard': [
                "Analyze how {concept} can be applied to {scenario}.",
                "Compare and contrast {concept} with {concept2}.",
                "What would happen if {scenario}?",
                "How can {concept} be used to solve {problem}?",
            ]
        }

    def generate_quiz(
        self,
        content: str,
        num_questions: int = 5,
        difficulty: str = "medium",
        question_types: List[str] = None
    ) -> List[Dict]:
        """
        Generate a mix of different question types

        Args:
            content: The study material
            num_questions: Number of questions to generate
            difficulty: Difficulty level (easy, medium, hard)
            question_types: List of question types to generate (default: mix of all)

        Returns:
            List of quiz questions
        """
        if question_types is None:
            question_types = ['mcq', 'short_answer', 'long_answer', 'application']

        questions = []
        sentences = sent_tokenize(content)

        if not sentences:
            return questions

        # Distribute questions across types
        per_type = max(1, num_questions // len(question_types))
        remaining = num_questions

        for q_type in question_types:
            if remaining <= 0:
                break

            num_to_generate = min(per_type, remaining)

            if q_type == 'mcq':
                questions.extend(
                    self.generate_mcq_batch(content, num_to_generate, difficulty, sentences)
                )
            elif q_type == 'short_answer':
                questions.extend(
                    self.generate_short_answer_batch(content, num_to_generate, difficulty, sentences)
                )
            elif q_type == 'long_answer':
                questions.extend(
                    self.generate_long_answer_batch(content, num_to_generate, difficulty, sentences)
                )
            elif q_type == 'application':
                questions.extend(
                    self.generate_application_batch(content, num_to_generate, difficulty, sentences)
                )

            remaining -= num_to_generate

        return questions[:num_questions]

    def generate_mcq_batch(
        self,
        content: str,
        count: int,
        difficulty: str,
        sentences: List[str]
    ) -> List[Dict]:
        """Generate multiple choice questions"""
        questions = []
        for i in range(min(count, len(sentences))):
            question = self._generate_mcq(content, sentences[i * len(sentences) // count], difficulty)
            if question:
                questions.append(question)
        return questions

    def _generate_mcq(self, content: str, focus_sentence: str, difficulty: str) -> Dict:
        """Generate a single MCQ question"""
        # Extract key phrase from sentence
        words = focus_sentence.split()
        if len(words) < 3:
            return None

        key_phrase = ' '.join(words[:3])

        # Generate options
        options = [key_phrase, "Incorrect option 1", "Incorrect option 2", "Incorrect option 3"]

        return {
            "type": "mcq",
            "question": f"Based on the content, what does '{key_phrase}' refer to?",
            "options": options,
            "correct_answer": 0,  # Index of correct answer
            "difficulty": difficulty,
            "explanation": f"The correct answer is '{key_phrase}' as mentioned in the study material."
        }

    def generate_short_answer_batch(
        self,
        content: str,
        count: int,
        difficulty: str,
        sentences: List[str]
    ) -> List[Dict]:
        """Generate short answer questions"""
        questions = []
        for i in range(min(count, len(sentences))):
            question = self._generate_short_answer(sentences[i * len(sentences) // count], difficulty)
            if question:
                questions.append(question)
        return questions

    def _generate_short_answer(self, focus_sentence: str, difficulty: str) -> Dict:
        """Generate a single short answer question"""
        # Create question from sentence
        words = focus_sentence.split()
        if len(words) < 5:
            return None

        # Extract keywords from the sentence
        keywords = [w for w in words if len(w) > 4][:3]

        question_template = self.question_templates.get(difficulty, self.question_templates['medium'])[0]
        question = question_template.format(concept=words[0])

        return {
            "type": "short_answer",
            "question": f"{question} (Answer in 2-3 lines)",
            "answer_keywords": keywords,
            "sample_answer": focus_sentence,
            "difficulty": difficulty,
            "marks": 3
        }

    def generate_long_answer_batch(
        self,
        content: str,
        count: int,
        difficulty: str,
        sentences: List[str]
    ) -> List[Dict]:
        """Generate long answer questions"""
        questions = []
        for i in range(min(count, len(sentences) // 2)):
            # Combine multiple sentences for context
            combined_sentences = ' '.join(sentences[i * 2:(i * 2) + 3])
            question = self._generate_long_answer(combined_sentences, difficulty)
            if question:
                questions.append(question)
        return questions

    def _generate_long_answer(self, context: str, difficulty: str) -> Dict:
        """Generate a single long answer question"""
        sentences = sent_tokenize(context)
        if len(sentences) < 2:
            return None

        words = sentences[0].split()
        question_template = self.question_templates.get(difficulty, self.question_templates['medium'])[1]
        question = question_template.format(concept=words[0], concept2="the concept")

        return {
            "type": "long_answer",
            "question": f"{question} (Answer in 1-2 paragraphs)",
            "answer_keywords": [w for w in words if len(w) > 4][:5],
            "sample_answer": context,
            "difficulty": difficulty,
            "marks": 5
        }

    def generate_application_batch(
        self,
        content: str,
        count: int,
        difficulty: str,
        sentences: List[str]
    ) -> List[Dict]:
        """Generate application/problem-solving questions"""
        questions = []
        scenarios = [
            "in real-world applications",
            "for solving practical problems",
            "in advanced scenarios",
            "with modern examples"
        ]

        for i in range(min(count, len(scenarios))):
            question = self._generate_application(sentences[i % len(sentences)], scenarios[i], difficulty)
            if question:
                questions.append(question)
        return questions

    def _generate_application(self, focus_sentence: str, scenario: str, difficulty: str) -> Dict:
        """Generate a single application question"""
        words = focus_sentence.split()
        if len(words) < 3:
            return None

        concept = words[0]
        question_template = self.question_templates.get(difficulty, self.question_templates['hard'])[0]
        question = question_template.format(concept=concept, scenario=scenario)

        return {
            "type": "application",
            "question": f"{question} (Provide a detailed example)",
            "difficulty": difficulty,
            "marks": 6,
            "hints": [
                f"Think about how {concept} applies to {scenario}",
                "Consider real-world examples",
                "Explain the reasoning behind your answer"
            ]
        }

    def generate_mcq(self, content: str, num_options: int = 4) -> Dict:
        """Generate a single MCQ (legacy method)"""
        sentences = sent_tokenize(content)
        if not sentences:
            return {}

        focus_sentence = sentences[0]
        words = focus_sentence.split()

        return {
            "question": f"What is the main idea of: '{focus_sentence[:50]}...'?",
            "options": [
                focus_sentence[:50],
                "Incorrect interpretation 1",
                "Incorrect interpretation 2",
                "General statement"
            ],
            "correct_answer": 0,
            "explanation": focus_sentence
        }

    def generate_short_answer(self, content: str) -> Dict:
        """Generate a single short answer question (legacy method)"""
        sentences = sent_tokenize(content)
        if not sentences:
            return {}

        return {
            "question": sentences[0] if sentences else "Explain the key concept",
            "answer_keywords": [w for w in sentences[0].split() if len(w) > 4][:3],
            "sample_answer": sentences[0] if sentences else "Sample answer"
        }

    def generate_long_answer(self, content: str) -> Dict:
        """Generate a long answer question (legacy method)"""
        sentences = sent_tokenize(content)
        if len(sentences) < 2:
            return {}

        return {
            "question": "Explain the key concepts discussed in the text in detail",
            "answer_keywords": [w for w in content.split() if len(w) > 5][:5],
            "sample_answer": ' '.join(sentences[:2]),
            "marks": 5
        }

