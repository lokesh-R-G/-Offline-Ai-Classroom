#!/usr/bin/env python3
"""
Notes Analyzer Test Suite
Tests the NotesAnalyzer module functionality
"""

import sys
from notes_analyzer import NotesAnalyzer

def test_subject_detection():
    """Test subject code detection"""
    print("\n" + "="*60)
    print("TEST 1: Subject Code Detection")
    print("="*60)

    analyzer = NotesAnalyzer()

    test_cases = [
        ("CS2301 - Data Structures", "CS2301", "Data Structures"),
        ("MA1101 Linear Algebra", "MA1101", "Linear Algebra"),
        ("Physics II: PH1101", "PH1101", "Physics II - Electricity & Magnetism"),
        ("[CH1001] General Chemistry", "CH1001", "Chemistry I - General Chemistry"),
    ]

    passed = 0
    for text, expected_code, expected_name in test_cases:
        code, name = analyzer.detect_subject(text)
        status = "✓ PASS" if code == expected_code else "✗ FAIL"
        print(f"\n{status}: {text}")
        print(f"  Expected: {expected_code} - {expected_name}")
        print(f"  Got: {code} - {name}")
        if code == expected_code:
            passed += 1

    return passed, len(test_cases)


def test_summary_generation():
    """Test summary generation"""
    print("\n" + "="*60)
    print("TEST 2: Summary Generation")
    print("="*60)

    analyzer = NotesAnalyzer()

    text = """
    Data structures are specialized formats for organizing and storing data.
    Arrays store elements in contiguous memory locations.
    Linked lists connect elements through pointers.
    Both are fundamental to computer science.
    Understanding them is crucial for efficient programming.
    """

    summary = analyzer.generate_undergraduate_summary(text, num_sentences=2)
    print(f"\nOriginal text ({len(text.split())} words)")
    print(f"Summary ({len(summary.split())} words):")
    print(f"  {summary}")

    if len(summary.split()) < len(text.split()):
        print("\n✓ PASS: Summary is shorter than original")
        return 1, 1
    else:
        print("\n✗ FAIL: Summary not properly shortened")
        return 0, 1


def test_concept_extraction():
    """Test key concept extraction"""
    print("\n" + "="*60)
    print("TEST 3: Key Concept Extraction")
    print("="*60)

    analyzer = NotesAnalyzer()

    text = """
    Binary Search Tree (BST) is a tree data structure where each node has at most
    two children. The left child is always smaller than the parent node, and the
    right child is always larger. BST enables efficient searching, insertion, and
    deletion operations. Common operations on BST include traversal, search, and
    balancing. AVL trees and Red-Black trees are self-balancing BST variants.
    """

    concepts = analyzer.extract_key_concepts(text, num_concepts=8)
    print(f"\nExtracted {len(concepts)} concepts:")
    for i, concept in enumerate(concepts, 1):
        print(f"  {i}. {concept}")

    if len(concepts) > 0 and "search" in [c.lower() for c in concepts]:
        print("\n✓ PASS: Key concepts extracted successfully")
        return 1, 1
    else:
        print("\n✗ FAIL: Expected concepts not found")
        return 0, 1


def test_definition_extraction():
    """Test definition extraction"""
    print("\n" + "="*60)
    print("TEST 4: Definition Extraction")
    print("="*60)

    analyzer = NotesAnalyzer()

    text = """
    Recursion is defined as a programming technique where a function calls itself.
    Base case is a condition that stops the recursion.
    Stack overflow refers to when recursion depth exceeds available memory.
    """

    definitions = analyzer.extract_definitions(text)
    print(f"\nExtracted {len(definitions)} definitions:")
    for defn in definitions:
        print(f"  • {defn['term']}: {defn['definition'][:60]}...")

    if len(definitions) > 0:
        print("\n✓ PASS: Definitions extracted successfully")
        return 1, 1
    else:
        print("\n✗ FAIL: No definitions extracted")
        return 0, 1


def test_content_metrics():
    """Test content metrics calculation"""
    print("\n" + "="*60)
    print("TEST 5: Content Metrics Calculation")
    print("="*60)

    analyzer = NotesAnalyzer()

    text = "Python is a high-level programming language. " * 20  # ~400 words

    metrics = analyzer._calculate_metrics(text)
    print(f"\nContent Metrics:")
    print(f"  Word count: {metrics['word_count']}")
    print(f"  Unique words: {metrics['unique_word_count']}")
    print(f"  Sentences: {metrics['sentence_count']}")
    print(f"  Reading time: {metrics['estimated_reading_time_minutes']} min")
    print(f"  Grade level: {metrics['estimated_grade_level']}")
    print(f"  Difficulty: {metrics['difficulty_level']}")
    print(f"  Vocabulary richness: {metrics['vocabulary_richness']}%")

    if (metrics['word_count'] > 0 and
        metrics['estimated_reading_time_minutes'] > 0 and
        metrics['difficulty_level'] in ['Easy', 'Moderate', 'Advanced']):
        print("\n✓ PASS: Metrics calculated correctly")
        return 1, 1
    else:
        print("\n✗ FAIL: Metrics calculation error")
        return 0, 1


def test_full_analysis():
    """Test full analysis"""
    print("\n" + "="*60)
    print("TEST 6: Full Notes Analysis")
    print("="*60)

    analyzer = NotesAnalyzer()

    text = """
    CS2301 - Data Structures

    Chapter 1: Introduction

    Data structures are fundamental concepts in computer science. A data structure
    organizes data efficiently for fast access and modification. Common data
    structures include arrays, linked lists, stacks, and queues. Arrays store
    data in contiguous memory. Linked lists use pointers for connection. Stacks
    follow LIFO principle. Queues follow FIFO principle.

    Each structure has different time complexity for operations. Understanding
    these complexity measures is crucial for writing efficient programs.
    """

    result = analyzer.analyze_notes(text)

    print(f"\nAnalysis Results:")
    print(f"  Subject: {result['subject']}")
    print(f"  Code: {result['subject_code']}")
    print(f"  Content Type: {result['content_type']}")
    print(f"  Concepts: {', '.join(result['key_concepts'][:5])}")
    print(f"  Difficulty: {result['metrics']['difficulty_level']}")

    if (result['subject_code'] == 'CS2301' and
        len(result['key_concepts']) > 0 and
        result['summary']):
        print("\n✓ PASS: Full analysis successful")
        return 1, 1
    else:
        print("\n✗ FAIL: Full analysis incomplete")
        return 0, 1


def test_study_guide():
    """Test study guide generation"""
    print("\n" + "="*60)
    print("TEST 7: Study Guide Generation")
    print("="*60)

    analyzer = NotesAnalyzer()

    text = """
    MA1101 - Linear Algebra

    Vectors are quantities with both magnitude and direction. A matrix is a
    rectangular array of numbers. Matrix operations include addition,
    multiplication, and transpose. Eigenvalues and eigenvectors are important
    concepts in linear algebra with applications in image processing.
    """

    study_guide = analyzer.generate_study_guide(text)

    print(f"\nStudy Guide Generated:")
    print(f"  Subject: {study_guide['subject']}")
    print(f"  Difficulty: {study_guide['difficulty_level']}")
    print(f"  Study Time: {study_guide['study_time_estimate_hours']} hour(s)")
    print(f"  Key Concepts: {len(study_guide['key_concepts'])}")
    print(f"  Definitions: {len(study_guide['key_definitions'])}")
    print(f"  Study Tips: {len(study_guide['study_tips'])}")

    if (study_guide['subject'] and
        study_guide['key_concepts'] and
        study_guide['study_tips']):
        print("\n✓ PASS: Study guide generated successfully")
        return 1, 1
    else:
        print("\n✗ FAIL: Study guide generation incomplete")
        return 0, 1


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("SafeLearn - Notes Analyzer Test Suite")
    print("="*60)

    tests = [
        test_subject_detection,
        test_summary_generation,
        test_concept_extraction,
        test_definition_extraction,
        test_content_metrics,
        test_full_analysis,
        test_study_guide,
    ]

    total_passed = 0
    total_tests = 0

    for test_func in tests:
        try:
            passed, total = test_func()
            total_passed += passed
            total_tests += total
        except Exception as e:
            print(f"\n✗ ERROR: {str(e)}")
            total_tests += 1

    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"\nTotal: {total_passed}/{total_tests} tests passed")

    if total_passed == total_tests:
        print("\n✓ All tests passed!")
        return 0
    else:
        print(f"\n✗ {total_tests - total_passed} test(s) failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
