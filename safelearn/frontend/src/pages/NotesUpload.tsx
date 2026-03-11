import { useState } from 'react'
import { analyzeNotes } from '../services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Upload, AlertCircle } from 'lucide-react'

export default function NotesUpload() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setError('')
    if (!title || !content) {
      setError('Please fill in both title and content')
      return
    }

    setLoading(true)
    try {
      const response = await analyzeNotes(title, content)
      setAnalysis(response.data)
    } catch (error) {
      console.error('Error analyzing notes:', error)
      setError('Failed to analyze notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Upload Study Notes</h1>
        <p className="text-lg text-gray-600 mt-2">Upload your notes and get AI-powered analysis</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add Your Notes</CardTitle>
          <CardDescription>Paste your study notes or upload content for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Note Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 5: Photosynthesis"
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <Label htmlFor="content">Note Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type your study notes here..."
              rows={12}
            />
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? (
              <>
                <span className="mr-2">Analyzing...</span>
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze Notes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered insights from your notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {(analysis as any).analysis?.word_count}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Words</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {(analysis as any).analysis?.estimated_read_time} min
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Read Time</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {(analysis as any).analysis?.key_concepts?.length}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Concepts</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {((analysis as any).analysis?.complexity_score * 100).toFixed(0)}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Complexity</p>
                </CardContent>
              </Card>
            </div>

            {/* Key Concepts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Concepts</h3>
              <div className="flex flex-wrap gap-2">
                {(analysis as any).analysis?.key_concepts?.map((concept: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {concept}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Summary</h3>
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {(analysis as any).analysis?.summary}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
