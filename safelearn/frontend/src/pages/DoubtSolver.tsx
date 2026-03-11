import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { HelpCircle, Lightbulb, BookMarked } from 'lucide-react'

interface SolutionType {
  doubt: string
  explanation: string
  related_concepts: string[]
  examples: string[]
  difficulty_level: string
}

export default function DoubtSolver() {
  const [doubt, setDoubt] = useState('')
  const [context, setContext] = useState('')
  const [solution, setSolution] = useState<SolutionType | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSolveDoubt = async () => {
    if (!doubt) {
      return
    }

    setLoading(true)
    try {
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Doubt Solver</h1>
        <p className="text-lg text-gray-600 mt-2">Ask any academic question and get instant AI-powered explanations</p>
      </div>

      {!solution ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Ask Your Question
            </CardTitle>
            <CardDescription>Get instant AI-powered explanations with examples and related concepts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="doubt">Your Doubt</Label>
              <Textarea
                id="doubt"
                value={doubt}
                onChange={(e) => setDoubt(e.target.value)}
                placeholder="Ask your question here..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Context (Optional)</Label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add any relevant context from your notes..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleSolveDoubt}
              disabled={loading || !doubt}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? 'Solving...' : <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Solve My Doubt
              </>}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-green-900">Solution Found!</p>
                  <p className="text-sm text-green-700 mt-1">Here's your comprehensive answer</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  solution.difficulty_level === 'easy' ? 'bg-green-100 text-green-700' :
                  solution.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}`}
                >
                  {solution.difficulty_level}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-blue-600" />
                Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{solution.explanation}</p>
            </CardContent>
          </Card>

          {solution.examples && solution.examples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {solution.examples.map((example, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 font-bold min-w-fit">•</span>
                      <p className="text-gray-700">{example}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {solution.related_concepts && solution.related_concepts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Concepts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {solution.related_concepts.map((concept, idx) => (
                    <div key={idx} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                      {concept}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={() => {
              setDoubt('')
              setContext('')
              setSolution(null)
            }}
            className="w-full"
            variant="outline"
            size="lg"
          >
            Ask Another Doubt
          </Button>
        </div>
      )}
    </div>
  )
}
