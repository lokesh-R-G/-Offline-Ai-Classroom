import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BarChart3, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

interface Question {
  id: number
  question: string
  type: 'mcq' | 'short_answer'
  options?: string[]
  correct_answer: string
  difficulty: string
  marks: number
}

interface Quiz {
  questions: Question[]
}

export default function QuizPage() {
  const [noteId, setNoteId] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleGenerateQuiz = async () => {
    setError('')
    if (!noteId) {
      setError('Please enter a note ID')
      return
    }

    setLoading(true)
    try {
      setQuiz({
        questions: [
          {
            id: 1,
            question: 'What is photosynthesis?',
            type: 'mcq',
            options: [
              'Process of converting light to chemical energy',
              'Process of converting chemical energy to light',
              'Process of breaking down food',
              'Process of absorbing oxygen'
            ],
            correct_answer: 'Process of converting light to chemical energy',
            difficulty: difficulty,
            marks: 1
          },
          {
            id: 2,
            question: 'Which of the following is a product of photosynthesis?',
            type: 'mcq',
            options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
            correct_answer: 'Oxygen',
            difficulty: difficulty,
            marks: 1
          },
          {
            id: 3,
            question: 'Explain the Calvin cycle (answer in 2-3 lines)',
            type: 'short_answer',
            correct_answer: 'Series of chemical reactions converting CO2 to glucose',
            difficulty: difficulty,
            marks: 3
          }
        ]
      })
      setAnswers({})
      setSubmitted(false)
    } catch (e) {
      console.error('Error generating quiz:', e)
      setError('Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuiz = () => {
    setSubmitted(true)
  }

  const calculateScore = () => {
    let score = 0
    if (quiz?.questions) {
      quiz.questions.forEach((q: Question) => {
        if (answers[q.id] === q.correct_answer || answers[q.id]?.trim() === q.correct_answer?.trim()) {
          score += q.marks
        }
      })
    }
    return score
  }

  const getTotalMarks = () => {
    if (!quiz?.questions) return 0
    return quiz.questions.reduce((sum: number, q: Question) => sum + q.marks, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Quiz Generator</h1>
        <p className="text-lg text-gray-600 mt-2">Generate practice quizzes from your study notes</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!quiz ? (
        <Card>
          <CardHeader>
            <CardTitle>Create a New Quiz</CardTitle>
            <CardDescription>Select your note and difficulty level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="noteId">Note ID</Label>
              <Input
                id="noteId"
                type="number"
                value={noteId}
                onChange={(e) => setNoteId(e.target.value)}
                placeholder="Enter the ID of the note to create quiz from"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <Button
              onClick={handleGenerateQuiz}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? 'Generating...' : <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Quiz
              </>}
            </Button>
          </CardContent>
        </Card>
      ) : !submitted ? (
        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-blue-900 font-semibold">
                Quiz - {quiz.questions.length} Questions | Difficulty: <span className="capitalize">{difficulty}</span>
              </p>
            </CardContent>
          </Card>

          {quiz.questions.map((question: Question, idx: number) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Q{idx + 1}. {question.question}
                  </CardTitle>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-semibold capitalize">
                      {question.type === 'mcq' ? 'MCQ' : 'Short Answer'}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold">
                      {question.marks} mark{question.marks > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {question.type === 'mcq' && question.options ? (
                  <div className="space-y-3">
                    {question.options.map((option: string, optIdx: number) => (
                      <label key={optIdx} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={answers[question.id] === option}
                          onChange={() =>
                            setAnswers({
                              ...answers,
                              [question.id]: option
                            })
                          }
                          className="w-5 h-5 mt-0.5"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [question.id]: e.target.value
                      })
                    }
                    placeholder="Type your answer here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={handleSubmitQuiz}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            Submit Quiz
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-900 font-semibold text-lg">Quiz Completed!</p>
                  <p className="text-green-700">Check your answers below</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{calculateScore()}</div>
                  <div className="text-green-700 font-semibold">out of {getTotalMarks()}</div>
                  <div className="text-lg font-bold text-green-600 mt-1">
                    {getTotalMarks() > 0 ? ((calculateScore() / getTotalMarks()) * 100).toFixed(1) : '0'}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {quiz.questions.map((question: Question, idx: number) => {
            const isCorrect = answers[question.id] === question.correct_answer || answers[question.id]?.trim() === question.correct_answer?.trim()
            return (
              <Card key={question.id} className={isCorrect ? 'border-green-200' : 'border-red-200'}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {isCorrect ? (
                        <CheckCircle2 className="text-green-600 h-5 w-5 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="text-red-600 h-5 w-5 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <CardTitle className="text-lg">Q{idx + 1}. {question.question}</CardTitle>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Your Answer:</p>
                    <p className={`p-3 rounded ${isCorrect ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
                      {answers[question.id] || 'Not answered'}
                    </p>
                  </div>
                  {!isCorrect && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Correct Answer:</p>
                      <p className="p-3 rounded bg-green-50 text-green-900">{question.correct_answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          <Button
            onClick={() => {
              setQuiz(null)
              setAnswers({})
              setSubmitted(false)
            }}
            className="w-full"
            variant="outline"
            size="lg"
          >
            Create Another Quiz
          </Button>
        </div>
      )}
    </div>
  )
}
