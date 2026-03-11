"""
Notes Analyzer Module
Analyzes study notes and extracts key concepts
"""

from typing import List, Dict


class NotesAnalyzer:
    def __init__(self):
        self.stop_words = set(["the", "a", "an", "is", "are", "and", "or", "but"])

    def analyze_notes(self, content: str) -> Dict:
        """
        Analyze study notes and extract insights

        Args:
            content: The study notes content

        Returns:
            Dictionary with analysis results
        """
        return {
            "word_count": len(content.split()),
            "estimated_read_time": self._calculate_read_time(content),
            "key_concepts": self.extract_key_concepts(content),
            "topics": self.extract_topics(content),
            "summary": self.generate_summary(content),
            "complexity_score": self._calculate_complexity(content)
        }

    def extract_key_concepts(self, content: str) -> List[str]:
        """Extract key concepts from notes"""
        words = content.lower().split()
        filtered_words = [w for w in words if w not in self.stop_words]
        return filtered_words[:10]  # Return top 10

    def extract_topics(self, content: str) -> List[str]:
        """Extract main topics from notes"""
        return ["Topic 1", "Topic 2", "Topic 3"]

    def generate_summary(self, content: str) -> str:
        """Generate summary of notes"""
        lines = content.split("\n")
        return "\n".join(lines[:3]) + "..."

    def _calculate_read_time(self, content: str) -> int:
        """Calculate estimated reading time in minutes"""
        word_count = len(content.split())
        return max(1, word_count // 200)

    def _calculate_complexity(self, content: str) -> float:
        """Calculate complexity score (0-1)"""
        return 0.5
