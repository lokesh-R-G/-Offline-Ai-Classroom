"""
File Processor Module
Handles extraction of text from various file formats (PDF, DOCX, TXT)
"""

import PyPDF2
from docx import Document
from pathlib import Path
from typing import Tuple


class FileProcessor:
    """Process different file formats and extract text"""

    ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.txt'}

    @staticmethod
    def is_allowed_file(filename: str) -> bool:
        """Check if file extension is allowed"""
        return Path(filename).suffix.lower() in FileProcessor.ALLOWED_EXTENSIONS

    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            text = []
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text.append(page.extract_text())
            return '\n'.join(text)
        except Exception as e:
            raise ValueError(f"Error reading PDF: {str(e)}")

    @staticmethod
    def extract_text_from_docx(file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = []
            for paragraph in doc.paragraphs:
                text.append(paragraph.text)
            return '\n'.join(text)
        except Exception as e:
            raise ValueError(f"Error reading DOCX: {str(e)}")

    @staticmethod
    def extract_text_from_txt(file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            raise ValueError(f"Error reading TXT: {str(e)}")

    @staticmethod
    def extract_text(file_path: str, file_type: str) -> str:
        """
        Extract text based on file type

        Args:
            file_path: Path to the file
            file_type: File type (pdf, docx, txt)

        Returns:
            Extracted text content
        """
        file_type_lower = file_type.lower()

        if file_type_lower == 'pdf':
            return FileProcessor.extract_text_from_pdf(file_path)
        elif file_type_lower == 'docx':
            return FileProcessor.extract_text_from_docx(file_path)
        elif file_type_lower == 'txt':
            return FileProcessor.extract_text_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

    @staticmethod
    def get_file_stats(text: str) -> dict:
        """Get statistics about the extracted text"""
        words = text.split()
        sentences = text.split('.')
        paragraphs = text.split('\n\n')

        return {
            'word_count': len(words),
            'sentence_count': len([s for s in sentences if s.strip()]),
            'paragraph_count': len([p for p in paragraphs if p.strip()]),
            'average_word_length': sum(len(w) for w in words) / len(words) if words else 0,
            'reading_time_minutes': max(1, len(words) // 200)
        }
