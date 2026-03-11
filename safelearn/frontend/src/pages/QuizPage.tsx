import { useState } from 'react'

export default function QuizPage() {
  const [noteId, setNoteId] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState({})

  const handleGenerateQuiz = async () => {
    if (!noteId) {
      alert('Please enter a note ID')
      return
    }

    setLoading(true)
    try {
      // In a real app, you'd call generateQuiz from the API
      // For now, we'll show a placeholder
      setQuiz({
        questions: [
          {
            id: 1,
            question: 'What is photosynthesis?',
            options: [
              'Process of converting light to chemical energy',
              'Process of converting chemical energy to light',
              'Process of breaking down food',
              'Process of absorbing oxygen'
            ],
            correct_answer: 'Option A',
            difficulty: difficulty
          },
          {
            id: 2,
            question: 'Which of the following is a product of photosynthesis?',
            options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
            correct_answer: 'Option B',
            difficulty: difficulty
          }
        ]
      })
    } catch (error) {
      console.error('Error generating quiz:', error)
      alert('Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuiz = () => {
    let score = 0
    if (quiz?.questions) {
      quiz.questions.forEach((q: any) => {
        if (answers[q.id] === q.correct_answer) {
          score++
        }
      })
    }
    alert(`Quiz submitted! You got ${score}/${quiz?.questions.length} correct`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quiz Generator</h1>
        <p className="text-gray-600">Generate practice quizzes from your study notes</p>
      </div>

      {!quiz ? (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Note ID</label>
            <input
              type="number"
              value={noteId}
              onChange={(e) => setNoteId(e.target.value)}
              placeholder="Enter the ID of the note to create quiz from"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-blue"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="w-full bg-safety-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-2xl font-bold">Quiz Time!</h2>

          {quiz.questions.map((question: any, idx: number) => (
            <div key={question.id} className="border-b pb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">
                  Question {idx + 1}: {question.question}
                </h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                  {question.difficulty}
                </span>
              </div>

              <div className="space-y-2">
                {question.options.map((option: string, optIdx: number) => (
                  <label key={optIdx} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={optIdx}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          [question.id]: question.options[parseInt(e.target.value)]
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmitQuiz}
            className="w-full bg-safety-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  )
}
