import { useState } from 'react'

export default function DoubtSolver() {
  const [doubt, setDoubt] = useState('')
  const [context, setContext] = useState('')
  const [solution, setSolution] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSolveDoubt = async () => {
    if (!doubt) {
      alert('Please enter your doubt')
      return
    }

    setLoading(true)
    try {
      // In a real app, you'd call solveDoubt from the API
      setSolution({
        doubt: doubt,
        explanation: 'This is a comprehensive explanation of your doubt. The AI model has analyzed your question and provided an in-depth answer with examples and related concepts.',
        related_concepts: ['Concept 1', 'Concept 2', 'Concept 3'],
        examples: [
          'Example 1: This demonstrates the concept in practice.',
          'Example 2: Another real-world application of this concept.'
        ],
        difficulty_level: 'intermediate'
      })
    } catch (error) {
      console.error('Error solving doubt:', error)
      alert('Failed to solve doubt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Doubt Solver</h1>
        <p className="text-gray-600">Ask any academic question and get instant AI-powered explanations</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Your Doubt</label>
          <textarea
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            placeholder="Ask your question here... (e.g., 'What is the difference between mitosis and meiosis?')"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Context (Optional)</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add any relevant context from your notes..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safety-blue"
          />
        </div>

        <button
          onClick={handleSolveDoubt}
          disabled={loading}
          className="w-full bg-safety-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Solving...' : 'Solve My Doubt'}
        </button>
      </div>

      {solution && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Solution</h2>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="font-semibold text-safety-blue mb-2">Difficulty Level</div>
              <div className="capitalize text-gray-700">{solution.difficulty_level}</div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Explanation</h3>
                <p className="text-gray-700 leading-relaxed">{solution.explanation}</p>
              </div>

              {solution.examples && solution.examples.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Examples</h3>
                  <ul className="space-y-2">
                    {solution.examples.map((example: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-safety-blue font-semibold min-w-fit">•</span>
                        <span className="text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {solution.related_concepts && solution.related_concepts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Related Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {solution.related_concepts.map((concept: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-safety-blue px-3 py-1 rounded-full text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setDoubt('')
              setContext('')
              setSolution(null)
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Ask Another Doubt
          </button>
        </div>
      )}
    </div>
  )
}
