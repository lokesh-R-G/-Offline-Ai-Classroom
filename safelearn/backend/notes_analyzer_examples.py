"""
Notes Analyzer Examples & Test Cases
Demonstrates the usage of the NotesAnalyzer module
"""

from notes_analyzer import NotesAnalyzer

# Initialize analyzer
analyzer = NotesAnalyzer()

# ==========================================
# Example 1: Computer Science Notes
# ==========================================

CS_NOTES_EXAMPLE = """
CS2301 - Data Structures and Algorithms

Chapter 1: Introduction to Data Structures

A data structure is a specialized format for organizing and storing data that enables efficient access and modification.
This course covers fundamental data structures used in computer programming.

Key Concepts:
1. Arrays - A collection of elements stored in contiguous memory locations
2. Linked Lists - A sequence of nodes where each node contains data and a reference to the next node
3. Stack - A Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end
4. Queue - A First-In-First-Out (FIFO) data structure used for scheduling and buffering
5. Binary Trees - Hierarchical data structures with at most two children per node
6. Hash Tables - Data structures that implement associative arrays for fast lookup operations
7. Graphs - Collections of vertices and edges representing relationships

Chapter 2: Sorting Algorithms

Sorting is a fundamental operation in computer science. Common sorting algorithms include:
- Bubble Sort: O(n²) time complexity, simple but inefficient
- Merge Sort: O(n log n) time complexity, divide-and-conquer approach
- Quick Sort: O(n log n) average time complexity, widely used in practice
- Heap Sort: O(n log n) time complexity, in-place sorting

Chapter 3: Searching Techniques

Linear Search: O(n) complexity, searches elements sequentially
Binary Search: O(log n) complexity, requires sorted array

The choice of data structure and algorithm significantly impacts program performance and resource usage.
"""

print("=" * 60)
print("EXAMPLE 1: Computer Science Notes Analysis")
print("=" * 60)

result1 = analyzer.analyze_notes(CS_NOTES_EXAMPLE)
print(f"\nSubject: {result1['subject']}")
print(f"Subject Code: {result1['subject_code']}")
print(f"\nSummary:")
print(f"{result1['summary']}\n")
print(f"Key Concepts: {', '.join(result1['key_concepts'])}")
print(f"\nMetrics:")
for key, value in result1['metrics'].items():
    print(f"  {key}: {value}")

# ==========================================
# Example 2: Mathematics Notes
# ==========================================

MATH_NOTES_EXAMPLE = """
MA1101 - Linear Algebra Fundamentals

Introduction to Linear Algebra

Linear Algebra is the branch of mathematics concerning vector spaces and linear mappings between such spaces.

Chapter 1: Vectors and Matrices

Definition: A vector is an ordered list of numbers. Vectors can be represented as rows or columns.
A matrix is a rectangular array of numbers arranged in rows and columns.

Key Properties:
1. Matrix Addition: Only matrices of the same dimensions can be added
2. Scalar Multiplication: Each element of a matrix is multiplied by a scalar value
3. Matrix Multiplication: The number of columns in the first matrix must equal the number of rows in the second matrix
4. Transpose: Switching rows and columns of a matrix
5. Determinant: A scalar value computed from a square matrix
6. Inverse: A matrix that, when multiplied with the original, gives the identity matrix

Chapter 2: Systems of Linear Equations

A system of linear equations can be represented as matrix equation Ax = b, where A is the coefficient matrix.

Methods for solving:
- Gaussian Elimination: Reducing matrix to row echelon form
- Matrix Inversion Method: Using A⁻¹ to find x = A⁻¹b
- Cramer's Rule: Using determinants to solve systems
- LU Decomposition: Factoring matrix into lower and upper triangular matrices

Chapter 3: Eigenvalues and Eigenvectors

Definition: For a square matrix A, a non-zero vector v is an eigenvector if Av = λv, where λ is an eigenvalue.

Applications: Principal Component Analysis, image compression, stability analysis of dynamic systems.

The theorem states that every symmetric matrix has real eigenvalues and orthogonal eigenvectors.
"""

print("\n" + "=" * 60)
print("EXAMPLE 2: Mathematics Notes Analysis")
print("=" * 60)

result2 = analyzer.analyze_notes(MATH_NOTES_EXAMPLE)
print(f"\nSubject: {result2['subject']}")
print(f"Subject Code: {result2['subject_code']}")
print(f"\nSummary:")
print(f"{result2['summary']}\n")
print(f"Key Concepts: {', '.join(result2['key_concepts'])}")
print(f"Content Type: {result2['content_type']}")

# ==========================================
# Example 3: Generate Complete Study Guide
# ==========================================

print("\n" + "=" * 60)
print("EXAMPLE 3: Complete Study Guide Generation")
print("=" * 60)

PHYSICS_NOTES = """
PH1001 - Physics I: Mechanics and Motion

Chapter 1: Kinematics Basics

Motion is described using three fundamental quantities: displacement, velocity, and acceleration.

Definitions:
- Displacement is the change in position of an object
- Velocity is the rate of change of displacement
- Acceleration is the rate of change of velocity

Important Equations:
v = u + at (velocity equation)
s = ut + ½at² (displacement equation)
v² = u² + 2as (kinematic equation)

Where: v = final velocity, u = initial velocity, a = acceleration, t = time, s = displacement

Chapter 2: Newton's Laws of Motion

Theorem 1 (Law of Inertia): An object at rest remains at rest unless acted upon by an external force.
Theorem 2 (Force-Mass-Acceleration): F = ma, force equals mass times acceleration.
Theorem 3 (Action-Reaction): For every action, there is an equal and opposite reaction.

Example: Consider a 5 kg object accelerating at 2 m/s². The applied force is F = 5 × 2 = 10 Newtons.

Chapter 3: Energy and Work

Work done by a force: W = F × d × cos(θ)
Kinetic Energy: KE = ½mv²
Potential Energy: PE = mgh

The conservation of energy principle states that total mechanical energy remains constant in isolated systems.

Applications: Understanding planetary motion, calculating collision impacts, designing roller coasters.
"""

study_guide = analyzer.generate_study_guide(PHYSICS_NOTES)
print(f"\nSubject: {study_guide['subject']}")
print(f"Subject Code: {study_guide['subject_code']}")
print(f"\nSummary:")
print(f"{study_guide['summary']}\n")
print(f"Key Concepts: {', '.join(study_guide['key_concepts'])}")
print(f"\nKey Definitions:")
for defn in study_guide['key_definitions'][:3]:
    print(f"  • {defn['term']}: {defn['definition'][:100]}...")

print(f"\nDifficulty Level: {study_guide['difficulty_level']}")
print(f"Estimated Study Time: {study_guide['study_time_estimate_hours']} hour(s)")
print(f"\nStudy Tips:")
for i, tip in enumerate(study_guide['study_tips'], 1):
    print(f"  {i}. {tip}")

# ==========================================
# Example 4: Subject Detection
# ==========================================

print("\n" + "=" * 60)
print("EXAMPLE 4: Subject Auto-Detection")
print("=" * 60)

test_texts = [
    ("We study binary trees and graph algorithms using dynamic programming", "Computer Science"),
    ("The derivative and integral are fundamental concepts in calculus", "Mathematics"),
    ("Force, acceleration, and momentum relate through Newton's second law", "Physics"),
    ("DNA replication and protein synthesis in cell biology", "Biology"),
]

for text, expected_subject in test_texts:
    code, subject = analyzer.detect_subject(text)
    inferred_code, inferred_name = analyzer._infer_subject_from_keywords(text)
    print(f"\nText: '{text[:50]}...'")
    print(f"  Expected: {expected_subject}")
    print(f"  Detected Code: {code or 'Not found'}")
    print(f"  Inferred: {inferred_name or 'Not inferred'}")

# ==========================================
# Example 5: Definition Extraction
# ==========================================

print("\n" + "=" * 60)
print("EXAMPLE 5: Definition Extraction")
print("=" * 60)

text_with_definitions = """
Photosynthesis is the process by which plants convert light energy into chemical energy.
A polymer is defined as a large molecule composed of many smaller subunits bonded together.
Recursion refers to a function calling itself with modified parameters.
"""

definitions = analyzer.extract_definitions(text_with_definitions)
print(f"\nExtracted Definitions:")
for defn in definitions:
    print(f"  • {defn['term']}: {defn['definition']}")

# ==========================================
# Example 6: Output Format Demonstration
# ==========================================

print("\n" + "=" * 60)
print("EXAMPLE 6: Output Format (as required)")
print("=" * 60)

output = {
    'subject': result1['subject'],
    'subject_code': result1['subject_code'],
    'summary': result1['summary'][:100] + '...',
    'key_concepts': result1['key_concepts'],
}

import json
print("\nJSON Output Format:")
print(json.dumps(output, indent=2))

print("\n" + "=" * 60)
print("Notes Analyzer Examples Complete")
print("=" * 60)
